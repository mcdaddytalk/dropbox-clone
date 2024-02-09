import DropZone from '@/components/DropZone';
import { db } from '@/firebase';
import { auth } from '@clerk/nextjs';
import { collection, getDocs } from 'firebase/firestore';
import React from 'react'
import { FileDoc } from '../../../types';
import TableWrapper from '@/components/table/TableWrapper';

export default async function Dashboard() {
    const { user, userId } = auth();

    const docResults = await getDocs(collection(db, "users", userId!, "files"));
    
    const skeletonFiles: FileDoc[] = docResults.docs.map((doc) => {
        return {
            id: doc.id,
            filename: doc.data().filename || doc.id,
            timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
            fullName: doc.data().fullName,
            downloadUrl: doc.data().downloadUrl,
            type: doc.data().type,
            size: doc.data().size
        }
    });

    console.log(skeletonFiles)

    return (
        <div className="border-t">
            <DropZone />
            <section className="container space-y-5">
                <h2 className="font-bold">All Files</h2>
                <div>
                    <TableWrapper files={skeletonFiles} />
                </div>
            </section>
        </div>
    )
}
