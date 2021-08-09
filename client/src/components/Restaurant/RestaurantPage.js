import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styles from './RestaurantPage.module.css';
import classnames from 'classnames/bind';

import { dataAPI } from '../../api.js';
import Card from '../Layouts/Card';
import CardsDisplay from '../Layouts/CardsDisplay.js';
import Dish from '../Dish/Dish.js';
import { BiStar, BiTimeFive } from 'react-icons/bi';
import { RiMapPin2Line } from 'react-icons/ri';
import { IoIosArrowBack } from 'react-icons/io';

const cx = classnames.bind(styles);

const Restaurant = ({ id }) => {
    const [restaurant, setRestaurant] = useState({ cuisines: [] });

    useEffect(() => {
        const getRestaurant = async id => {
            try {
                const res = await dataAPI.get(`/restaurants/${id}`);
                setRestaurant(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        getRestaurant(id);
    }, [id]);

    return (
        <CardsDisplay layout='single'>
            <Card hero img={{ src: restaurant.imgUrl, alt: 'restaurant img' }}>
                <div className={cx('text')}>
                    <h2>{restaurant.name}</h2>
                    <span>{restaurant.cuisines.join(', ')}</span>
                </div>

                <div className={cx('details')}>
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
        </CardsDisplay>
    );
};

const Dishes = ({ restaurantId }) => {
    const [dishGroups, setDishGroups] = useState([]);

    useEffect(() => {
        const getGroupedDishes = async restaurantId => {
            try {
                const res = await dataAPI.get(`/dishes?restaurantId=${restaurantId}`);
                setDishGroups(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        getGroupedDishes(restaurantId);
    }, [restaurantId]);

    return Object.entries(dishGroups).map(([section, dishes]) => (
        <CardsDisplay layout='grid' title={section} key={section}>
            {dishes.map(dish => (
                <Dish key={dish._id} dish={dish} />
            ))}
        </CardsDisplay>
    ));
};

const RestaurantPage = () => {
    const { id } = useParams();
    const history = useHistory();

    return (
        <main>
            <button className={cx('back')} onClick={history.goBack}>
                <IoIosArrowBack />
            </button>
            <Restaurant id={id} />
            <Dishes restaurantId={id} />
        </main>
    );
};

export default RestaurantPage;
