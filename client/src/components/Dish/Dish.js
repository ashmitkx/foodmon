import { Link } from 'react-router-dom';
import styles from './Dish.module.css';
import classnames from 'classnames/bind';

import { dataAPI } from '../../api.js';
import { useCartContext } from '../../contexts/CartContext';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { BiTrashAlt } from 'react-icons/bi';
import Card from '../Layouts/Card';

const cx = classnames.bind(styles);

const QuantitySelect = ({ type, onUpdate, onAdd, children: quantity }) => {
    switch (type) {
        case 'recent':
            return (
                <div className={cx('quantity', '--recent')}>
                    <span>🞩</span>
                    <span>{quantity}</span>
                </div>
            );
        case 'edit':
            return (
                <div className={cx('quantity')}>
                    <button onClick={() => onUpdate(1)}>
                        <FiPlus />
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => onUpdate(-1)}>
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
                <button className={cx('quantity')} onClick={onAdd}>
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
    const [cart, dispatchCart] = useCartContext();

    /*  Try to set quantity if dish object contains quantity, 
        else try to find the dish quantity in the cart,
        otherwise quantity will be undefined. */
    const quantity = dish.quantity || cart.find(cartDish => cartDish._id === dish._id)?.quantity;

    let quantitySelectType;
    if (recent) quantitySelectType = 'recent';
    else if (quantity) quantitySelectType = 'edit';
    else quantitySelectType = 'add';

    const onUpdate = async change => {
        const dishId = dish._id;
        const newQuantity = quantity + change;

        try {
            await dataAPI.put('/user/cart', { _id: dishId, quantity: newQuantity });
            dispatchCart({ type: 'update', payload: { dishId, quantity: newQuantity } });
        } catch (err) {
            console.error(err);
        }
    };

    const onAdd = async () => {
        const _id = dish._id;
        try {
            const res = await dataAPI.post('/user/cart', { _id });
            dispatchCart({ type: 'add', payload: { dish: res.data } });
        } catch (err) {
            console.error(err);
        }
    };

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
                    src={dish.vegetarian ? '/assets/veg-icon.png' : '/assets/non-veg-icon.png'}
                    alt='veg-option'
                    className={cx('veg-option')}
                />
            </div>

            <div className={cx('bottom')}>
                <span className={cx('price')}>₹ {dish.price}</span>
                <QuantitySelect type={quantitySelectType} onUpdate={onUpdate} onAdd={onAdd}>
                    {quantity}
                </QuantitySelect>
            </div>
        </Card>
    );
};

export default Dish;
