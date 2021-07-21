import { Router } from 'express';
import restaurantsApi from '../api/restaurants.js';

const router = Router();

router.route('/').get(restaurantsApi.getRestaurants); // get restaurants
router.route('/:ids').get(restaurantsApi.getRestaurantsByIds); // get a list of restaurant by Ids

export default router;
