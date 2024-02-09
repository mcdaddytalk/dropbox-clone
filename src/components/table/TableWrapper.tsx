"use client"

import React, { useEffect, useState } from 'react'
import { FileDoc } from '../../../types'
import { Button } from '../ui/button'
import DataTable from './DataTable'
import { columns } from './columns'
import { useUser } from '@clerk/nextjs'
import { db } from '@/firebase'
import { query, collection, orderBy } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Skeleton } from '../ui/skeleton'

type TableWrapperProps = {
    files: FileDoc[]
}
export default function TableWrapper({
  files
}: Readonly<TableWrapperProps>) {
    const { user } = useUser();
    const [initialFiles, setInitialFiles ] = useState<FileDoc[]>([]);
    const [sort, setSort] = useState<"asc" | "desc">('desc')
  
    const [docs, loading, error] = useCollection(
        user && query(collection(db, "users", user.id, "files"), orderBy("timestamp", sort)),
    )

    useEffect(() => {
        if (!docs) return;
        setInitialFiles(docs.docs.map((doc) => ({
            id: doc.id,
            filename: doc.data().filename || doc.id,
            timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
            fullName: doc.data().fullName,
            downloadUrl: doc.data().downloadUrl,
            type: doc.data().type,
            size: doc.data().size
        })))
    }, [docs])

    if (loading) return (
        <div className="flex flex-col">
            <Button variant={'outline'} className="ml-auto w-36 h-10 mb-5">
                <Skeleton className="h-5 w-full" />
            </Button>
            <div className="border rounded-lg">
                <div className="border-b h-12" />
                {files.map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center space-x-4 p-5 w-ful"
                    >
                        <Skeleton className="h-12 w-12" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ))}
                {files.length === 0 && (
                    <div className="flex items-center space-x-4 p-5 w-ful">
                        <Skeleton className="h-12 w-12" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                )}
            </div>
        </div>
    )
    if (error) return <p>Error: {error.message}</p>

    return (
        <div className="flex flex-col space-y-5 pb-10">
            <Button
                variant={'outline'}
                className="ml-auto w-fit"
                onClick={() => {
                    setSort(sort === "desc" ? "asc" : "desc")
                }}
            >
                Sort By {sort === 'desc' ? "Newest" : "Oldest"}
            </Button>
            <DataTable columns={columns} data={initialFiles} />
        </div>
    )
}
