import ProductImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from '@/store/common-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AdminDashboard = () => {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const dispatch = useDispatch();
    const { featureImageList } = useSelector(state => state.commonFeature);

    // handle uploading feature images 
    const handleUploadFeatureImage = () => {
        if (featureImageList && featureImageList.length >= 5) {
            toast({
                title: "Only 5 Feature images are allowed to upload !",
                variant: 'destructive'
            });
            setImageFile(null);
            setUploadedImageUrl('');
            return;
        }
        dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getFeatureImages());
                toast({
                    title: "Feature Image Uploaded Successfully"
                });
                setImageFile(null);
                setUploadedImageUrl('');
            }
        })
    }

    // handle feature image deletion
    const handleFeatureImageDelete = (getCurrentFeatureId) => {
        dispatch(deleteFeatureImage(getCurrentFeatureId)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getFeatureImages());
                toast({
                    title: data?.payload?.message
                });
            }

        });
    }

    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch]);

    return (
        <div>
            <h1 className='font-bold my-2'>Upload Feature Images</h1>
            <Separator />
            <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
                isCustomStyling={true}
            // isEditMode={currentEditedId !== null}
            />
            <Button
                className="mt-5 w-full"
                onClick={handleUploadFeatureImage}
            >Upload</Button>

            <div className='flex flex-col gap-4 mt-5'>
                {
                    featureImageList && featureImageList.length > 0 ? (
                        featureImageList.map((featureImgItem) => (
                            <Card className='relative p-4 shadow hover:shadow-lg' key={featureImgItem._id}>
                                <img
                                    src={featureImgItem.image}
                                    alt={featureImgItem._id}
                                    className='w-full h-[300px] object-center object-cover rounded-t-lg'
                                />
                                <div className='flex justify-center mt-2'>
                                    <Button
                                        className="px-4 py-6 text-2xl font-bold bg-red-600"
                                        onClick={() => handleFeatureImageDelete(featureImgItem._id)}
                                    >Delete</Button>
                                </div>
                            </Card>
                        ))
                    ) : (null)
                }
            </div>
        </div>
    )
}

export default AdminDashboard