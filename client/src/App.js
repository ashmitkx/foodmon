import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import { CartContextProvider, useCartContext } from './contexts/CartContext.js';
import { dataAPI, authAPI } from './api.js';
import Login from './components/Login/Login';
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
        // Check if user is authenticated, on mount
        const checkAuth = async () => {
            try {
                const res = await authAPI.get('isauth');
                setIsAuth(res.data.authenticated);
            } catch (err) {
                console.error(err);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        // Get cart data, if authenticated
        const getCart = async () => {
            try {
                const res = await dataAPI.get('/user/cart');
                dispatchCart({ type: 'init', payload: { newCart: res.data } });
            } catch (e) {
                console.error(e);
            }
        };
        if (isAuth) getCart();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuth]);

    return (
        <>
            {isAuth && <MainNav />}
            <Switch>
                <ConditionalRoute exact path='/' condition={isAuth} redirect='/login'>
                    <Redirect to='/home' />
                </ConditionalRoute>
                <ConditionalRoute path='/login' condition={!isAuth} redirect='/'>
                    <Login />
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
