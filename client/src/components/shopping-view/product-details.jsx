import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Loader, StarIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@/hooks/use-toast';
import { setProductDetails } from '@/store/shop/products-slice';
import { Label } from '../ui/label';
import StarRatingComponent from '../common/star-rating';
import { addReview, getReviews } from '@/store/shop/review-slice';
import { data } from 'autoprefixer';

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shopCart);
    const { reviews } = useSelector(state => state.shopReview);
    const [reviewMsg, setReviewMsg] = useState('');
    const [rating, setRating] = useState(0);

    // handle rating changes
    const handleRatingChange = (getRating) => {
        setRating(getRating);
    }

    // handle add to cart product item
    const handleAddToCart = (getCurrentProductId, getTotalStock) => {
        // before adding to cart check total stock of item accordingly handle add to cart product item
        let getCartItems = cartItems.items || [];

        if (getCartItems.length) {
            const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productId === getCurrentProductId);
            if (indexOfCurrentCartItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;

                if (getQuantity + 1 > getTotalStock) {
                    toast({
                        title: `Only ${getQuantity} quantity can be added for this item.`,
                        variant: 'destructive'
                    });

                    return;
                }
            }
        }

        dispatch(addToCart({
            userId: user?.id,
            productId: getCurrentProductId,
            quantity: 1
        })).then((data) => {
            if (data?.payload?.success) dispatch(fetchCartItems(user?.id));
            toast({
                title: "Product is added to cart"
            });
        });
    }

    // reset dialog state
    const handleDialogClose = () => {
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg('');
    }

    // handle add review
    const handleAddReview = () => {
        dispatch(addReview({
            productId: productDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating
        })).then((data) => {
            if (data?.payload?.success) {
                setReviewMsg('');
                setRating(0);
                dispatch(getReviews(productDetails?._id));
                toast({
                    title: "Review added successfully"
                });
            } else {
                setReviewMsg('');
                setRating(0);
                toast({
                    title: "Unable to add review, Please buy this product to review it or you already reviewed it !",
                    variant: 'destructive'
                });
            }
        });
    }

    // find the avaarage of review to show the product average review
    const averageReview = reviews && reviews.length > 0
        ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
        : 0;

    useEffect(() => {
        if (productDetails !== null) dispatch(getReviews(productDetails?._id));
    }, [productDetails])

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogHeader className={'sr-only'}>
                <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            <DialogContent
                className="grid sm:grid-cols-2 gap-6 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[100vh] overflow-auto"
            >
                <div className='relative overflow-hidden rounded-lg'>
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        width={600}
                        height={600}
                        className='aspect-square w-full md:h-[100vh] object-cover'
                    />
                </div>
                <div>
                    <div>
                        <h1 className='text-3xl font-extrabold'>{productDetails?.title}</h1>
                        <p className='text-muted-foreground text-2xl mb-5 mt-4'>{productDetails?.description}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p
                            className={`${productDetails?.salePrice > 0 ? 'line-through text-zinc-400' : ''} text-3xl font-bold text-primary`}
                        >$ {productDetails?.price}</p>
                        {
                            productDetails?.salePrice > 0 ? (
                                <p className='text-3xl font-bold text-primary'>$ {productDetails?.salePrice}</p>
                            ) : (null)
                        }
                    </div>
                    <div className='flex items-center gap-2 mt-2'>
                        <div className='flex items-center gap-0.5'>
                            <StarRatingComponent
                                rating={averageReview}
                            />
                        </div>
                        <p className='text-muted-foreground'>({averageReview.toFixed(1)})</p>
                    </div>
                    <div className='mt-5 mb-5'>
                        {
                            productDetails?.totalStock === 0 ? (
                                <Button className="w-full opacity-60 cursor-not-allowed"
                                >Out Of Stock</Button>
                            ) : (
                                <Button className="w-full"
                                    onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                                >Add to cart</Button>
                            )
                        }
                    </div>
                    <Separator />
                    <div className='max-h-[300px] overflow-auto'>
                        <h2 className='text-xl font-bold mb-4'>Reviews</h2>
                        <div className='grid gap-6'>
                            {
                                reviews && reviews.length > 0 ? (
                                    reviews.map((reviewItem) => (
                                        <div className='flex gap-4' key={reviewItem._id}>
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarFallback className="capitalize font-bold">
                                                    {reviewItem?.userName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='grid gap-1'>
                                                <div className='flex items-center gap-2'>
                                                    <h3 className='font-bold capitalize'>
                                                        {reviewItem?.userName}
                                                    </h3>
                                                </div>
                                                <div className='flex items-center gap-0.5'>
                                                    <StarRatingComponent
                                                        rating={reviewItem?.reviewValue}
                                                    />
                                                </div>
                                                <p className='text-muted-foreground'>
                                                    {reviewItem.reviewMessage}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex gap-2'>
                                        <Loader className='animate-spin' />
                                        <span>No reviews for this products!</span>
                                    </div>
                                )
                            }
                        </div>
                        <div className='mt-10 mb-5 mx-5 flex flex-col gap-2'>
                            <Label>Write a review</Label>
                            <div className='flex gap-1'>
                                <StarRatingComponent
                                    rating={rating}
                                    handleRatingChange={handleRatingChange}
                                />
                            </div>
                            <Input
                                placeholder="Write a review..."
                                name="reviewMsg"
                                value={reviewMsg}
                                onChange={(event) => setReviewMsg(event.target.value)}
                            />
                            <Button
                                disabled={reviewMsg.trim() === ''}
                                onClick={handleAddReview}
                            >Submit</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default ProductDetailsDialog;