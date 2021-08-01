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
    googleId: {
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
            _id: mongoose.ObjectId,
            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ],
    recent: [
        {
            _id: mongoose.ObjectId,
            quantity: {
                type: Number,
                default: 1,
                min: 1
            },
            added: {
                type: Date,
                default: new Date()
            }
        }
    ]
});

const User = mongoose.model('user', userSchema);
export default User;
