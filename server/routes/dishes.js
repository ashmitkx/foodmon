import { Router } from 'express';
import dishesApi from '../api/dishes.js';

const router = Router();

router.route('/').get(dishesApi.getDishes); // get dishes
// router.route('/:ids').get(dishesApi.getDishesByIds); // get a list of dishes by Ids

export default router;
