import express from 'express';
const router = express.Router();

import {} from '../controllers/tache.controller.js'

router.get('/tache');
router.get('/:id');
router.post('/');
router.put('/:id');
router.delete('/:id');


export default router;