import styles from './Cart.module.css';
import classnames from 'classnames/bind';

import { useCartContext } from '../../contexts/CartContext';
import { RiShoppingBag3Line } from 'react-icons/ri';
import Dish from '../Dish/Dish.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';
import Titlebar from '../Titlebar.js/Titlebar';

const cx = classnames.bind(styles);

const EmptyCart = () => (
    <section className={cx('cart')}>
        <Titlebar icon={<RiShoppingBag3Line />}>My Cart</Titlebar>
        <div className={cx('empty')}>
            <span className={cx('title')}>No dishes in your cart, yet.</span>
            <span className={cx('subtitle')}>Order something to eat!</span>
        </div>
    </section>
);

const Cart = () => {
    const cart = useCartContext()[0];

    if (cart.length === 0) return <EmptyCart />;

    const totItems = cart.reduce((acc, dish) => acc + dish.quantity, 0);
    const subTot = cart.reduce((acc, dish) => acc + dish.price * dish.quantity, 0);
    const deliveryFee = Math.round(subTot * 0.0275);

    return (
        <section className={cx('cart')}>
            <CardsDisplay
                layout='column'
                icon={<RiShoppingBag3Line />}
                title='My Cart'
                subtitle={totItems > 1 ? `${totItems} Dishes` : `${totItems} Dish`}
            >
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
