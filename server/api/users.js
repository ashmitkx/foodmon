import mongoose from 'mongoose';
import Users from '../models/user.js';
import Dishes from '../models/dish.js';

const isValidObjectId = mongoose.isValidObjectId;
const ObjectId = mongoose.Types.ObjectId;

const validateUserId = async (req, res, next) => {
    const userId = req.params.id;

    // check if userId is a valid ObjectId
    if (!isValidObjectId(userId)) return next({ status: 400, message: 'Invalid userId' });

    // check if userId exists in db
    const count = await Users.countDocuments({ _id: userId }).catch(next);
    if (count === 0) next({ status: 404 });

    next();
};

/* 
    Returns the cart details of the user specified by userId.
*/
const getUserCart = async (req, res, next) => {
    const userId = req.params.id;

    const pipeline = [
        { $match: { _id: ObjectId(userId) } }, // find the user with the specified userId
        { $project: { cart: 1 } }, // project out the required resource
        {
            $lookup: {
                from: 'dishes', // query the dishes collection
                localField: 'cart._id', // using an array of ObjectId references to the dishes collection
                foreignField: '_id', // for dishes having the above ObjectIds
                as: `dishes`,
                // exclude cuisines and restaurant.section fields
                pipeline: [{ $project: { cuisines: 0, 'restaurant.section': 0 } }]
            }
        }
    ];

    Users.aggregate(pipeline)
        .then(doc => {
            doc = doc[0];

            // Merge the resource and dish_data arrays by Id, then delete the dishes array
            doc.cart = doc.cart.map(cart_item => ({
                ...cart_item,
                ...doc.dishes.find(dish => cart_item._id.equals(dish._id))
            }));
            delete doc.dishes;

            res.json(doc);
        })
        .catch(next);
};

/* 
    Returns the recent order details of the user specified by userId.
*/
const getUserRecent = async (req, res, next) => {
    const userId = req.params.id;

    const pipeline = [
        { $match: { _id: ObjectId(userId) } }, // find the user with the specified userId
        { $project: { recent: 1 } }, // project out the required resource
        {
            $lookup: {
                from: 'dishes', // query the dishes collection
                localField: 'recent._id', // using an array of ObjectId references to the dishes collection
                foreignField: '_id', // for dishes having the above ObjectIds
                as: `dishes`,
                // exclude cuisines and restaurant.section fields
                pipeline: [{ $project: { cuisines: 0, 'restaurant.section': 0 } }]
            }
        }
    ];

    let doc;
    try {
        doc = await Users.aggregate(pipeline);
        doc = doc[0];
    } catch (err) {
        return next(err);
    }

    // Merge the resource and dish_data arrays by Id, then delete the dishes array
    doc.recent = doc.recent.map(recent_item => ({
        ...recent_item,
        ...doc.dishes.find(dish => recent_item._id.equals(dish._id))
    }));
    delete doc.dishes;

    // Reverse the recent array to show most recent orders first
    doc.recent = doc.recent.reverse();

    // Group recent dishes by the added date
    const groupedRecent = {};
    let prevDate;
    doc.recent.forEach(dish => {
        const date = dish.added.getTime();

        // If the current date is beyond 500ms from the last one, create a new date group.
        // If the current date is within 500ms from the last one, added it to that last dish's date group.
        if (Math.abs(date - prevDate) > 500 || !prevDate) {
            if (!groupedRecent[date]) groupedRecent[date] = [];
            prevDate = date;
        }

        groupedRecent[prevDate].push(dish);
    });
    doc.recent = groupedRecent;

    res.json(doc);
};

const addToUserCart = async (req, res, next) => {
    const userId = req.params.id,
        dishId = req.body.id;

    if (!dishId) return next({ status: 400, message: 'Incomplete request body' });
    if (!isValidObjectId(dishId)) return next({ status: 400, message: 'Invalid dishId' });

    let result;
    try {
        // Add the dishID into the cart, only if it doesnt already exist.
        // The quantity need not be specified, as it defaults to 1.
        result = await Users.updateOne(
            { _id: userId, 'cart._id': { $ne: dishId } },
            { $push: { cart: { _id: dishId } } }
        );
    } catch (err) {
        return next(err);
    }

    // Check if the adding the dishID was unsuccessful
    if (result.nModified === 0)
        return next({
            status: 400,
            message: 'Failed to add dish to cart. Dish may already exist.'
        });

    let dish;
    try {
        // get the dish document corresponding to the newly added dishID
        dish = await Dishes.findById(dishId).lean();
    } catch (err) {
        return next(err);
    }

    // Attach the initial default quantity to the response
    dish = { ...dish, quantity: 1 };
    res.json(dish);
};

const updateUserCart = async (req, res, next) => {
    const userId = req.params.id,
        dishId = req.body.id,
        quantity = req.body.quantity;

    if (!dishId || quantity == undefined)
        return next({ status: 400, message: 'Incomplete request body' });
    if (!isValidObjectId(dishId)) return next({ status: 400, message: 'Invalid dishId' });

    let result;
    try {
        // If specified quantity is <= 0, then remove the item from cart array
        if (quantity <= 0)
            result = await Users.updateOne({ _id: userId }, { $pull: { cart: { _id: dishId } } });
        // Else update the quantity corresponding to the dishId
        else
            result = await Users.updateOne(
                { _id: userId, 'cart._id': dishId },
                { $set: { 'cart.$.quantity': quantity } }
            );
    } catch (err) {
        return next(err);
    }

    // Check if updating the dish was unsuccessful
    if (result.nModified === 0)
        return next({
            status: 400,
            message: 'Failed to update dish in cart. Dish may not exist.'
        });

    res.status(204).send();
};

const emptyUserCart = async (req, res, next) => {
    const userId = req.params.id;

    // get cart array of user
    Users.findOne({ _id: userId }, { cart: 1 })
        .lean()
        // push cart array into recent array
        .then(doc => Users.updateOne({ _id: userId }, { $push: { recent: { $each: doc.cart } } }))
        // empty the cart array
        .then(() => Users.updateOne({ _id: userId }, { $set: { cart: [] } }))
        .then(() => res.status(204).send())
        .catch(next);
};

const usersApi = {
    validateUserId,
    getUserCart,
    getUserRecent,
    addToUserCart,
    updateUserCart,
    emptyUserCart
};
export default usersApi;
