import mongoose from 'mongoose';
import Restaurants from '../models/restaurant.js';

const isValidObjectId = mongoose.isValidObjectId;

/* 
    Returns a list of restaurants, based on the query.
    The restaurants collection can be queried for a cuisine, or for a particular keyword.
    The list of restaurants can also be sorted by rating (descending) or distance (ascending).
*/
const getRestaurants = async (req, res) => {
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
        .catch(e => {
            console.error(e);
            res.status(500).json({ error: 'server error' });
        });
};

/* 
    Retuns a list of restaurants corresponding to a list of ObjectIds.
*/
const getRestaurantsByIds = async (req, res) => {
    const ids = req.params.ids.split(',');

    // return 400 if not all ids are invalid ObjectIds
    if (!ids.every(id => isValidObjectId(id)))
        return res.status(400).json({ error: 'bad request' });

    const query = { _id: { $in: ids } };

    Restaurants.find(query)
        .then(doc => res.json(doc))
        .catch(e => {
            console.error(e);
            res.status(500).json({ error: 'server error' });
        });
};

const restaurantsApi = { getRestaurants, getRestaurantsByIds };
export default restaurantsApi;
