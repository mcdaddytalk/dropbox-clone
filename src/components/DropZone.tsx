"use client"

import { db, storage } from '@/firebase'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { toast } from 'react-hot-toast'

const maxSize = 1024 * 1024 * 20 // 20MB

export default function DropZone() {
    const [loading, setLoading] = useState(false);
    const { isLoaded, isSignedIn, user } = useUser();

    const onDrop = (acceptedFiles: File[]) => {
        console.log('acceptedFiles: ', acceptedFiles)
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = async () => {
                await uploadPost(file);
            }
            reader.readAsArrayBuffer(file);
        })      
    }

    const uploadPost = async (file: File) => {
        if (loading) return;
        if (!user) return;

        setLoading(true);

        // Perform file upload here
        const toastId = toast.loading("Uploading file(s)...");

        // addDoc -> users/user1234/files
        const docRef = await addDoc(
            collection(db, "users", user.id, "files"), {
                filename: file.name,
                fullName: user.fullName,
                profileImgUrl: user.imageUrl,
                timestamp: serverTimestamp(),
                type: file.type,
                size: file.size                
            }
        )
        
        const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`)
        
        uploadBytes(imageRef, file)
            .then(async () => {
                const url = await getDownloadURL(imageRef);
                await updateDoc(doc(db, 'users', user.id, 'files', docRef.id), {
                    downloadUrl: url
                })

                toast.success("File uploaded successfully", { id: toastId });

                setLoading(false)
            })
            .catch((error: unknown) => {
                toast.error("Error uploading file", { id: toastId })
                console.error(error)
                setLoading(false);
            });
    }
  
    return (
        <Dropzone
            minSize={0}
            maxSize={maxSize}
            onDrop={onDrop}
        >
            {({
                getRootProps,
                getInputProps,
                isDragActive,
                isDragReject,
                fileRejections
            }) => {
                const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize
                return (
                    <section className="m-4">
                        <div {...getRootProps()}
                            className={cn(
                                "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center",
                                isDragActive 
                                            ? "bg-[#035FFE] text-white animate-pulse" 
                                            : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"

                            )}
                        >
                            <input {...getInputProps()} />
                            {!isDragActive && "Click here or drop a file to upload"}
                            {isDragActive && !isDragReject && "Drop it like it&apos;s hot"}
                            {isDragReject && "File type not accepted"}
                            {isFileTooLarge && (
                                <div className="text-danger mt-2">File too large</div>
                            )}
                        </div>
                    </section>
                )
            }}

        </Dropzone>
    )
}
