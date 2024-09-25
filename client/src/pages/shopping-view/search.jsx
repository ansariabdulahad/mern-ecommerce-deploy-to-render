import ProductDetailsDialog from '@/components/shopping-view/product-details';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { fetchProductDetails } from '@/store/shop/products-slice';
import { getSearchResults, resetSearchResults } from '@/store/shop/search-slice';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const SearchProducts = () => {
    const [keyword, setKeyword] = useState('');
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchResults } = useSelector(state => state.shopSearch);
    const { cartItems } = useSelector(state => state.shopCart);
    const { user } = useSelector(state => state.auth);
    const { productDetails } = useSelector(state => state.shopProducts);
    const dispatch = useDispatch();

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

    // get current product by id
    const handleGetProductDetails = (getCurrentProductId) => {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    useEffect(() => {
        if (keyword && keyword.trim() !== '' && keyword.trim().length > 1) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                dispatch(getSearchResults(keyword));
            }, 500);
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(resetSearchResults());
        }
    }, [keyword]);

    // handle openDetailsDialog
    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    return (
        <div className='container mx-auto md:px-6 px-4 py-8'>
            <div className='flex justify-center mb-8'>
                <div className='w-full flex items-center'>
                    <Input
                        placeholder="Search Products..."
                        className="py-6"
                        name="keyword"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {
                    searchResults && searchResults.map((item) => <ShoppingProductTile
                        key={item._id}
                        product={item}
                        handleAddToCart={handleAddToCart}
                        handleGetProductDetails={handleGetProductDetails}
                    />)
                }
            </div>

            {
                !searchResults.length ? (
                    <div className='flex items-center justify-center gap-2'>
                        <Loader size={30} className='animate-spin' />
                        <span>There is no results found !</span>
                    </div>
                ) : null
            }

            <ProductDetailsDialog
                productDetails={productDetails}
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
            />
        </div>
    )
}

export default SearchProducts