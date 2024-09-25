import ProductImageUpload from '@/components/admin-view/image-upload';
import AdminProductTile from '@/components/admin-view/product-tile';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { addProductFormElements } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/admin/products-slice';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const initialFormData = {
    image: null,
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: ''
}

const AdminProducts = () => {

    const dispatch = useDispatch();
    const { productList } = useSelector(state => state.adminProducts);
    const { toast } = useToast();

    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const onSubmit = (event) => {
        event.preventDefault();

        // edit or add on the basis of state change
        currentEditedId !== null ? (
            dispatch(
                editProduct(
                    { id: currentEditedId, formData }
                )
            ).then((data) => {
                // setCurrentEditedId as null, reset the form, close the form, list the products and toast the msg.
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                    toast({
                        title: data?.payload?.message || "Product updated successfully"
                    });
                }
            })
        ) : (
            dispatch(
                addNewProduct({
                    ...formData,
                    image: uploadedImageUrl
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    // make null imageFile, reset the form, close the form, list the products and toast the msg.
                    dispatch(fetchAllProducts());
                    setImageFile(null);
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    toast({
                        title: data?.payload?.message || "Product added successfully"
                    });
                }
            })
        );
    }

    // delete product on the basis of product id
    const handleDelete = (getCurrentProductId) => {
        dispatch(
            deleteProduct(getCurrentProductId)
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
                toast({
                    title: data?.payload?.message || "Product deleted successfully"
                })
            }
        })
    }

    // check all the fields are filled or not
    const isFormValid = () => {
        return Object
            .keys(formData)
            .map((key) => formData[key] !== '')
            .every((item) => item);
    }

    // get products while dispatching 
    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    return (
        <Fragment>
            <div>
                <div className='mb-5 flex w-full justify-end'>
                    <Button onClick={() => setOpenCreateProductsDialog(true)}>
                        Add New Product
                    </Button>
                </div>

                <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
                    {
                        productList && productList.length > 0
                            ? productList.map(productItem =>
                                <AdminProductTile
                                    key={productItem._id}
                                    product={productItem}
                                    setCurrentEditedId={setCurrentEditedId}
                                    setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                                    setFormData={setFormData}
                                    handleDelete={handleDelete}
                                />
                            )
                            : null
                    }
                </div>
            </div>

            <Sheet
                open={openCreateProductsDialog}
                onOpenChange={() => {
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                }}
            >
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader className='border-b mb-3'>
                        <SheetTitle>{currentEditedId !== null ? 'Edit Product' : 'Add New Product'}</SheetTitle>
                    </SheetHeader>

                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        imageLoadingState={imageLoadingState}
                        setImageLoadingState={setImageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />

                    <div className='py-6'>
                        <CommonForm
                            formControls={addProductFormElements}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
                            onSubmit={onSubmit}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    )
}

export default AdminProducts