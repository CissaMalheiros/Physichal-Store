import { Router } from 'express';
import { addStore, listStores, findNearbyStores, deleteStore } from '../controllers/storeController';

const router = Router();

router.post('/stores', addStore);
router.get('/stores', listStores);
router.get('/stores/nearby/:cep', findNearbyStores);
router.delete('/stores/:id', deleteStore);

export default router;