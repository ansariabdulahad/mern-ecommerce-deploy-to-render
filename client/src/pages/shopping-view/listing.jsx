import ProductFilter from '@/components/shopping-view/filter'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { sortOptions } from '@/config'
import { toast } from '@/hooks/use-toast'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice'
import { ArrowUpDownIcon, ShoppingBag } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

// function for search params filter update
const createSearchParamsHelper = (filterParams) => {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',');
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
        }
    }

    return queryParams.join('&');
}

const ShoppingListing = () => {

    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.shopCart);
    const { productList, productDetails } = useSelector(state => state.shopProducts);
    const { user } = useSelector(state => state.auth);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    const categorySearchParam = searchParams.get('category');

    // handle sorting functionality
    const handleSort = (values) => {
        setSort(values);
    }

    // handle filtering functionality
    const handleFilter = (getSectionId, getCurrentOption) => {

        let cpyFilters = { ...filters };
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if (indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption]
            }
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);

            if (indexOfCurrentOption === -1) {
                cpyFilters[getSectionId].push(getCurrentOption);
            } else {
                cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
            }
        }

        setFilters(cpyFilters);
        // store in session storage so whenever page will refresh we can get the filtered values from session
        sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
    }

    // get current product by id
    const handleGetProductDetails = (getCurrentProductId) => {
        dispatch(fetchProductDetails(getCurrentProductId));
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

    // on page load check searchparams using useSearcchParams() hook to apply on page if there are any.
    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const createQueryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    }, [filters]);

    // fetch list of products
    useEffect(() => {
        if (filters !== null && sort !== null)
            dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }, [dispatch, sort, filters]);

    // on page load get and set some sort & filters
    useEffect(() => {
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
    }, [categorySearchParam]);

    // handle openDetailsDialog
    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    return (
        <div className='grid grid-cols-1 gap-6 p-4 md:grid-cols-[200px_1fr] md:p-6'>
            {/* Render Product Filter Component */}
            <ProductFilter filters={filters} handleFilter={handleFilter} />
            {/* All Products section and sorting */}
            <div className='bg-background w-full rounded-lg shadow-sm'>
                <div className='p-4 border-b flex items-center justify-between'>
                    <h2 className='text-lg font-extrabold'>All Products</h2>
                    <div className='flex items-center gap-3'>
                        <span className='text-muted-foreground'>{productList?.length || 0} Products</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <ArrowUpDownIcon className='h-4 w-4' />
                                    <span>Sort by</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {
                                        sortOptions.map((sortItem) => (
                                            <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                                                {sortItem.label}
                                            </DropdownMenuRadioItem>
                                        ))
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
                    {
                        productList && productList.length > 0 ? (
                            productList.map((productItem) => (
                                <ShoppingProductTile
                                    key={productItem._id}
                                    product={productItem}
                                    handleGetProductDetails={handleGetProductDetails}
                                    handleAddToCart={handleAddToCart}
                                />
                            ))
                        ) : (
                            <div className='flex gap-4'>
                                <ShoppingBag className='font-bold' />
                                <span className='font-bold capitalize'>No product found</span>
                            </div>
                        )
                    }
                </div>
            </div>

            <ProductDetailsDialog
                productDetails={productDetails}
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
            />
        </div>
    )
}

export default ShoppingListing