import { Router } from "express";
import { upload } from "../../helpers/cloudinary.js";
import { addProduct, deleteProduct, editProduct, fetchAllProducts, handleImageUpload } from "../../controllers/admin/products-controller.js";

const router = Router();

router.post('/upload-image', upload.single("my_file"), handleImageUpload);
router.post('/add', addProduct);
router.put('/edit/:id', editProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/get', fetchAllProducts);

export default router;