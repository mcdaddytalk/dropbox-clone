"use client"

import React from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { FileDoc } from '../../../types'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useAppStore } from '@/store/store'
import RenameModal from '../RenameModal'
import DeleteModal from '../DeleteModal'
   
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}
  
export default function DataTable<TData, TValue>({
    columns,
    data
}: Readonly<DataTableProps<TData, TValue>>) {
    const [setIsDeleteModalOpen, setIsRenameModalOpen, setFileId, setFilename] = useAppStore((state) => [
        state.setIsDeleteModalOpen,
        state.setIsRenameModalOpen,
        state.setFileId,
        state.setFilename
    ])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const openDeleteModal = (fileId: string) => {
        setFileId(fileId)
        setIsDeleteModalOpen(true)
    }

    const openRenameModal = (fileId: string, fileName: string) => {
        setFileId(fileId)
        setFilename(fileName)
        setIsRenameModalOpen(true)
    }

    return (
        <div className="rounded-md border">
        <Table>
            <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            <DeleteModal />
                            <RenameModal />
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {cell.column.id === 'timestamp' 
                                    ? (
                                        <div className='flex flex-col'>
                                            <div className="text-sm">
                                                {(cell.getValue() as Date).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {(cell.getValue() as Date).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    )
                                    : cell.column.id === 'filename'
                                        ? (
                                            <p
                                                onClick={() => {
                                                    openRenameModal(
                                                        (row.original as FileDoc).id,
                                                        (row.original as FileDoc).filename
                                                    )
                                                }}
                                                className="underline flex items-center text-blue-500 hover:cursor-pointer"
                                            >
                                                {cell.getValue() as string}{" "}
                                                <PencilIcon size={15} className="ml-2" />
                                            </p>
                                        )
                                        : (
                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                        )
                                }
                            </TableCell>
                            ))}
                            <TableCell key={(row.original as FileDoc).id}>
                                <Button
                                    variant={'outline'}
                                    onClick={() => openDeleteModal((row.original as FileDoc).id)}
                                >
                                    <TrashIcon size={20} />
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            You have no files
                        </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
