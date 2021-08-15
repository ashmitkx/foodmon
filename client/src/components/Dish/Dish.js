import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dish.module.css';
import classnames from 'classnames/bind';

import vegIcon from '../../images/veg-icon.png';
import nonVegIcon from '../../images/non-veg-icon.png';
import { ReactComponent as Cross } from '../../images/cross.svg';
import { dataAPI } from '../../api.js';
import { useCartContext } from '../../contexts/CartContext';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { BiTrashAlt } from 'react-icons/bi';
import Card from '../Layouts/Card';

const cx = classnames.bind(styles);

const QuantitySelect = ({ type, dishId, children: quantity }) => {
    const dispatchCart = useCartContext()[1];
    const [loading, setLoading] = useState(false);

    const onUpdate = async change => {
        setLoading(true);
        const newQuantity = quantity + change;

        try {
            await dataAPI.put('/user/cart', { _id: dishId, quantity: newQuantity });
            setLoading(false);
            dispatchCart({ type: 'update', payload: { dishId, quantity: newQuantity } });
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    };

    const onAdd = async () => {
        setLoading(true);

        try {
            const res = await dataAPI.post('/user/cart', { _id: dishId });
            dispatchCart({ type: 'add', payload: { dish: res.data } });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    switch (type) {
        case 'recent':
            return (
                <div className={cx('quantity', '--recent')}>
                    <Cross style={{ width: '0.95em' }} />
                    <span>{quantity}</span>
                </div>
            );
        case 'edit':
            return (
                <div className={cx('quantity', { '--disabled': loading })}>
                    <button onClick={() => onUpdate(1)} disabled={loading}>
                        <FiPlus />
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => onUpdate(-1)} disabled={loading}>
                        {quantity > 1 ? (
                            <FiMinus />
                        ) : (
                            <BiTrashAlt style={{ height: '1.1em', marginBottom: '1px' }} />
                        )}
                    </button>
                </div>
            );
        case 'add':
            return (
                <button
                    className={cx('quantity', { '--disabled': loading })}
                    onClick={onAdd}
                    disabled={loading}
                >
                    <FiPlus />
                    <span>Add</span>
                </button>
            );
        default:
            throw new Error('Invalid type prop in QuantitySelect');
    }
};

const ConditionalLink = ({ to, condition, children }) =>
    condition ? <Link to={to}>{children}</Link> : children;

const Dish = ({ dish, recent, standalone }) => {
    const cart = useCartContext()[0];

    if (cart === undefined) return null;

    /*  Try to set quantity if dish object contains quantity, 
        else try to find the dish quantity in the cart,
        otherwise quantity will be undefined. */
    const quantity = dish.quantity || cart.find(cartDish => cartDish._id === dish._id)?.quantity;

    let quantitySelectType;
    if (recent) quantitySelectType = 'recent';
    else if (quantity) quantitySelectType = 'edit';
    else quantitySelectType = 'add';

    return (
        <Card img={{ src: dish.imgUrl, alt: 'dish img' }}>
            <div className={cx('top')}>
                <ConditionalLink to={`/restaurant/${dish.restaurant._id}`} condition={standalone}>
                    <h2>{dish.name}</h2>
                    {standalone && (
                        <span className={cx('restaurant-name')}>{dish.restaurant.name}</span>
                    )}
                </ConditionalLink>
                <img
                    src={dish.vegetarian ? vegIcon : nonVegIcon}
                    alt='veg-option'
                    className={cx('veg-option')}
                />
            </div>

            <div className={cx('bottom')}>
                <span className={cx('price')}>₹ {dish.price}</span>
                <QuantitySelect dishId={dish._id} type={quantitySelectType}>
                    {quantity}
                </QuantitySelect>
            </div>
        </Card>
    );
};

export default Dish;
