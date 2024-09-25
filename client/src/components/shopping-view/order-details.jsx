import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Loader } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const ShoppingOrderDetailsView = ({ orderDetails }) => {

    const { user } = useSelector(state => state.auth);

    return (
        <DialogContent className="sm:max-w-[600px] overflow-x-auto h-full">
            <div className='grid gap-6'>
                <div className='grid gap-2'>
                    <div className='flex items-center justify-between mt-6'>
                        <p className='font-medium'>Order ID</p>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='font-medium'>Order Date</p>
                        <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='font-medium'>Order Price</p>
                        <Label>$ {orderDetails?.totalAmount}</Label>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='font-medium'>Payment Method</p>
                        <Label>{orderDetails?.paymentMethod}</Label>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='font-medium'>Payment Status</p>
                        <Label>{orderDetails?.paymentStatus}</Label>
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                        <p className='font-medium'>Order Status</p>
                        <Label className="capitalize">
                            <Badge
                                className={`py-1 px-3 capitalize 
                                ${orderDetails && orderDetails.orderStatus === 'confirmed'
                                        ? 'bg-green-500'
                                        : orderDetails && orderDetails.orderStatus === 'rejected'
                                            ? 'bg-red-600'
                                            : 'bg-black'}
                                `}
                            >
                                {orderDetails?.orderStatus}
                            </Badge>
                        </Label>
                    </div>
                </div>

                <Separator />

                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <div className='font-medium'>Order Details</div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {
                                    orderDetails && orderDetails?.cartItems &&
                                        orderDetails?.cartItems.length > 0 ? (
                                        orderDetails?.cartItems.map((cartItem) => (
                                            <TableRow
                                                key={cartItem?._id}
                                                className="text-muted-foreground"
                                            >
                                                <TableCell>{cartItem?.title}</TableCell>
                                                <TableCell>{cartItem?.quantity}</TableCell>
                                                <TableCell>${cartItem?.price}</TableCell>
                                            </TableRow>
                                        ))

                                    ) : (
                                        <TableRow>
                                            <TableCell className='flex items-center gap-4'>
                                                <Loader className='animate-spin' />
                                                <span>There is no order details!</span>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div >

                <Separator />

                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <div className='font-medium'>Shipping Info</div>
                        <div className='grid gap-0.5 text-muted-foreground capitalize'>
                            <span><strong>Name:</strong> {user?.userName}</span>
                            <span><strong>Address:</strong> {orderDetails?.addressInfo?.address}</span>
                            <span><strong>City:</strong> {orderDetails?.addressInfo?.city}</span>
                            <span><strong>Pincode:</strong> {orderDetails?.addressInfo?.pincode}</span>
                            <span><strong>Phone:</strong> {orderDetails?.addressInfo?.phone}</span>
                            <span><strong>Notes:</strong> {orderDetails?.addressInfo?.notes}</span>
                        </div>
                    </div>
                </div>
            </div >
        </DialogContent >
    )
}

export default ShoppingOrderDetailsView