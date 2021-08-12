import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import SearchBar from '../Search/SearchBar.js';
import SubNav from '../Nav/SubNav.js';
import RestaurantCard from '../Restaurant/RestaurantCard.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';
import Recents from './Recents.js';
import { dataAPI } from '../../api.js';

import { BiStar, BiTimeFive, BiDish } from 'react-icons/bi';
import { RiMapPin2Line } from 'react-icons/ri';

const SortedRestaurants = ({ sortby }) => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const getSortedRestaurants = async sortby => {
            try {
                const res = await dataAPI.get(`/restaurants?sortby=${sortby}`);
                setRestaurants(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        getSortedRestaurants(sortby);
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
        INDIAN: '🥘',
        CAFE: '☕'
    };

    const [restaurantGroups, setRestaurantGroups] = useState({});

    useEffect(() => {
        const getGroupedRestaurants = async groupby => {
            try {
                const res = await dataAPI.get(`/restaurants?sortby=rating&&groupby=${groupby}`);
                setRestaurantGroups(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        getGroupedRestaurants(groupby);
    }, [groupby]);

    return Object.entries(restaurantGroups).map(([cuisine, restaurants]) => (
        <CardsDisplay icon={cuisineEmojis[cuisine.toUpperCase()]} title={cuisine} key={cuisine}>
            {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
        </CardsDisplay>
    ));
};

const subNavLinks = [
    { subPage: '/toprated', icon: <BiStar />, text: 'Top Rated' },
    { subPage: '/nearby', icon: <RiMapPin2Line />, text: 'Nearby' },
    { subPage: '/cuisines', icon: <BiDish style={{ height: '1.2em' }} />, text: 'Cuisines' },
    { subPage: '/recent', icon: <BiTimeFive />, text: 'Recent' }
];

const Home = () => {
    const history = useHistory();
    const onSearchFocus = () => history.push('/search');

    return (
        <main>
            <SearchBar onSearchFocus={onSearchFocus} />
            <SubNav basePage='/home' links={subNavLinks} />
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
