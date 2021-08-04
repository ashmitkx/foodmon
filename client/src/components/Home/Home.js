import { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import SearchBar from '../Search/SearchBar.js';
import SubNav from '../Nav/SubNav.js';
import RestaurantCard from '../Restaurant/RestaurantCard.js';
import Dish from '../Dish/Dish.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';
import restaurantsApi from '../../api/restaurants';
import usersApi from '../../api/users.js';

const SortedRestaurants = ({ sortby }) => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const getSortedRestaurants = async () => {
            try {
                const res = await restaurantsApi.getRestaurants({ sortby });
                setRestaurants(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        getSortedRestaurants();
    }, [sortby]);

    return (
        <CardsDisplay>
            {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
        </CardsDisplay>
    );
};

const GroupedRestaurants = ({ groupby }) => {
    const cuisineEmojis = {
        PIZZA: '🍕',
        CHINESE: '🥡',
        SANDWICHES: '🥪',
        BURGERS: '🍔'
    };

    const [restaurantGroups, setRestaurantGroups] = useState({});

    useEffect(() => {
        const getGroupedRestaurants = async () => {
            try {
                const res = await restaurantsApi.getRestaurants({ groupby, sortby: 'rating' });
                setRestaurantGroups(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        getGroupedRestaurants();
    }, [groupby]);

    return Object.entries(restaurantGroups).map(([cuisine, restaurants]) => (
        <CardsDisplay title={`${cuisineEmojis[cuisine.toUpperCase()]} ${cuisine}`} key={cuisine}>
            {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
        </CardsDisplay>
    ));
};

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
                    <Dish key={dish._id} dish={dish} />
                ))}
            </CardsDisplay>
        );
    });
};

const Home = () => {
    return (
        <main>
            <SearchBar />
            <SubNav />
            <Switch>
                <Route exact path='/home'>
                    <Redirect to='/home/toprated' />
                </Route>
                <Route path='/home/toprated'>
                    <SortedRestaurants sortby='rating' />
                </Route>
                <Route path='/home/nearby'>
                    <SortedRestaurants sortby='distance' />
                </Route>
                <Route path='/home/cuisines'>
                    <GroupedRestaurants groupby='cuisine' />
                </Route>
                <Route path='/home/recent'>
                    <Recents />
                </Route>
                {/* Catch all unknown routes and redirect to /home */}
                <Route path='/home/*'>
                    <Redirect to='/home' />
                </Route>
            </Switch>
        </main>
    );
};

export default Home;
