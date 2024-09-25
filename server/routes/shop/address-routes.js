import { Router } from 'express';
import { addAddress, deleteAddress, editAddress, fetchAllAddress } from '../../controllers/shop/address-controller.js';

const router = Router();

router.post('/add', addAddress);
router.get('/get/:userId', fetchAllAddress);
router.delete('/delete/:userId/:addressId', deleteAddress);
router.put('/update/:userId/:addressId', editAddress) ;

export default router;