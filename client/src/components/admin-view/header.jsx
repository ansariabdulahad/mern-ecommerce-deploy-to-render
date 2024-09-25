import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'
import { toast } from '@/hooks/use-toast'

const AdminHeader = ({ setOpen }) => {

    const dispatch = useDispatch();

    // handle logout functionality
    const handleLogout = () => {
        dispatch(logoutUser()).then((data) => {
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                });
            }
        });
    }

    return (
        <header className='flex items-center justify-between px-4 py-3 bg-background border-b'>
            <Button className="lg:hidden sm:block"
                onClick={() => setOpen(true)}
            >
                <AlignJustify />
                <span className='sr-only'>Toggle Menu</span>
            </Button>
            <div className='flex flex-1 justify-end'>
                <Button onClick={handleLogout}
                 className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow">
                    <LogOut />
                    Logout
                </Button>
            </div>
        </header>
    )
}

export default AdminHeader