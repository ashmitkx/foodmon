import { Router } from 'express';
import usersApi from '../api/users.js';

const usersRoute = Router();
const specificUserRoute = Router({ mergeParams: true });

usersRoute.use('/:id', specificUserRoute);
usersRoute.route('/').post((_, res) => res.send('/ : post')); // create new user

// Access a specific user data
specificUserRoute.use(usersApi.validateUserId); // check userId for validity and existance
specificUserRoute.route('/').get((req, res) => res.send(`/${req.params.id} : get`)); // get basic user data
specificUserRoute
    .route('/cart')
    .get(usersApi.getUserCart) // get card data
    .post(usersApi.addToUserCart) // add new dish to cart
    .put(usersApi.updateUserCart) // update cart data
    .delete(usersApi.emptyUserCart); // empty cart (and save contents into recent)
specificUserRoute.route('/recent').get(usersApi.getUserRecent); // get recent orders data

export default usersRoute;
