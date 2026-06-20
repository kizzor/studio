// src/Cart.tsx
import React from 'react';

const Cart = ({ cartItems, onClose }: any) => {
    const totalPrice = cartItems.reduce((acc: number, item: any) => acc + parseFloat(item.price), 0);
    // Example: Estimate delivery as 3 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    return (
        <div className="cart-overlay">
            <button onClick={onClose}>Back to Shop</button>
            <h2>Your Cart</h2>
            <ul>
                {cartItems.map((item: any) => (
                    <li key={item.id}>
                        {item.name} - ₹{item.price}
                    </li>
                ))}
            </ul>
            <div className="cart-footer">
                <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
                <p>Estimated Delivery: {deliveryDate.toDateString()}</p>
                <button>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default Cart;