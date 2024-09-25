import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

const AddressCard = ({ addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedId }) => {
    return (
        <Card
            className={`hover:shadow-lg cursor-pointer ${selectedId?._id === addressInfo?._id
                ? 'border-green-500 border-2'
                : 'border-black'
                }`}
            onClick={() => setCurrentSelectedAddress && setCurrentSelectedAddress(addressInfo)}
        >
            <CardContent className="grid gap-4 p-4">
                <Label><strong>Address:</strong> {addressInfo?.address}</Label>
                <Label><strong>City:</strong> {addressInfo?.city}</Label>
                <Label><strong>Pincode:</strong> {addressInfo?.pincode}</Label>
                <Label><strong>Phone:</strong> {addressInfo?.phone}</Label>
                <Label><strong>Notes:</strong> {addressInfo?.notes}</Label>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-3">
                <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
            </CardFooter>
        </Card>
    )
}

export default AddressCard