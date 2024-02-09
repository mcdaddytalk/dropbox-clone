import { useUser } from "@clerk/nextjs";
import { useAppStore } from "@/store/store";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { db } from "@/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";

export default function RenameModal() {
    const [input, setInput] = useState("");
    const { user } = useUser();
    
    const [setIsRenameModalOpen, isRenameModalOpen, fileId, setFileId, fileName] = useAppStore((state) => [
        state.setIsRenameModalOpen,
        state.isRenameModalOpen,
        state.fileId,
        state.setFileId,
        state.fileName
    ]);
    const renameFile = async () => {
        if (!user || !fileId) return;
        
        const toastId = toast.loading("Renaming file...");

        await updateDoc(doc(db, "users", user.id, "files", fileId), {
            filename: input
        });

        toast.success("Renamed file successfully", { id: toastId });

        setIsRenameModalOpen(false);
        setFileId(null);
    }

    return (
        <Dialog
            open={isRenameModalOpen}
            onOpenChange={(isOpen) => {
                setIsRenameModalOpen(isOpen)
        }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rename File</DialogTitle>
                </DialogHeader>
                <Input
                    id="link"
                    defaultValue={fileName as string}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDownCapture={(e) => {
                        if (e.key === "Enter") {
                            renameFile();
                        }
                    }}
                />
                <DialogFooter className="flex space-x-2 py-3">
                    <Button
                        size={"sm"}
                        className="px-3"
                        variant={"ghost"}
                        onClick={() => setIsRenameModalOpen(false)}
                    >
                        <span className="sr-only">Cancel</span>
                        <span>Cancel</span>
                    </Button>
                    <Button
                        type="submit"
                        size={"sm"}
                        className="px-3"
                        onClick={() => renameFile()}
                    >
                        <span className="sr-only">Rename</span>
                        <span>Rename</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
