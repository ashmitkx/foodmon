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
    const limit = req.query.limit || 20; // limit the number of restaurants sent

    let aggregate,
        query = {};
    if (req.query.keyword) {
        aggregate = true;
        query = [
            {
                $search: {
                    index: 'search-restaurants',
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: req.query.keyword,
                                    path: 'name',
                                    tokenOrder: 'sequential'
                                }
                            },
                            {
                                text: {
                                    query: req.query.keyword,
                                    path: { wildcard: '*' }
                                }
                            }
                        ]
                    }
                }
            },
            { $limit: limit }
        ];
    }

    let sortby = {};
    if (req.query.sortby) {
        const sortbyQuery = req.query.sortby;
        if (sortbyQuery === 'rating') sortby = { rating: -1 };
        else if (sortbyQuery === 'distance') sortby = { distance: 1 };
    }

    let doc;
    try {
        if (aggregate) doc = await Restaurants.aggregate(query);
        else doc = await Restaurants.find(query).sort(sortby).limit(limit).lean();
    } catch (e) {
        return next(e);
    }

    const groupby = req.query.groupby;
    switch (groupby) {
        // Group restaurants by the first cuisine of each restaurant's cuisines array, if specified.
        case 'cuisine': {
            const groupedDoc = {};
            doc.forEach(restaurant => {
                const cuisine = restaurant.cuisines[0];
                if (!groupedDoc[cuisine]) groupedDoc[cuisine] = [];
                groupedDoc[cuisine].push(restaurant);
            });

            doc = groupedDoc;
            break;
        }

        default:
        // Do nothing
    }

    res.json(doc);
};

/* 
    Retuns a restaurants corresponding to an ObjectId.
*/
const getRestaurantById = async (req, res, next) => {
    const id = req.params.id;

    // return 400 if id is an invalid ObjectId
    if (!isValidObjectId(id)) return next({ status: 400, message: 'Invalid restaurantId' });

    let doc;
    try {
        doc = await Restaurants.findById(id).lean();
    } catch (err) {
        return next(err);
    }

    if (!doc) return next({ status: 404 });
    res.json(doc);
};

const restaurantsApi = { getRestaurants, getRestaurantById };
export default restaurantsApi;
