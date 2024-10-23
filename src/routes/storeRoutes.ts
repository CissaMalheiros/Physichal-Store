import { Router } from 'express';
import { addStore, listStores } from '../controllers/storeController';

const router = Router();

router.post('/stores', addStore);
router.get('/stores', listStores);

export default router;