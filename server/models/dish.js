import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
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
    cuisines: [String],
    restaurant: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        _id: {
            type: mongoose.ObjectId,
            required: true
        },
        section: {
            type: String,
            required: true,
            trim: true
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    vegetarian: {
        type: Boolean,
        required: true
    }
});

const Dish = mongoose.model('dish', dishSchema);
export default Dish;
