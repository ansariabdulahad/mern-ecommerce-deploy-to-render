import { ChartArea, LayoutDashboard, ShoppingBag, ShoppingBasket } from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

// admin sidebar menu items structure
const adminSidebarMenuItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutDashboard />
    },
    {
        id: 'products',
        label: 'Products',
        path: '/admin/products',
        icon: <ShoppingBasket />
    },
    {
        id: 'orders',
        label: 'Orders',
        path: '/admin/orders',
        icon: <ShoppingBag />
    }
];

// Menu items component for sidebar
const MenuItems = ({ navigate, setOpen = null }) => {
    return (
        <Fragment>
            <nav className='flex flex-col gap-2 mt-8'>
                {
                    adminSidebarMenuItems?.map((menuItem) => (
                        <div
                            key={menuItem.id}
                            className='flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer text-muted-foreground
                             hover:bg-muted hover:text-foreground text-xl'
                            onClick={() => {
                                setOpen ? setOpen(false) : null;
                                navigate(menuItem.path)
                            }}
                        >
                            {menuItem.icon}
                            <span>{menuItem.label}</span>
                        </div>
                    ))
                }
            </nav>
        </Fragment>
    )
}

const AdminSideBar = ({ open, setOpen }) => {

    const navigate = useNavigate();

    return (
        <Fragment>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64">
                    <div className='flex flex-col h-full'>
                        <SheetHeader className='border-b'>
                            <SheetTitle className="flex items-center gap-2 cursor-pointer mt-5 mb-5"
                                onClick={() => {
                                    setOpen(false)
                                    navigate('/admin/dashboard')
                                }}
                            >
                                <ChartArea size={30} />
                                <span className='text-xl font-extrabold'>Admin Panel</span>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems navigate={navigate} setOpen={setOpen} />
                    </div>
                </SheetContent>
            </Sheet>

            <aside className='hidden lg:flex w-64 flex-col border-r bg-background p-6'>
                <div className='flex items-center gap-2 cursor-pointer'
                    onClick={() => navigate('/admin/dashboard')}
                >
                    <ChartArea size={30} />
                    <h1 className='text-2xl font-extrabold'>Admin Panel</h1>
                </div>
                {<MenuItems navigate={navigate} />}
            </aside>
        </Fragment >
    )
}

export default AdminSideBar