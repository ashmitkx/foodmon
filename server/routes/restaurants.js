import { Router } from 'express';
import restaurantsApi from '../api/restaurants.js';

const router = Router();

router.route('/').get(restaurantsApi.getRestaurants); // get restaurants
router.route('/:id').get(restaurantsApi.getRestaurantById); // get a restaurant by Id

export default router;
