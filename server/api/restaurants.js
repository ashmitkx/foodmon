import mongoose from 'mongoose';
import Restaurants from '../models/restaurant.js';

const isValidObjectId = mongoose.isValidObjectId;

/* 
    Returns a list of restaurants, based on the query.
    The restaurants collection can be queried for a cuisine, or for a particular keyword.
    The list of restaurants can also be sorted by rating (descending) or distance (ascending).
*/
const getRestaurants = async (req, res, next) => {
    let query = {};
    if (req.query.cuisine)
        query = { cuisines: { $elemMatch: { $eq: req.query.cuisine } } };
    else if (req.query.keyword) query = { $text: { $search: req.query.keyword } };

    let sortby = {};
    if (req.query.sortby) {
        const sortbyQuery = req.query.sortby;
        if (sortbyQuery === 'rating') sortby = { rating: -1 };
        else if (sortbyQuery === 'distance') sortby = { distance: 1 };
    }

    Restaurants.find(query)
        .sort(sortby)
        .then(doc => res.json(doc))
        .catch(next);
};

/* 
    Retuns a list of restaurants corresponding to a list of ObjectIds.
*/
const getRestaurantsByIds = async (req, res, next) => {
    const ids = req.params.ids.split(',');

    // return 400 if not all ids are invalid ObjectIds
    if (!ids.every(id => isValidObjectId(id)))
        return next({ status: 400, message: 'Invalid restaurantId(s)' });

    Restaurants.find({ _id: { $in: ids } })
        .then(doc => {
            if (doc.length === 0) return next({ status: 404 });
            res.json(doc);
        })
        .catch(next);
};

const restaurantsApi = { getRestaurants, getRestaurantsByIds };
export default restaurantsApi;
