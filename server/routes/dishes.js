import { Router } from 'express';
import DishesApi from '../api/dishes.js';

const router = Router();

router.route('/').get(DishesApi.getDishes); // get dishes
router.route('/:id').get(DishesApi.getDishById); // get a single dish

export default router;
