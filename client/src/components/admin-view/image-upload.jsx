import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { toast } from "@/hooks/use-toast";

const ProductImageUpload = ({
    imageFile,
    setImageFile,
    uploadedImageUrl,
    setUploadedImageUrl,
    imageLoadingState,
    setImageLoadingState,
    isEditMode,
    isCustomStyling = false
}) => {

    const inputRef = useRef(null);

    const handleImageFileChange = (event) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) setImageFile(selectedFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    const uploadImageToCloudinary = async () => {
        setImageLoadingState(true);
        const data = new FormData();
        data.append('my_file', imageFile);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`, data);

            if (response?.data?.success) {
                setUploadedImageUrl(response.data.result.url);
                setImageLoadingState(false);
                toast({
                    title: "Image Upload Successfully!",
                });
            }
        } catch (error) {
            console.log(error.message);
            toast({
                title: error?.response?.data?.message,
                variant: 'destructive'
            });
        }
    }

    useEffect(() => {
        if (imageFile !== null) uploadImageToCloudinary();
    }, [imageFile]);

    return (
        <div className={`w-full mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
            <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
            <div
                className={`${isEditMode ? 'opacity-75' : ''} border-2 border-dashed rounded-lg p-4`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                />
                {
                    !imageFile ? (
                        <Label htmlFor="image-upload"
                            className={`${isEditMode ? 'cursor-not-allowed' : 'cursor-pointer'} flex flex-col items-center justify-center h-32`}
                        >
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                            <span className="text-xs md:text-sm">Drag & drop or click to upload image</span>
                        </Label>
                    ) : imageLoadingState ? (
                        <Skeleton className='h-10 bg-gray-100' />
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileIcon className="w-8 h-8 text-primary mr-2" />
                            </div>
                            <p className="text-sm font-medium mr-2 text-wrap overflow-x-hidden">{imageFile.name}</p>
                            <Button variant="ghost" size="icon"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={handleRemoveImage}
                            >
                                <XIcon className="w-4 h-4" />
                                <span className="sr-only">Remove File</span>
                            </Button>
                        </div>
                    )
                }
            </div>
        </div >
    );
};

export default ProductImageUpload;