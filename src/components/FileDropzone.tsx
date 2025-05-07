import { useEffect, useState } from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { LoaderCircle } from "lucide-react"
import { DropzoneRow } from "./DropzoneRow"

interface FileDropzoneProps {
    files: File[] | undefined
    setFiles: (files: File[]) => void
    setError: (message: string) => void
    clearError: () => void
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ files, setFiles, setError, clearError }) => {

    const [data, setData] = useState<{ file: File, width: number, height: number }[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/jpeg': ['.jpeg']
        },
        onDrop: (acceptedFiles, rejectedFiles, event) => {
            setData([])
            if (acceptedFiles) {
                setFiles(acceptedFiles)
            } if (rejectedFiles && rejectedFiles.length > 0) {
                setError('Please select a valid file')
            } else {
                clearError()
            }
        }
    });

    const getImageDimensions = async (file: File): Promise<{ width: number, height: number } | Error> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                const dimensions = { width: img.width, height: img.height };
                URL.revokeObjectURL(objectUrl); // Clean up
                resolve(dimensions);
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error(`Failed to load image: ${file.name}`));
            };

            img.src = objectUrl;
        });
    }

    const removeRow = (fileName: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();
        event.stopPropagation()
        setData((current) => current.filter((item) => item.file.name !== fileName));
        setFiles(files?.filter((file) => file.name !== fileName) || []);
    }

    useEffect(() => {
        try {
            (async () => {
                setIsLoading(true)
                setData([])
                const promises = files?.map(async (file, index) => {
                    const dimensions = await getImageDimensions(file)
                    if (!(dimensions instanceof Error)) {
                        setData((current) => [...current, { file, width: dimensions.width, height: dimensions.height }]);
                    }
                    return dimensions
                }) || []
                await Promise.all(promises)
            })()
        } catch (error: any) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }


    }, [files])

    return (
        <div>
            <div {...getRootProps({ className: `dropzone p-6 pb-0 rounded border border-dashed ${isDragActive ? 'border-foreground' : ''} w-full min-h-64 flex flex-col gap-2 justify-center items-center` })} >
                <input {...getInputProps()} />
                <p>Drop files here</p>

                {(data && data.length > 0) &&
                    <ul className="max-h-64 overflow-y-scroll py-6 flex flex-col gap-2 inset-shadow-2xs">{data.map((item, index) =>
                        <DropzoneRow file={item.file} width={item.width} height={item.height} key={index} removeRow={removeRow} />
                    )}
                    </ul>
                }
                {isLoading && <LoaderCircle className="animate-spin" />}
            </div>

        </div>

    )
}