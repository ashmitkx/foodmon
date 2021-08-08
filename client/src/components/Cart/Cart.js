import styles from './Cart.module.css';
import classnames from 'classnames/bind';

import { useCartContext } from '../../contexts/CartContext';
import { RiShoppingBag3Line } from 'react-icons/ri';
import Dish from '../Dish/Dish.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';

const cx = classnames.bind(styles);

const EmptyCart = () => (
    <section className={cx('cart')}>
        <CardsDisplay icon={<RiShoppingBag3Line />} title='My Cart' />
        <div className={cx('empty')}>
            <span className={cx('title')}>No dishes in your cart, yet.</span>
            <span className={cx('subtitle')}>Order something to eat!</span>
        </div>
    </section>
);

const Cart = () => {
    const cart = useCartContext()[0];

    if (cart.length === 0) return <EmptyCart />;

    const subTot = cart.reduce((acc, dish) => acc + dish.price * dish.quantity, 0);
    const deliveryFee = Math.round(subTot * 0.0275);

    return (
        <section className={cx('cart')}>
            <CardsDisplay icon={<RiShoppingBag3Line />} title='My Cart' overflowing>
                {cart.map(dish => (
                    <Dish standalone dish={dish} key={dish._id} />
                ))}
            </CardsDisplay>
            <div className={cx('prices')}>
                <div className={cx('price')}>
                    <span className={cx('price-name')}>Sub Total</span>
                    <span className={cx('price-value')}>₹ {subTot}</span>
                </div>
                <div className={cx('price')}>
                    <span className={cx('price-name')}>Delivery Fee</span>
                    <span className={cx('price-value')}>₹ {deliveryFee}</span>
                </div>
                <hr />
                <div className={cx('price')}>
                    <span className={cx('price-name')}>Total</span>
                    <span className={cx('price-value')}>₹ {subTot + deliveryFee}</span>
                </div>
            </div>
            <button className={cx('checkout')}>Checkout</button>
        </section>
    );
};

export default Cart;
