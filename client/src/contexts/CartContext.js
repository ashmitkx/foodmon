import { createContext, useReducer, useContext } from 'react';

const cartReducer = (cart, action) => {
    switch (action.type) {
        case 'init':
            return action.payload.newCart;
        case 'add': {
            const { dish } = action.payload;

            // Ensure dish doesnt already exist in cart
            if (cart.some(cartDish => cartDish._id === dish._id)) return cart;

            return [...cart, dish];
        }
        case 'update': {
            const { dishId, quantity } = action.payload;
            const index = cart.findIndex(dish => dish._id === dishId);

            // Ensure dish doesnt exist in cart
            if (index === -1) return cart;

            // Update quantity if it is +ve, else remove the dish from the cart
            if (quantity > 0) cart[index].quantity = quantity;
            else cart.splice(index, 1);

            return [...cart];
        }
        case 'empty':
            return [];
        default:
            throw new Error('Unknown cartReducer action type');
    }
};

const CartContext = createContext([undefined, () => {}]);

export const CartContextProvider = ({ children }) => {
    const cartHook = useReducer(cartReducer, undefined);
    return <CartContext.Provider value={cartHook}>{children}</CartContext.Provider>;
};

export const useCartContext = () => useContext(CartContext);
