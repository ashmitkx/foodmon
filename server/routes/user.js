import { Router } from 'express';
import userApi from '../api/user.js';

const userRoute = Router();

userRoute.route('/').get(userApi.getUserDetails); // get basic user details

userRoute
    .route('/cart')
    .get(userApi.getUserCart) // get card data
    .post(userApi.addToUserCart) // add new dish to cart
    .put(userApi.updateUserCart) // update cart data
    .delete(userApi.emptyUserCart); // empty cart (and save contents into recent)

userRoute.route('/recent').get(userApi.getUserRecent); // get recent orders data

export default userRoute;
