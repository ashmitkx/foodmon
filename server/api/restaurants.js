import mongoose from 'mongoose';
import Restaurants from '../models/restaurant.js';

const isValidObjectId = mongoose.isValidObjectId;

/* 
    Returns a list of restaurants, based on the query.
    The restaurants collection can be queried for all restaurats, or for a particular keyword.
    The list of restaurants can be sorted by rating (descending) or distance (ascending).
    The list of restaurants can be grouped by the first cuisine in each restaurant's cuisines array.
*/
const getRestaurants = async (req, res, next) => {
    let query = {};
    if (req.query.keyword) query = { $text: { $search: req.query.keyword } };

    let sortby = {};
    if (req.query.sortby) {
        const sortbyQuery = req.query.sortby;
        if (sortbyQuery === 'rating') sortby = { rating: -1 };
        else if (sortbyQuery === 'distance') sortby = { distance: 1 };
    }

    const groupby = req.query.groupby;

    let doc;
    try {
        doc = await Restaurants.find(query).sort(sortby);
    } catch (e) {
        return next(e);
    }

    switch (groupby) {
        // Group restaurants by the first cuisine of each restaurant's cuisines array, if specified.
        case 'cuisine':
            const groupedDoc = {};
            doc.forEach(restaurant => {
                const cuisine = restaurant.cuisines[0];
                if (!groupedDoc[cuisine]) groupedDoc[cuisine] = [];
                groupedDoc[cuisine].push(restaurant);
            });

            doc = groupedDoc;
            break;

        default:
        // Do nothing
    }

    res.json(doc);
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
