import { Router } from 'express';
import { addStore, listStores, findNearbyStores } from '../controllers/storeController';

const router = Router();

router.post('/stores', addStore);
router.get('/stores', listStores);
router.get('/stores/nearby/:cep', findNearbyStores);

export default router;