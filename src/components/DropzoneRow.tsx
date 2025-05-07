import { X } from "lucide-react";
import { Button } from "./ui/button";

interface DropzoneRowProps {
    file: File;
    width: number;
    height: number;
    removeRow: (fileName: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const DropzoneRow: React.FC<DropzoneRowProps> = ({ file, width, height, removeRow }) => {

    const isMb = (file.size / 1000) >= 1000
    const fileSize = isMb ? `${(file.size / 1000000).toFixed(2)} MB` : `${(file.size / 1000).toFixed(2)} KB`
    return (
        <li className="text-sm w-full flex gap-2 justify-between items-center">
            <div className="flex gap-2 items-center">
                <span className="p-2 rounded bg-muted border inline-block">{file.name}</span>
                <span className="inline-block">{width} x {height}</span>
                <span className="inline-block">{fileSize}</span>
            </div>
            <Button variant={'ghost'} className="has-[>svg]:px-2 py-2 leading-0 h-auto" onClick={(e) => removeRow(file.name, e)}><X /></Button>
        </li>
    )
}