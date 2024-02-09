"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { useAppStore } from '@/store/store'
import { useUser } from '@clerk/nextjs'
import { storage, db } from '@/firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { toast } from 'react-hot-toast'

export default function DeleteModal() {
    const { user } = useUser();

    const [setIsDeleteModalOpen, isDeleteModalOpen, fileId, setFileId] = useAppStore((state) => [
        state.setIsDeleteModalOpen,
        state.isDeleteModalOpen,
        state.fileId,
        state.setFileId
    ])

    const deleteFile = async () => {
        if (!user || !fileId) return;

        const toastId = toast.loading('Deleting file...')

        const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);

        deleteObject(fileRef)
            .then(async () => {
                await deleteDoc(doc(db, "users", user.id, "files", fileId));
                toast.success("File deleted successfully", { id: toastId });
            }).catch((error) => {
                toast.error("Error deleting file", { id: toastId })
                console.error(error)
            }).finally(() => {
                setIsDeleteModalOpen(false);
                setFileId(null);
            })
        
    }

    return (
        <Dialog
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
                setIsDeleteModalOpen(isOpen)
            }}
        >
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Are you absolutely sure you want to delete?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </DialogDescription>
            </DialogHeader>           

            <DialogFooter className="flex space-x-2 py-3">
                <Button
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() => setIsDeleteModalOpen(false)}
                    className='px-3 flex-1'
                >
                    <span className="sr-only">Cancel</span>
                    <span>Cancel</span>
                </Button>
                <Button 
                    variant={'destructive'}
                    type="submit"
                    className='px-3 flex-1'
                    size={'sm'}
                    onClick={() => deleteFile()}
                >
                   <span className="sr-only">Delete</span>
                    <span>Delete</span>
                </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )
}
