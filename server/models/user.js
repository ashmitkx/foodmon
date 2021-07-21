import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    imgUrl: {
        type: String,
        required: true,
        trim: true
    },
    cart: [
        {
            _id: { type: mongoose.ObjectId, unique: true },
            quantity: {
                type: Number,
                default: 1,
                min: 0
            }
        }
    ],
    recent: [
        {
            _id: { type: mongoose.ObjectId, unique: true },
            quantity: {
                type: Number,
                default: 1,
                min: 0
            }
        }
    ],
    favourites: {
        restaurants: { type: [mongoose.ObjectId], unique: true },
        dishes: { type: [mongoose.ObjectId], unique: true }
    }
});

const User = mongoose.model('user', userSchema);
export default User;
