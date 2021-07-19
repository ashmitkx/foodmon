import { Router } from 'express';
import RestaurantApi from '../api/restaurants.js';

const router = Router();

router.route('/').get(RestaurantApi.getRestaurants); // get restaurants
router.route('/:id').get(RestaurantApi.getRestaurantById); // get a single restaurant's

export default router;
