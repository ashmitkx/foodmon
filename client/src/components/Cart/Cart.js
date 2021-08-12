import styles from './Cart.module.css';
import classnames from 'classnames/bind';

import { dataAPI } from '../../api.js';
import { useCartContext } from '../../contexts/CartContext';
import { RiShoppingBag3Line } from 'react-icons/ri';
import Dish from '../Dish/Dish.js';
import CardsDisplay from '../Layouts/CardsDisplay';
import Titlebar from '../Titlebar.js/Titlebar';

const cx = classnames.bind(styles);

const UndefinedCart = () => (
    <section className={cx('cart')}>
        <Titlebar icon={<RiShoppingBag3Line />}>My Cart</Titlebar>
    </section>
);

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
    const [cart, dispatchCart] = useCartContext();

    if (cart === undefined) return <UndefinedCart />;
    if (cart.length === 0) return <EmptyCart />;

    const totItems = cart.reduce((acc, dish) => acc + dish.quantity, 0);
    const subTot = cart.reduce((acc, dish) => acc + dish.price * dish.quantity, 0);
    const deliveryFee = Math.round(subTot * 0.0275);

    const onCheckout = async () => {
        try {
            await dataAPI.delete('/user/cart');
            dispatchCart({ type: 'empty' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className={cx('cart')}>
            <CardsDisplay
                overflowing
                icon={<RiShoppingBag3Line />}
                subtitle={totItems > 1 ? `${totItems} Dishes` : `${totItems} Dish`}
                title='My Cart'
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
            <button className={cx('checkout')} onClick={onCheckout}>
                Checkout
            </button>
        </section>
    );
};

export default Cart;
