import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

// register
export const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        // First check if the user is already registered or not
        const checkUser = await User.findOne({ email });
        if (checkUser) return res.json({
            success: false,
            message: 'User already exists with the same email, Please try again !',
        });

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ userName, email, password: hashPassword });

        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'Registration successful'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred, please try again!'
        })
    }
}

// login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user is present in our db or not
        const checkUser = await User.findOne({ email });
        if (!checkUser) return res.json({
            success: false,
            message: "User dosen't exist, Please register first!"
        });

        // check user password first before login
        const checkpasswordcheck = await bcrypt.compare(password, checkUser.password);
        if (!checkpasswordcheck) return res.json({
            success: false,
            message: "Incorrect password, Please try again!"
        });

        // generate jwt token if all creds are true
        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser.email,
            role: checkUser.role,
            userName: checkUser.userName
        }, 'CLIENT_SECRET_KEY', { expiresIn: '60m' });

        // after token creation set this in cookie
        // commenting this because it is not qorking after deploying on render or we need to buy custom domain to run this
        // res.cookie('token', token, { httpOnly: true, secure: true })
        //     .json({
        //         success: true,
        //         message: 'Logged in successfully',
        //         user: {
        //             email: checkUser.email,
        //             role: checkUser.role,
        //             id: checkUser._id,
        //             userName: checkUser.userName
        //         }
        //     });

        // using another method to fix this issue which is comming after deploying on render
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

// logout
export const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: 'Logged out successfully'
    });
}

// auth middleware
// commenting this because it is not qorking after deploying on render or we need to buy custom domain to run this
// export const authMiddleware = async (req, res, next) => {
//     // check the token first
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({
//         success: false,
//         message: 'Unauthorized user!'
//     });

//     try {
//         // then decode the token 
//         const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({
//             success: false,
//             message: 'Unauthorized user!'
//         });
//     }
// }

// using another method to fix this issue which is comming after deploying on render
export const authMiddleware = async (req, res, next) => {
    // get the token from headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({
        success: false,
        message: 'Unauthorized user!'
    });

    try {
        // then decode the token 
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized user!'
        });
    }
}