import { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { dataAPI } from '../../api.js';
import SearchBar from './SearchBar.js';
import SubNav from '../Nav/SubNav.js';
import CardsDisplay from '../Layouts/CardsDisplay.js';
import RestaurantCard from '../Restaurant/RestaurantCard.js';
import Dish from '../Dish/Dish.js';

import { BiDish } from 'react-icons/bi';
import { AiOutlineShop } from 'react-icons/ai';

const RestaurantResults = ({ keyword }) => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const searchRestaurants = async keyword => {
            try {
                const res = await dataAPI.get(`/restaurants?sortby=rating&&keyword=${keyword}`);
                setRestaurants(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        searchRestaurants(keyword);
    }, [keyword]);

    if (restaurants.length === 0)
        return <span className='message'>{`No restaurants found for "${keyword}"`}</span>;

    return (
        <CardsDisplay layout='grid'>
            {restaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
        </CardsDisplay>
    );
};

const DishResults = ({ keyword }) => {
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        const searchDishes = async keyword => {
            try {
                const res = await dataAPI.get(`/dishes?keyword=${keyword}`);
                setDishes(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        searchDishes(keyword);
    }, [keyword]);

    if (dishes.length === 0)
        return <h1 className='message'>{`No dishes found for "${keyword}" `}</h1>;

    return (
        <CardsDisplay layout='grid'>
            {dishes.map(dish => (
                <Dish standalone key={dish._id} dish={dish} />
            ))}
        </CardsDisplay>
    );
};

const PreResult = () => (
    <span className='message'>Search for restaurants, dishes and cuisines ...</span>
);

const subNavLinks = [
    {
        subPage: '/restaurants',
        icon: <AiOutlineShop style={{ height: '1.05em' }} />,
        text: 'Restaurants'
    },
    {
        subPage: '/dishes',
        icon: <BiDish style={{ height: '1.2em' }} />,
        text: 'Dishes'
    }
];

const SearchPage = () => {
    const [keyword, setKeyword] = useState();

    const onSearch = e => {
        e.preventDefault();
        setKeyword(e.target.search.value);
    };

    return (
        <main>
            <SearchBar onSearch={onSearch} autoFocus />
            <SubNav basePage='/search' links={subNavLinks} />
            <Switch>
                <Route exact path='/search'>
                    <Redirect to='/search/restaurants' />
                </Route>
                <Route path='/search/restaurants'>
                    {keyword ? <RestaurantResults keyword={keyword} /> : <PreResult />}
                </Route>
                <Route path='/search/dishes'>
                    {keyword ? <DishResults keyword={keyword} /> : <PreResult />}
                </Route>
                {/* Catch all unknown routes and redirect to /search */}
                <Route path='/search/*'>
                    <Redirect to='/search' />
                </Route>
            </Switch>
        </main>
    );
};

export default SearchPage;
