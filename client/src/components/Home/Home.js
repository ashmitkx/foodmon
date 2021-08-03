import { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import SearchBar from '../Search/SearchBar.js';
import SubNav from '../Nav/SubNav.js';
import RestaurantCard from '../Restaurant/RestaurantCard.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';
import restaurantsApi from '../../api/restaurants';

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
        <CardsDisplay title={cuisine} key={cuisine}>
            {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
        </CardsDisplay>
    ));
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
                <Route path='/home/recent'></Route>
                {/* Catch all unknown routes and redirect to /home */}
                <Route path='/home/*'>
                    <Redirect to='/home' />
                </Route>
            </Switch>
        </main>
    );
};

export default Home;
