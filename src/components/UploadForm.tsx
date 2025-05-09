import { actions } from "astro:actions"
import { useEffect, useState } from "react"
import { useForm, type ErrorOption, type SubmitHandler } from "react-hook-form"
import { Button } from "./ui/button"
import { FileDropzone } from "./FileDropzone"
import type { DropzoneOptions } from "react-dropzone"
import { Label } from "./ui/label"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { Slider } from "./ui/slider"
import { LoaderCircle } from "lucide-react"
import JSZip from 'jszip'
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"

type FormInput = {
    files: File[] | undefined
    fileType: 'webp' | 'avif'
    quality: string
    width: string | undefined
}
type DownloadData = {
    filename: string,
    url: string,
    size: number,
    saved: number
}



export const UploadForm = () => {
    const [downloadData, setDownloadData] = useState<DownloadData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [fileType, setFileType] = useState<'webp' | 'avif'>("avif")


    const {
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
        register
    } = useForm<FormInput>({ defaultValues: { files: undefined, fileType: fileType, quality: '75', width: undefined } })
    const quality = watch('quality')
    const files = watch('files')
    const width = watch('width')

    const setFilesValue = (files: File[]) => {
        setValue('files', files)
    }
    const setFilesError = (message: string) => {
        setError('files', { message });
    }
    const clearFilesError = () => {
        clearErrors('files')
    }

    const downloadZip = async (data: DownloadData[]) => {
        const zip = new JSZip();
        const folder = zip.folder('optimized_images');
        const promises = data.map(async (item) => {
            const response = await fetch(item.url);
            const blob = await response.blob();
            folder?.file(item.filename, blob)
            return
        })
        await Promise.all(promises)
        zip.generateAsync({ type: "blob" }).then(content => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = folder?.name || 'optimized_images';
            a.click();
        });
    }

    const onSubmit: SubmitHandler<FormInput> = async (data) => {
        if (!data.files || data.files.length === 0) {
            setError('files', { message: 'No files selected' })
            return
        }
        console.log(data)
        setDownloadData([])
        setIsLoading(true)
        const promises = Array.from(Array(data.files.length)).map(async (_, index) => {
            return new Promise<void>((resolve) => {
                // Wait 1 second between each file upload to prevent too many requests at once.
                setTimeout(async () => {
                    const file = data?.files?.at(index);
                    if (!file) return
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('type', data.fileType)
                    formData.append('quality', data.quality)
                    formData.append('width', data.width || '')
                    const { data: resData, error } = await actions.compressImage(formData)
                    if (resData) {
                        const blob = new Blob([resData], { type: `image/${data.fileType}` });
                        const url = URL.createObjectURL(blob);
                        const newFile = new File([blob], `${file.name.split('.', -1)[0]}.${data.fileType}`, {
                            type: blob.type,
                        });
                        const saved = 100 - ((newFile.size / file.size) * 100)
                        setDownloadData((current) => [...current, { filename: newFile.name, url, size: newFile.size, saved: saved }])
                    }
                    if (error) {
                        console.error(`Error compressing image: ${JSON.stringify({ error })} `)
                    }
                    resolve()
                }, 1000 * index)
            })

        })
        await Promise.all(promises)
        setIsLoading(false);
    }

    useEffect(() => {
        setValue('fileType', fileType)
    }, [fileType])

    return <div className="flex flex-col gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            <FileDropzone files={files} setFiles={setFilesValue} setError={setFilesError} clearError={clearFilesError} />
            {errors && Object.values(errors).map((error, index) => (
                <span className="text-destructive" key={index}>{error.message}</span>
            ))}
            <div className="flex items-stretch gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="file-type">File Type</Label>
                    <ToggleGroup type="single" variant={'outline'} value={fileType} id="file-type" onValueChange={(value) => {
                        if (value) {
                            setFileType(value as 'webp' | 'avif')
                        }
                    }}>
                        <ToggleGroupItem value="avif">.avif</ToggleGroupItem>
                        <ToggleGroupItem value="webp">.webp</ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <Separator orientation={'vertical'} className="data-[orientation=vertical]:h-auto" />
                <div className="flex flex-col gap-2 flex-1">
                    <Label htmlFor="quality">Quality</Label>
                    <div className="flex items-center gap-4 mt-[.35rem]">

                        <Slider defaultValue={[75]} max={100} step={5} min={5} onValueChange={(value) => {
                            setValue('quality', String(value[0]))
                        }} />
                        {quality}

                    </div>

                </div>
                <Separator orientation={'vertical'} className="data-[orientation=vertical]:h-auto" />
                <div className="flex flex-col gap-2">
                    <Label htmlFor="width">Width</Label>
                    <Input type="number" placeholder="Default" {...register('width')}></Input>
                </div>
            </div>
            <Button type="submit" className="cursor-pointer" >
                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Optimize'}

            </Button>
        </form>

        {(downloadData && downloadData.length > 0) && (
            <div className="flex flex-col gap-6">
                {downloadData.map((item, index) => {
                    const isMb = (item.size / 1000) >= 1000
                    const fileSize = isMb ? `${(item.size / 1000000).toFixed(2)} MB` : `${(item.size / 1000).toFixed(2)} KB`
                    return (
                        <div key={index} className="flex flex-col gap-2 items-stretch">
                            <div className="flex gap-4 items-center">
                                <img src={item.url} className="w-16 min-w-16 h-auto aspect-square rounded overflow-hidden object-center object-cover" />
                                <div className="flex flex-col gap-1">
                                    <span >{item.filename.split('.', -1)[0]}</span>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-sm p-1 rounded bg-muted border">.{item.filename.split('.', -1)[1]}</span>
                                        <span className="text-sm">{fileSize}</span>
                                    </div>

                                </div>
                                <div className="flex flex-col gap-4 ml-auto">
                                    <span className="text-right">Saved {item.saved.toFixed(1)}%</span>
                                    <Button className="w-full" asChild variant={'outline'}>
                                        <a href={item.url} download={item.filename} className="w-full">
                                            {downloadData.length === 1 ? 'Download' : 'Download Single'}
                                        </ a>
                                    </Button>
                                </div>
                            </div>


                        </div>
                    )
                })}
                {downloadData.length > 1 && <Button onClick={() => downloadZip(downloadData)} className="cursor-pointer">Download All Files</Button>}
            </div>
        )}
    </div>
}