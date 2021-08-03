import styles from './RestaurantCard.module.css';
import classnames from 'classnames/bind';

import Card from '../Layouts/Card';
import { BiStar, BiTimeFive } from 'react-icons/bi';
import { RiMapPin2Line } from 'react-icons/ri';

const cx = classnames.bind(styles);

const RestaurantCard = ({ restaurant }) => {
    return (
        <Card reverse img={{ src: restaurant.imgUrl, alt: 'restaurant img' }}>
            <div className={cx('top')}>
                <h2>{restaurant.name}</h2>
                <span className={cx('cuisines')}>
                    {/* Capitalize first letter of each cuisine and join them with ', ' */}
                    {restaurant.cuisines
                        .map(cuisine => cuisine[0].toUpperCase() + cuisine.slice(1))
                        .join(', ')}
                </span>
            </div>

            <div className={cx('bottom')}>
                <div className={cx('info')}>
                    <BiStar />
                    <span>{Number(restaurant.rating).toFixed(1)}</span>
                </div>
                <div className={cx('info')}>
                    <BiTimeFive />
                    <span>
                        {/* 1 Km = 5 mins,
                            + 20 min cooking time,
                            rounded to the nearest multiple of 5 */}
                        {Math.round((restaurant.distance * 5 + 20) * 0.2) * 5} Min
                    </span>
                </div>
                <div className={cx('info')}>
                    <RiMapPin2Line />
                    <span>{Number(restaurant.distance).toFixed(1)} Km</span>
                </div>
            </div>
        </Card>
    );
};

export default RestaurantCard;
