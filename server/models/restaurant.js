import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    imgUrl: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    distance: {
        type: Number,
        required: true
    },
    cuisines: [String]
});

const Restaurant = mongoose.model('restaurant', restaurantSchema);
export default Restaurant;
