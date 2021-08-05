import styles from './Dish.module.css';
import classnames from 'classnames/bind';

import { FiPlus, FiMinus } from 'react-icons/fi';
import Card from '../Layouts/Card';

const cx = classnames.bind(styles);

const QuantitySelect = ({ type, children: quantity }) => {
    switch (type) {
        case 'recent':
            return (
                <div className={cx('quantity')}>
                    <span>🞩</span>
                    <span>{quantity}</span>
                </div>
            );
        case 'edit':
            return (
                <div className={cx('quantity')}>
                    <button>
                        <FiPlus />
                    </button>
                    <span>{quantity}</span>
                    <button>
                        <FiMinus />
                    </button>
                </div>
            );
        case 'add':
            return (
                <button className={cx('quantity')}>
                    <FiPlus />
                    <span>Add</span>
                </button>
            );
        default:
            throw new Error('Invalid type prop in QuantitySelect');
    }
};

const Dish = ({ dish, recent, standalone }) => {
    let quantitySelectType;
    if (recent) quantitySelectType = 'recent';
    else if (dish.quantity && dish.quantity > 0) quantitySelectType = 'edit';
    else quantitySelectType = 'add';

    return (
        <Card img={{ src: dish.imgUrl, alt: 'dish img' }}>
            <div className={cx('top')}>
                <h2>{dish.name}</h2>
                {standalone && (
                    <span className={cx('restaurant-name')}>{dish.restaurant.name}</span>
                )}
                <img
                    src={dish.vegetarian ? '/assets/veg-icon.png' : '/assets/non-veg-icon.png'}
                    alt='veg-option'
                    className={cx('veg-option')}
                />
            </div>

            <div className={cx('bottom')}>
                <span className={cx('price')}>₹ {dish.price}</span>
                <QuantitySelect type={quantitySelectType}>{dish.quantity}</QuantitySelect>
            </div>
        </Card>
    );
};

export default Dish;
