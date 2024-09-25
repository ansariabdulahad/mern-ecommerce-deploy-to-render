import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser, resetTokenAndCredentials } from '@/store/auth-slice'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({ setOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // handle logout functionality
    const handleLogout = () => {
        // commenting this because it is not qorking after deploying on render or we need to buy custom domain to run this
        // dispatch(logoutUser()).then((data) => {
        //     if (data?.payload?.success) {
        //         toast({
        //             title: data?.payload?.message,
        //         });
        //     }
        // });

        // using another method to fix this issue which is comming after deploying on render
        dispatch(resetTokenAndCredentials());
        sessionStorage.clear();
        navigate('/auth/login');
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