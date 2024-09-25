import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import UserCartItemsContent from './cart-items-content'
import { useNavigate } from 'react-router-dom'

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {

    const navigate = useNavigate();

    // calculate total amount of cart items
    const totalCartAmount =
        cartItems &&
            cartItems.length > 0
            ? cartItems.reduce(
                (sum, currentItem) =>
                    sum +
                    (currentItem?.salePrice > 0
                        ? currentItem?.salePrice
                        : currentItem?.price
                    ) * currentItem?.quantity,
                0
            )
            : 0;

    return (
        <SheetContent className="sm:max-w-md overflow-auto">
            <SheetHeader>
                <SheetTitle>Your Carts</SheetTitle>
            </SheetHeader>
            <Separator />

            <div className='mt-8 space-y-4'>
                {
                    cartItems &&
                    cartItems.length > 0 &&
                    cartItems.map((item, index) => <UserCartItemsContent key={index} cartItem={item} />)
                }
            </div>

            <div className='mt-8 space-y-4'>
                <div className='flex justify-between'>
                    <span className='font-bold'>Total</span>
                    <span className='font-bold'>${totalCartAmount}</span>
                </div>
            </div>

            <Button onClick={() => {
                navigate('/shop/checkout')
                setOpenCartSheet(false)
            }}
                className="w-full mt-6"
                disabled={cartItems.length === 0}
            >Checkout</Button>
        </SheetContent>
    )
}

export default UserCartWrapper