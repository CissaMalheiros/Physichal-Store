import { Router } from 'express';
import { addStore, listStores, findNearbyStores, deleteStore } from '../controllers/storeController';

const router = Router();

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Adiciona uma nova loja
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               number:
 *                 type: string
 *               cep:
 *                 type: string
 *     responses:
 *       201:
 *         description: Loja adicionada com sucesso
 *       400:
 *         description: Erro ao adicionar loja
 */
router.post('/stores', addStore);

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Lista todas as lojas
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: Lista de lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   rua:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   cep:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   coordenadas:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 */
router.get('/stores', listStores);

/**
 * @swagger
 * /stores/nearby/{cep}:
 *   get:
 *     summary: Busca lojas próximas a um CEP
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de lojas próximas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   rua:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   cep:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   coordenadas:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                       lng:
 *                         type: number
 *                   distancia:
 *                     type: number
 *       404:
 *         description: Nenhuma loja encontrada num raio de 100km
 */
router.get('/stores/nearby/:cep', findNearbyStores);

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Deleta uma loja pelo ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loja deletada com sucesso
 *       404:
 *         description: Loja não encontrada
 */
router.delete('/stores/:id', deleteStore);

export default router;