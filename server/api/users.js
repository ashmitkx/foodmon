import mongoose from 'mongoose';
import Users from '../models/user.js';

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

            // Merge the resource and dish_data arrays by Id, then delete the dish_data array
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

    Users.aggregate(pipeline)
        .then(doc => {
            doc = doc[0];

            // Merge the resource and dish_data arrays by Id, then delete the dish_data array
            doc.recent = doc.recent.map(recent_item => ({
                ...recent_item,
                ...doc.dishes.find(dish => recent_item._id.equals(dish._id))
            }));
            delete doc.dishes;

            // Reverse the recent array to show most recent orders first
            doc.recent = doc.recent.reverse();
            res.json(doc);
        })
        .catch(next);
};

const updateUserCart = async (req, res, next) => {
    const userId = req.params.id,
        dishId = req.body.id,
        quantity = req.body.quantity;

    if (!dishId || !quantity)
        return next({ status: 400, message: 'Incomplete request body' });

    if (!isValidObjectId(dishId)) return next({ status: 400, message: 'Invalid dishId' });

    if (quantity <= 0) {
        // If specified quantity is <= 0, then remove the item from cart array
        await Users.updateOne({ _id: userId }, { $pull: { cart: { _id: dishId } } })
            .then(() => res.status(204).send())
            .catch(next);
        return;
    }

    // Add the dish obj into the cart, only if it doesnt exist
    Users.updateOne(
        { _id: userId, 'cart._id': { $ne: dishId } },
        { $push: { cart: { _id: dishId, quantity } } }
    )
        .then(result => {
            // Check if the adding the dish object was successful
            if (result.nModified !== 0) return;

            // If adding the dish object was unsuccessful, that means that the object already exists.
            // Hence, update the object
            return Users.updateOne(
                { _id: userId, 'cart._id': dishId },
                { $set: { 'cart.$.quantity': quantity } }
            );
        })
        .then(() => res.status(204).send())
        .catch(next);
};

const emptyUserCart = async (req, res, next) => {
    const userId = req.params.id;

    // get cart array of user
    Users.findOne({ _id: userId }, { cart: 1 })
        // push cart array into recent array
        .then(doc =>
            Users.updateOne({ _id: userId }, { $push: { recent: { $each: doc.cart } } })
        )
        // empty the cart array
        .then(() => Users.updateOne({ _id: userId }, { $set: { cart: [] } }))
        .then(() => res.status(204).send())
        .catch(next);
};

const usersApi = {
    validateUserId,
    getUserCart,
    getUserRecent,
    updateUserCart,
    emptyUserCart
};
export default usersApi;
