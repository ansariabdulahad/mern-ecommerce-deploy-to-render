import { Router } from 'express';
import { authMiddleware, loginUser, logoutUser, registerUser } from '../../controllers/auth/auth-controller.js';

const router = Router();

// register user
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// check the user is authenticated or not using auth middleware
router.get('/check-auth', authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: 'Authenticated user',
        user
    });
})

export default router;