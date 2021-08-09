import { useEffect, useState } from 'react';

import { dataAPI } from '../../api.js';
import Dish from '../Dish/Dish.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';

const Recents = () => {
    const [dateGroups, setDateGroups] = useState({});

    useEffect(() => {
        const getRecentDishes = async () => {
            try {
                const res = await dataAPI.get('/user/recent');
                setDateGroups(res.data);
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
            <CardsDisplay layout='grid' title={`${dayName}, ${dayDate}`} subtitle={time} key={date}>
                {dishes.map(dish => (
                    <Dish standalone recent key={dish._id} dish={dish} />
                ))}
            </CardsDisplay>
        );
    });
};

export default Recents;
