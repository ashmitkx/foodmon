import mongoose from 'mongoose';
import Dishes from '../models/dish.js';

const isValidObjectId = mongoose.isValidObjectId;

const getUserDetails = async (req, res, next) => {
    const { name, email, imgUrl } = req.user.toObject();
    res.json({ name, email, imgUrl });
};

/* 
    Returns the cart details of the user.
*/
const getUserCart = async (req, res, next) => {
    const cart = req.user.toObject().cart;
    const dishIds = cart.map(dish => dish._id);

    // Get dish objects using dishIds
    let dishes;
    try {
        dishes = await Dishes.find(
            { _id: { $in: dishIds } },
            { cuisines: 0, 'restaurant.section': 0 }
        ).lean();
    } catch (err) {
        return next(err);
    }

    // Merge the cart and the retreived dishes by dishId
    const fullCart = cart.map(cartDish => ({
        ...cartDish,
        ...dishes.find(dish => cartDish._id.equals(dish._id))
    }));

    res.json(fullCart);
};

/* 
    Returns the recent order details of the user.
*/
const getUserRecent = async (req, res, next) => {
    const recent = req.user.toObject().recent;
    const dishIds = recent.map(dish => dish._id);

    // Get dish objects using dishIds
    let dishes;
    try {
        dishes = await Dishes.find(
            { _id: { $in: dishIds } },
            { cuisines: 0, 'restaurant.section': 0 }
        ).lean();
    } catch (err) {
        return next(err);
    }

    // Merge the recent array and the retreived dishes by dishId
    const fullRecent = recent.map(recentDish => ({
        ...recentDish,
        ...dishes.find(dish => recentDish._id.equals(dish._id))
    }));

    // Group recent dishes by the added date
    const groupedRecent = {};
    let prevDate;
    fullRecent.forEach(dish => {
        const date = dish.added.getTime();

        // If the current date is beyond 500ms from the last one, create a new date group.
        // If the current date is within 500ms from the last one, added it to that last dish's date group.
        if (Math.abs(date - prevDate) > 500 || !prevDate) {
            if (!groupedRecent[date]) groupedRecent[date] = [];
            prevDate = date;
        }
        groupedRecent[prevDate].push(dish);
    });

    res.json(groupedRecent);
};

/* 
    Add a dish to the user's cart. Automatically sets quantity to a default of 1.
 */
const addToUserCart = async (req, res, next) => {
    const user = req.user,
        dishId = req.body._id;

    if (!dishId) return next({ status: 400, message: 'Incomplete request body' });
    if (!isValidObjectId(dishId)) return next({ status: 400, message: 'Invalid dishId' });

    // Check if the dishId already exists in cart
    if (user.cart.some(dish => dish._id.toString() === dishId))
        return next({
            status: 400,
            message: `Cannot add dish #${dishId} into cart. Dish already exists.`
        });

    // Add the dishId into the cart, only if it doesnt already exist.
    // The quantity need not be specified, as it defaults to 1.
    user.cart.push({ _id: dishId });
    try {
        user.save();
    } catch (err) {
        return next(err);
    }

    // get the dish document corresponding to the newly added dishID
    let dish;
    try {
        dish = await Dishes.findById(dishId).lean();
    } catch (err) {
        return next(err);
    }

    // Attach the initial default quantity to the response
    dish = { ...dish, quantity: 1 };
    res.json(dish);
};

/* 
    Update a dish in the user's cart. Either update the quantity, or remove the dish from cart.
 */
const updateUserCart = async (req, res, next) => {
    const user = req.user,
        dishId = req.body._id,
        quantity = req.body.quantity;

    if (!dishId || !(quantity || quantity === 0))
        return next({ status: 400, message: 'Incomplete request body' });
    if (!isValidObjectId(dishId)) return next({ status: 400, message: 'Invalid dishId' });

    const index = user.cart.findIndex(dish => dish._id.toString() === dishId);

    // Check if the dishId doesnt exist in cart
    if (index === -1)
        return next({
            status: 400,
            message: `Failed to update dish #${dishId}. Dish does not exist in cart.`
        });

    // If specified quantity is <= 0, then remove the item from cart array
    // Else update the quantity corresponding to the dishId
    if (quantity <= 0) user.cart.splice(index, 1);
    else user.cart[index].quantity = quantity;

    try {
        user.save();
    } catch (err) {
        return next(err);
    }

    res.status(204).send();
};

/* 
    Empty the user's cart into the recents array.
*/
const emptyUserCart = async (req, res, next) => {
    const user = req.user;

    if (user.cart.length === 0) res.status(204).send();

    // unshift the cart array to the beginning of recent array, then clear the cart array
    user.recent.unshift(...user.cart);
    user.cart = [];

    try {
        user.save();
    } catch (err) {
        return next(err);
    }

    res.status(204).send();
};

const usersApi = {
    getUserDetails,
    getUserCart,
    getUserRecent,
    addToUserCart,
    updateUserCart,
    emptyUserCart
};
export default usersApi;
