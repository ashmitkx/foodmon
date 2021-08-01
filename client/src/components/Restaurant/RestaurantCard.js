import styles from './RestaurantCard.module.css';
import classnames from 'classnames/bind';

import { BiStar, BiTimeFive } from 'react-icons/bi';
import { RiMapPin2Line } from 'react-icons/ri';

const cx = classnames.bind(styles);

const RestaurantCard = () => {
    return (
        <article className={cx('restaurant')}>
            <img src='https://source.unsplash.com/random' alt='dish img' className={cx('img')} />
            <div className={cx('details')}>
                <div className={cx('top')}>
                    <h2>Domino's Pizza</h2>
                    <span className={cx('cuisines')}>Italien, Fast Food, Beverages</span>
                </div>

                <div className={cx('bottom')}>
                    <div className={cx('info')}>
                        <BiStar />
                        <span>4.2</span>
                    </div>
                    <div className={cx('info')}>
                        <BiTimeFive />
                        <span>25 Min</span>
                    </div>
                    <div className={cx('info')}>
                        <RiMapPin2Line />
                        <span>2.1 Km</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default RestaurantCard;
