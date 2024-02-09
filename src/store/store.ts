import { create } from 'zustand'

interface AppState {
    setIsDeleteModalOpen: (open: boolean) => void;
    isDeleteModalOpen: boolean;
    setIsRenameModalOpen: (open: boolean) => void;
    isRenameModalOpen: boolean;

    fileId: string | null;
    setFileId: (fileId: string | null) => void;

    fileName: string | null;
    setFilename: (fileName: string | null) => void;
}

export const useAppStore = create<AppState>()((set) => ({
    isDeleteModalOpen: false,
    setIsDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),
    isRenameModalOpen: false,
    setIsRenameModalOpen: (open) => set({ isRenameModalOpen: open }),
    fileId: null,
    setFileId: (fileId) => set({ fileId }),
    fileName: null,
    setFilename: (fileName) => set({ fileName }),
}))