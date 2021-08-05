import { useEffect, useReducer } from 'react';
import styles from './Cart.module.css';
import classnames from 'classnames/bind';

import { RiShoppingBag3Line } from 'react-icons/ri';
import usersApi from '../../api/users';
import Dish from '../Dish/Dish.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';

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

    // Get cart data on mount
    useEffect(() => {
        const getCart = async () => {
            try {
                const res = await usersApi.getCart('61045a5df4ecda2f10e889c7');
                dispatchCart({ type: 'fill', payload: res.data.cart });
            } catch (e) {
                console.error(e);
            }
        };
        getCart();
    }, []);

    return (
        <section className={cx('cart')}>
            <CardsDisplay icon={<RiShoppingBag3Line />} title='My Cart' overflowing>
                {cart.dishes.map(dish => (
                    <Dish standalone dish={dish} key={dish._id} />
                ))}
            </CardsDisplay>
            <div className={cx('prices')}>
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
