import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react'
import React, { Fragment, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Sheet, SheetContent, SheetFooter, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewHeaderMenuItems } from '@/config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { logoutUser, resetTokenAndCredentials } from '@/store/auth-slice'
import { Separator } from '../ui/separator'
import UserCartWrapper from './cart-wrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { Label } from '../ui/label'

// Menu items component for small and large screens
const MenuItems = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // handle menu item navigation
    const handleNavigate = (getCurrentItem) => {
        sessionStorage.removeItem('filters');
        const currentFilter = getCurrentItem.id !== 'home' && getCurrentItem.id !== 'products' && getCurrentItem.id !== 'search' ?
            {
                category: [getCurrentItem.id]
            } : null;
        sessionStorage.setItem('filters', JSON.stringify(currentFilter));

        location.pathname.includes('listing') && currentFilter !== null
            ? setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`))
            : navigate(getCurrentItem.path);
    }

    return (
        <Fragment>
            <nav className='flex flex-col mb-3 gap-6 lg:flex-row lg:mb-0 lg:items-center'>
                {
                    shoppingViewHeaderMenuItems.map((menuItem) => (
                        <Label
                            key={menuItem.id}
                            className='text-sm font-medium cursor-pointer'
                            onClick={() => handleNavigate(menuItem)}
                        >
                            {menuItem.label}
                        </Label>
                    ))
                }
            </nav>
        </Fragment>
    );
}

// menu header right content component
const HeaderRightContent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.shopCart);
    const [openCartSheet, setOpenCartSheet] = useState(false);

    const handleLogout = () => {
        // commenting this because it is not qorking after deploying on render or we need to buy custom domain to run this
        // dispatch(logoutUser());

        // using another method to fix this issue which is comming after deploying on render
        dispatch(resetTokenAndCredentials());
        sessionStorage.clear();
        navigate('/auth/login');
    }

    // for cart
    useEffect(() => {
        dispatch(fetchCartItems(user?.id));
    }, [dispatch]);

    return (
        <Fragment>
            <div className='flex gap-4 flex-row lg:items-center'>
                <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setOpenCartSheet(true)}
                        className="relative"
                    >
                        <ShoppingCart className='w-6 h-6' />
                        <span
                            className='absolute top-[-9px] right-0 font-bold text-sm bg-red-600 rounded-full px-1 text-white'
                        >
                            {cartItems && cartItems?.items?.length || 0}
                        </span>
                        <span className='sr-only'>User cart</span>
                    </Button>

                    <UserCartWrapper
                        setOpenCartSheet={setOpenCartSheet}
                        cartItems={
                            cartItems &&
                                cartItems.items &&
                                cartItems.items.length > 0 ? cartItems.items : []
                        }
                    />
                </Sheet>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="bg-black">
                            <AvatarFallback className="bg-black text-white font-extrabold capitalize">
                                {user?.userName[0]}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" className="w-56">
                        <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/shop/account')}>
                            <UserCog className='mr-2 h-4 w-4' />
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className='mr-2 h-4 w-4' />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Fragment>
    );
}

const ShoppingHeader = () => {

    return (
        <header className='sticky top-0 z-40 w-full border-b bg-background'>
            <div className='flex h-16 items-center justify-between px-4 md:px-6'>
                <Link to={'/shop/home'} className='flex items-center gap-2'>
                    <HousePlug className='h-6 w-6' />
                    <span className='font-bold'>Ecommerce</span>
                </Link>
                {/* This sheet is for smaller device only */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className='h-6 w-6' />
                            <span className='sr-only'>Toggle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs">
                        <SheetTitle className="mb-5 border-b">
                            <Link to={'/shop/home'} className='flex items-center gap-2 mb-2'>
                                <HousePlug className='h-6 w-6' />
                                <span className='font-bold'>Ecommerce</span>
                            </Link>
                        </SheetTitle>
                        <MenuItems />
                        <Separator />
                        <SheetFooter className='py-3'>
                            <HeaderRightContent />
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                {/* Bigger device work */}
                <div className='hidden lg:block'>
                    <MenuItems />
                </div>
                <div className='hidden lg:block'>
                    <HeaderRightContent />
                </div>
            </div>
        </header>
    )
}

export default ShoppingHeader