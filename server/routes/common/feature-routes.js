import { Router } from 'express';
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from '../../controllers/common/feature-controller.js';

const router = Router();

router.post('/add', addFeatureImage);
router.get('/get', getFeatureImages);
router.delete('/:id', deleteFeatureImage);

export default router;