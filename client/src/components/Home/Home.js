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
        const getTopRated = async () => {
            try {
                const res = await restaurantsApi.getRestaurants({ sortby });
                setRestaurants(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        getTopRated();
    }, [sortby]);

    return (
        <CardsDisplay>
            {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
        </CardsDisplay>
    );
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
                <Route path='/home/cuisines'></Route>
                <Route path='/home/recent'></Route>
            </Switch>
        </main>
    );
};

export default Home;
