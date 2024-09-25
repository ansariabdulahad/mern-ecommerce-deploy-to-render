import React, { useEffect, useState } from 'react'
import img from '../../assets/account.jpg';
import Address from '@/components/shopping-view/address';
import { useDispatch, useSelector } from 'react-redux';
import UserCartItemsContent from '@/components/shopping-view/cart-items-content';
import { Loader } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { createNewOrder } from '@/store/shop/order-slice';
import { toast } from '@/hooks/use-toast';

const ShoppingCheckout = () => {

    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.shopCart);
    const { user } = useSelector(state => state.auth);
    const { approvalUrl } = useSelector(state => state.shopOrder);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const [isPaymentStart, setIsPaymentStart] = useState(false);

    // calculate total amount of cart items
    const totalCartAmount =
        cartItems && cartItems.items &&
            cartItems.items.length > 0
            ? cartItems.items.reduce(
                (sum, currentItem) =>
                    sum +
                    (currentItem?.salePrice > 0
                        ? currentItem?.salePrice
                        : currentItem?.price
                    ) * currentItem?.quantity,
                0
            )
            : 0;

    // handle paypal payment
    const handleInitiatePaypalPayment = () => {

        if (cartItems.items.length === 0) {
            toast({
                title: 'Your cart is empty. Please add items to proceed',
                variant: 'destructive'
            });

            return;
        }

        if (currentSelectedAddress === null) {
            toast({
                title: 'Please select one address to proceed',
                variant: 'destructive'
            });

            return;
        }

        const orderData = {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map((singleCartItem) => ({
                productId: singleCartItem?.productId,
                title: singleCartItem?.title,
                image: singleCartItem?.image,
                price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
                quantity: singleCartItem?.quantity
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes
            },
            orderStatus: 'pending',
            paymentMethod: 'paypal',
            paymentStatus: 'pending',
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: '',
            payerId: ''
        }

        dispatch(createNewOrder(orderData)).then((data) => {
            if (data?.payload?.success) {
                setIsPaymentStart(true);

            } else {
                setIsPaymentStart(false);
            }
        });

    }

    if (approvalUrl) {
        window.location.href = approvalUrl;
    }

    return (
        <div className='flex flex-col'>
            <div className='relative h-[300px] w-full overflow-hidden'>
                <img
                    src={img}
                    alt={"checkout-header-img"}
                    className='h-full w-full object-cover object-center'
                />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5'>
                <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
                <div className='flex flex-col gap-4 max-h-[900px] p-3 overflow-auto'>
                    {
                        cartItems && cartItems.items && cartItems.items.length > 0 ? (
                            cartItems.items.map((item) => <UserCartItemsContent
                                key={item.productId}
                                cartItem={item}
                            />)
                        ) : (
                            <div className='flex items-center gap-4'>
                                <Loader className='animate-spin' />
                                <span>There is no cart items, first add items to cart!</span>
                            </div>
                        )
                    }

                    <Separator />

                    <div className='space-y-4'>
                        <div className='flex justify-between'>
                            <span className='font-bold'>Total</span>
                            <span className='font-bold'>${totalCartAmount}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className='mt-4'>
                        <Button
                            onClick={handleInitiatePaypalPayment}
                            className="w-full mb-5"
                            disabled={!currentSelectedAddress}
                        >
                            {isPaymentStart ? 'Processing Paypal Payment...' : 'Checkout With Paypal'}
                        </Button>
                        {!currentSelectedAddress ? <span className='text-red-400'>Note: First select the address before checkout !</span> : null}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ShoppingCheckout