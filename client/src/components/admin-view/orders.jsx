import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog, DialogHeader, DialogTitle } from '../ui/dialog'
import AdminOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetailsForAdmin } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'
import { Loader } from 'lucide-react'

const AdminOrdersView = () => {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const { orderList, orderDetails } = useSelector(state => state.adminOrder);

    const handleFetchOrderDetails = async (getCurrentOrderId) => {
        dispatch(getOrderDetailsForAdmin(getCurrentOrderId));
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails]);

    return (
        <Card className="max-w-[340px] sm:max-w-full">
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-scroll">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className='sr-only'>Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orderList && orderList.length > 0 ? (
                                orderList.map((orderItem) => (
                                    <TableRow key={orderItem._id}>
                                        <TableCell>{orderItem?._id}</TableCell>
                                        <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`py-1 px-3 capitalize 
                                                ${orderItem && orderItem.orderStatus === 'confirmed'
                                                        ? 'bg-green-500'
                                                        : orderItem && orderItem.orderStatus === 'rejected'
                                                            ? 'bg-red-600'
                                                            : 'bg-black'}
                                                `}
                                            >
                                                {orderItem?.orderStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>$ {orderItem?.totalAmount}</TableCell>
                                        <TableCell>
                                            <Dialog
                                                open={openDetailsDialog}
                                                onOpenChange={() => {
                                                    setOpenDetailsDialog(false)
                                                    dispatch(resetOrderDetailsForAdmin())
                                                }}
                                            >
                                                <Button
                                                    onClick={() => handleFetchOrderDetails(orderItem?._id)}
                                                >View Details</Button>
                                                <DialogHeader className={'sr-only'}>
                                                    <DialogTitle>Order Details</DialogTitle>
                                                </DialogHeader>
                                                <AdminOrderDetailsView orderDetails={orderDetails} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className='flex items-center gap-4'>
                                        <Loader className='animate-spin' />
                                        <span>There is no orders found!</span>
                                    </TableCell>
                                </TableRow>
                            )
                        }

                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default AdminOrdersView