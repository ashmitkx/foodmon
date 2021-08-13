import mongoose from 'mongoose';
import Dishes from '../models/dish.js';

const isValidObjectId = mongoose.isValidObjectId;

/* 
    Returns a list of dishes, based on the query.
    The dishes collection can be queried for a cuisine, for a restaurantId, or for a particular keyword.
*/
const getDishes = async (req, res, next) => {
    const limit = req.query.limit || 20; // limit the number of restaurants sent

    let aggregate, // default to find queries
        query = {},
        groupby;

    if (req.query.cuisine) query = { cuisines: { $elemMatch: { $eq: req.query.cuisine } } };
    else if (req.query.restaurantId) {
        const restaurantId = req.query.restaurantId;
        // return 400 if restaurantId is an invalid ObjectId
        if (!isValidObjectId(restaurantId))
            return next({ status: 400, message: 'Invalid restaurantId' });

        query = { 'restaurant._id': { $eq: restaurantId } };
        groupby = 'section'; // Also group dishes by restaurant section
    } else if (req.query.keyword) {
        aggregate = true;
        query = [
            {
                $search: {
                    index: 'search-dishes',
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

    // Override groupby if groupby is explicitly specified in the request
    groupby = req.query.groupby || groupby;

    let doc;
    try {
        if (aggregate) doc = await Dishes.aggregate(query);
        else doc = await Dishes.find(query).lean();
    } catch (err) {
        return next(err);
    }

    switch (groupby) {
        // Group dishes by the restaurant section, if specified.
        case 'section': {
            const groupedDoc = {};
            doc.forEach(dish => {
                const section = dish.restaurant.section;
                if (!groupedDoc[section]) groupedDoc[section] = [];
                groupedDoc[section].push(dish);
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
    Retuns a list of dishes corresponding to a list of ObjectIds.
*/
const getDishesByIds = async (req, res, next) => {
    const ids = req.params.ids.split(',');

    // return 400 if not all ids are invalid ObjectIds
    if (!ids.every(id => isValidObjectId(id)))
        return next({ status: 400, message: 'Invalid dishId(s)' });

    Dishes.find({ _id: { $in: ids } })
        .then(doc => {
            if (doc.length === 0) return next({ status: 404 });
            res.json(doc);
        })
        .catch(next);
};

const dishesApi = { getDishes };
export default dishesApi;
