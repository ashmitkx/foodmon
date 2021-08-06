import { useEffect, useState } from 'react';
import usersApi from '../../api/users.js';

import Dish from '../Dish/Dish.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';

const Recents = () => {
    const [dateGroups, setDateGroups] = useState({});

    useEffect(() => {
        const getRecentDishes = async () => {
            try {
                const res = await usersApi.getRecent('61045a5df4ecda2f10e889c7');
                setDateGroups(res.data.recent);
            } catch (err) {
                console.error(err);
            }
        };
        getRecentDishes();
    }, []);

    return Object.entries(dateGroups).map(([date, dishes]) => {
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        const [dayName, dayDate, time] = new Date(Number(date))
            .toLocaleString('en-GB', options)
            .split(', ');

        return (
            <CardsDisplay title={`${dayName}, ${dayDate}`} subtitle={time} key={date}>
                {dishes.map(dish => (
                    <Dish standalone recent key={dish._id} dish={dish} />
                ))}
            </CardsDisplay>
        );
    });
};

export default Recents;