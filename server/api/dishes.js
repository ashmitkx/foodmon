import mongoose from 'mongoose';
import Dishes from '../models/dish.js';

const isValidObjectId = mongoose.isValidObjectId;

/* 
    Returns a list of dishes, based on the query.
    The dishes collection can be queried for a cuisine, for a restaurantId, or for a particular keyword.
*/
const getDishes = async (req, res) => {
    let query = {};
    if (req.query.cuisine)
        query = { cuisines: { $elemMatch: { $eq: req.query.cuisine } } };
    else if (req.query.restaurantId) {
        const restaurantId = req.query.restaurantId;

        // return 400 if restaurantId is an invalid ObjectId
        if (!isValidObjectId(restaurantId))
            return res.status(400).json({ error: 'bad request' });

        query = { 'restaurant._id': { $eq: restaurantId } };
    } else if (req.query.keyword) query = { $text: { $search: req.query.keyword } };

    Dishes.find(query)
        .then(doc => res.json(doc))
        .catch(e => {
            console.error(e);
            res.status(500).json({ error: 'server error' });
        });
};

/* 
    Retuns a list of dishes corresponding to a list of ObjectIds.
*/
const getDishesByIds = async (req, res) => {
    const ids = req.params.ids.split(',');

    // return 400 if not all ids are invalid ObjectIds
    if (!ids.every(id => isValidObjectId(id)))
        return res.status(400).json({ error: 'bad request' });

    const query = { _id: { $in: ids } };

    Dishes.find(query)
        .then(doc => res.json(doc))
        .catch(e => {
            console.error(e);
            res.status(500).json({ error: 'server error' });
        });
};

const dishesApi = { getDishes, getDishesByIds };
export default dishesApi;
