"use client"

import { ColumnDef } from "@tanstack/react-table"
import { FileDoc } from "../../../types"
import prettyBytes from "pretty-bytes"
import { FileIcon, defaultStyles } from "react-file-icon";
import { COLOR_EXTENSION_MAP } from "@/constants";

export const columns: ColumnDef<FileDoc>[] = [
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ renderValue, ...props }) => {
            const type = renderValue() as string;
            const extension = type.split("/")[1];
            return (
                <div className="w-10">
                    <FileIcon
                        extension={extension}
                        labelColor={COLOR_EXTENSION_MAP[extension]}
                        // @ts-ignore
                        {...defaultStyles[extension]}
                    />
                </div>
            )
        }
    },
    {
        accessorKey: "filename",
        header: "FileName",
    },
    {
        accessorKey: "timestamp",
        header: "Date Added",
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ renderValue, ...props }) => { return <span>{prettyBytes(renderValue() as number)}</span> }
    },
    {
        accessorKey: "downloadUrl",
        header: "Download",
        cell: ({ renderValue, ...props }) => {
            return <a href={renderValue() as string} target="_blank" rel="noreferrer" className="underline text-blue-500 hover:text-blue-600">Download</a>
        }
    }
]