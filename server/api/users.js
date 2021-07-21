import mongoose from 'mongoose';
import Users from '../models/user.js';

const isValidObjectId = mongoose.isValidObjectId;
const ObjectId = mongoose.Types.ObjectId;

/* 
    Returns the requested resource of the user specified by userId.
    A user can be queried for their cart, recent orders, and favourites.
*/
const getUserResource = async (req, res) => {
    const userId = req.params.id,
        resource = req.params.resource;

    // check if userId is a valid ObjectId
    if (!isValidObjectId(userId))
        return res.status(400).json({ error: 'Invalid userId' });

    // check if the queried resource is valid
    const userResources = ['cart', 'recent', 'favourites'];
    if (!userResources.includes(resource))
        return res.status(404).json({ error: 'not found' });

    const pipeline = [
        { $match: { _id: ObjectId(userId) } }, // find the user with the specified userId
        { $project: { [resource]: 1 } } // project out the required resource
    ];

    if (resource === 'favourites')
        pipeline.push(
            {
                $lookup: {
                    from: 'dishes', // query the dishes collection
                    localField: `${resource}.dishes`, // using an array of ObjectId refernces to the dishes collection
                    foreignField: '_id', // for dishes having the above ObjectIds
                    as: `${resource}.dishes`,
                    // exclude cuisines and restaurant.section fields
                    pipeline: [{ $project: { cuisines: 0, 'restaurant.section': 0 } }]
                }
            },
            {
                $lookup: {
                    from: 'restaurants', // query the restaurants collection
                    localField: `${resource}.restaurants`, // using an array of ObjectId refernces to the restaurants collection
                    foreignField: '_id', // for restaurants having the above ObjectIds
                    as: `${resource}.restaurants`,
                    // exclude cuisines and distance fields
                    pipeline: [{ $project: { cuisines: 0, distance: 0 } }]
                }
            }
        );
    else if (resource === 'cart' || resource === 'recent')
        pipeline.push({
            $lookup: {
                from: 'dishes', // query the dishes collection
                localField: `${resource}._id`, // using an array of ObjectId references to the dishes collection
                foreignField: '_id', // for dishes having the above ObjectIds
                as: `dish_data`,
                // exclude cuisines and restaurant.section fields
                pipeline: [{ $project: { cuisines: 0, 'restaurant.section': 0 } }]
            }
        });

    let doc = await Users.aggregate(pipeline)
        .then(doc => doc[0])
        .catch(e => {
            console.error(e);
            res.status(500).json({ error: 'server error' });
        });

    if (!doc) return;

    // Merge the resource and dish_data arrays by Id, then delete the dish_data array
    if (resource === 'cart' || resource === 'recent') {
        doc[resource] = doc[resource].map(res_item => ({
            ...res_item,
            ...doc.dish_data.find(data_item => res_item._id.equals(data_item._id))
        }));
        delete doc.dish_data;
    }

    res.json(doc);
};

const usersApi = { getUserResource };
export default usersApi;
