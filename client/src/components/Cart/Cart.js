import { useState, useEffect, useReducer } from 'react';
import styles from './Cart.module.css';
import classnames from 'classnames/bind';

import { BsChevronDown } from 'react-icons/bs';
import usersApi from '../../api/users';
import Dish from '../Dish/Dish.js';

const cx = classnames.bind(styles);

// Cart reducer and initial
const initialCart = { dishes: [], subTot: '...', deliveryFee: '...', total: '...' };
const cartReducer = (cart, action) => {
    switch (action.type) {
        case 'fill':
            const dishes = action.payload;
            const subTot = dishes.reduce((acc, dish) => acc + dish.price * dish.quantity, 0);
            const deliveryFee = Math.round(subTot * 0.0275);
            const total = subTot + deliveryFee;
            return { dishes, subTot, deliveryFee, total };
        case 'empty':
            return initialCart;
        default:
            throw new Error('invalid cartReducer action');
    }
};

const Cart = () => {
    const [cart, dispatchCart] = useReducer(cartReducer, initialCart);
    // Show scroll button if dishesDiv is overflowing and user hasnt scrolled to the bottom of dishesDiv
    const [showScroll, setShowScroll] = useState(false);

    // Get cart data on mount
    useEffect(() => {
        const getCart = async () => {
            try {
                const res = await usersApi.getCart('61045a5df4ecda2f10e889c7');
                dispatchCart({ type: 'fill', payload: res.data.cart });

                // Check if dishesDiv is overflowing
                const dishesDiv = document.getElementsByClassName(cx('dishes'))[0];
                if (dishesDiv.clientHeight < dishesDiv.scrollHeight) setShowScroll(true);
            } catch (e) {
                console.error(e);
            }
        };
        getCart();
    }, []);

    // Check if user scrolled to the bottom of dishesDiv
    const handleDishesScroll = event => {
        const dishesDiv = event.target;
        if (dishesDiv.scrollTop >= dishesDiv.scrollHeight - dishesDiv.offsetHeight - 30)
            setShowScroll(false);
        else setShowScroll(true);
    };

    return (
        <section className={cx('cart')}>
            <h1>My Cart</h1>
            <div className={cx('dishes')} onScroll={handleDishesScroll}>
                {cart.dishes.map(dish => (
                    <Dish dish={dish} key={dish._id} />
                ))}
            </div>
            <div className={cx('prices')}>
                {showScroll && (
                    <div className={cx('scroll')}>
                        <BsChevronDown />
                    </div>
                )}
                <div className={cx('price')}>
                    <span className={cx('price-name')}>Sub Total</span>
                    <span className={cx('price-value')}>₹ {cart.subTot}</span>
                </div>
                <div className={cx('price')}>
                    <span className={cx('price-name')}>Delivery Fee</span>
                    <span className={cx('price-value')}>₹ {cart.deliveryFee}</span>
                </div>
                <hr />
                <div className={cx('price')}>
                    <span className={cx('price-name')}>Total</span>
                    <span className={cx('price-value')}>₹ {cart.total}</span>
                </div>
            </div>
            <button className={cx('checkout')}>Checkout</button>
        </section>
    );
};

export default Cart;
