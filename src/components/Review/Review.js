import React, { useEffect, useState } from 'react';
import { getDatabaseCart, removeFromDatabaseCart, processOrder } from '../../utilities/databaseManager';
import fakeData from '../../fakeData';
import ReviewItem from '../ReviewItem/ReviewItem';
import Cart from '../Cart/Cart';
import happyImage from '../../images/giphy.gif';
import { Link } from 'react-router-dom';
import { useAuth } from '../Login/UseAuth';

const Review = () => {

    const [cart, setCart] = useState([]);
    const [orderPlaced, settOrderPlaced] = useState(false);
    const auth = useAuth();

    const handlePlaceOrder =()=>{
        setCart([]);
        settOrderPlaced(true);
        processOrder();

    }

    const removeProduct = (productKey) =>{
        const newCart = cart.filter(pd=>pd.key!==productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }
   
    useEffect(()=>{
            //Cart
            const savedCart = getDatabaseCart();
            const productKeys = Object.keys(savedCart);
            const cartProducts = productKeys.map(key => {
                const product = fakeData.find( pd => pd.key === key);
                product.quantity = savedCart[key];
                return product
            });
            setCart(cartProducts);

    },[]);

    let thankYou;
     if(orderPlaced){
        thankYou =<img src={happyImage} alt=""/>
     } 
    
    return (
        <div className="twin-container">
             <div className="product-container">
                {
                    cart.map(pd=> <ReviewItem 
                    removeProduct ={removeProduct}
                    key ={pd.key}
                    product={pd}></ReviewItem> )
                }
                {
                    !cart.length && <h1>Your card is empty <a href="/shop">keep shoping!</a> </h1>
                }
             </div>
             <div className="cart-container">
                    <Cart cart={cart}>
                        <Link to="/shipment">
                            {   auth.user ?
                                <button className="main-button">Checkout</button>
                                :
                                <button className="main-button">Login to Checkout</button>
                                
                            }
                        </Link>
                    </Cart>
             </div>
        </div>
    );
};

export default Review;