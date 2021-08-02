import styles from './Dish.module.css';
import classnames from 'classnames/bind';

import { FiPlus, FiMinus } from 'react-icons/fi';
import Card from '../Layouts/Card';

const cx = classnames.bind(styles);

const Dish = ({ dish }) => {
    return (
        <Card img={{ src: dish.imgUrl, alt: 'dish img' }}>
            <div className={cx('top')}>
                <h2>{dish.name}</h2>
                <span className={cx('restaurant-name')}>{dish.restaurant.name}</span>
                <img
                    src={dish.vegetarian ? '/assets/veg-icon.png' : '/assets/non-veg-icon.png'}
                    alt='veg-option'
                    className={cx('veg-option')}
                />
            </div>

            <div className={cx('bottom')}>
                <span className={cx('price')}>₹ {dish.price * dish.quantity}</span>
                <div className={cx('quantity')}>
                    <button>
                        <FiPlus />
                    </button>
                    <span>{dish.quantity}</span>
                    <button>
                        <FiMinus />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default Dish;
