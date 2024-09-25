import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { addressFormControls } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from '@/store/shop/address-slice';
import { data } from 'autoprefixer';
import { toast } from '@/hooks/use-toast';
import AddressCard from './address-card';
import { Loader } from 'lucide-react';

const initialAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
};

const Address = ({ setCurrentSelectedAddress, selectedId }) => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { addressList } = useSelector(state => state.shopAddress);
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const handleManageAddress = (event) => {
        event.preventDefault();

        if (addressList && addressList.length >= 3 && currentEditedId === null) {
            setFormData(initialAddressFormData);
            toast({
                title: 'You can add max 3 addresses only !',
                variant: 'destructive'
            });
            return;
        }

        currentEditedId !== null ? (
            dispatch(editaAddress(
                { userId: user?.id, addressId: currentEditedId, formData }
            )).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setCurrentEditedId(null);
                    setFormData(initialAddressFormData);
                    toast({
                        title: "Address updated successfully"
                    });
                }
            })
        ) : (
            dispatch(addNewAddress({
                ...formData,
                userId: user?.id
            })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id));
                    setFormData(initialAddressFormData);
                    toast({
                        title: "Address added successfully"
                    });
                }
            })
        )
    }

    const handleDeleteAddress = (getCurrentAddress) => {
        dispatch(
            deleteAddress(
                { userId: getCurrentAddress?.userId, addressId: getCurrentAddress._id }
            )
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                toast({
                    title: "Address deleted successfully"
                });
            }

        })
    }

    const handleEditAddress = (getCurrentAddress) => {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes
        })
    }

    const isFormValid = () => {
        return Object.keys(formData).map((key) => formData[key].trim() !== '').every((item) => item);
    }

    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch]);

    return (
        <Card>
            <div className='mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {
                    addressList && addressList.length > 0 ? (
                        addressList.map((singleAddressItem) => <AddressCard
                            selectedId={selectedId}
                            addressInfo={singleAddressItem}
                            key={singleAddressItem._id}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                            handleDeleteAddress={handleDeleteAddress}
                            handleEditAddress={handleEditAddress}
                        />)
                    ) : (
                        <div className='flex items-center gap-4'>
                            <Loader className='animate-spin' />
                            <span>There is no address found, create new one!</span>
                        </div>
                    )
                }
            </div>
            <CardHeader>
                <CardTitle>
                    {
                        currentEditedId !== null ? "Edit Address" : "Add New Address"
                    }
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    )
}

export default Address