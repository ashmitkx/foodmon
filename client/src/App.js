import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import { CartContextProvider, useCartContext } from './contexts/CartContext.js';
import { dataAPI } from './api.js';
import MainNav from './components/Nav/MainNav.js';
import Home from './components/Home/Home.js';
import SearchPage from './components/Search/SearchPage.js';
import ProfilePage from './components/ProfilePage/ProfilePage.js';
import RestaurantPage from './components/Restaurant/RestaurantPage.js';
import Cart from './components/Cart/Cart.js';

const ConditionalRoute = ({ children, condition, redirect, ...rest }) => (
    <Route {...rest} render={() => (condition ? children : <Redirect to={redirect} />)} />
);

const App = () => {
    const [isAuth, setIsAuth] = useState(false);
    const dispatchCart = useCartContext()[1];

    useEffect(() => {
        // Get cart data on mount
        const getCart = async () => {
            try {
                const res = await dataAPI.get('/users/61045a5df4ecda2f10e889c7/cart');
                dispatchCart({ type: 'init', payload: { newCart: res.data.cart } });
            } catch (e) {
                console.error(e);
            }
        };
        getCart();

        // temp fake auth
        setIsAuth(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isAuth && <MainNav />}
            <Switch>
                <ConditionalRoute exact path='/' condition={isAuth} redirect='/login'>
                    <Redirect to='/home' />
                </ConditionalRoute>
                <ConditionalRoute path='/login' condition={!isAuth} redirect='/'>
                    Login
                </ConditionalRoute>
                <ConditionalRoute path='/home' condition={isAuth} redirect='/login'>
                    <Home />
                </ConditionalRoute>
                <ConditionalRoute path='/search' condition={isAuth} redirect='/login'>
                    <SearchPage />
                </ConditionalRoute>
                <ConditionalRoute path='/profile' condition={isAuth} redirect='/login'>
                    <ProfilePage />
                </ConditionalRoute>
                <ConditionalRoute path='/restaurant/:id' condition={isAuth} redirect='/login'>
                    <RestaurantPage />
                </ConditionalRoute>
                {/* Catch all unknown routes and redirect to / */}
                <Route path='/*'>
                    <Redirect to='/' />
                </Route>
            </Switch>
            {isAuth && <Cart />}
        </>
    );
};

const AppWrapper = () => (
    <CartContextProvider>
        <Router>
            <App />
        </Router>
    </CartContextProvider>
);

export default AppWrapper;
