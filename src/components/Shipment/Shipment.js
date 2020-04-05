import React from 'react';
import { useForm } from 'react-hook-form';
import './Shipment.css';
import { useAuth } from '../Login/UseAuth';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import { useState } from 'react';


const Shipment = () => {
  const { register, handleSubmit, errors } = useForm()
  const [shipInfo, setShipInfo] = useState(null);
  const [orderId, setOrderId] = useState(null);


  const auth = useAuth();

  const stripePromise = loadStripe('pk_test_ubopnwj9basezWfBovYMu2MN00zSxpuU6i');

  const onSubmit = data => {
    setShipInfo(data);
    //TODO: Shakil move this after payment

  }

  const handlePlaceOrder = (payment) => {
    const savedCart = getDatabaseCart();
    const orderDetail = {
      email: auth.user.email,
      cart: savedCart,
      shipment: shipInfo,
      payment: payment
    };

    fetch('https://boiling-tor-50537.herokuapp.com/placeOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDetail)
    })
      .then(res => res.json())
      .then(order => {
        setOrderId(order._id)
        processOrder();//clear localstorate cart
        //give thanks to the user
      })

  }


  return (
    <div className="container">
      <div className="row">
        <div style={{ display: shipInfo && 'none' }} className="col-md-6">
          <h3>Shiping Information</h3>
          <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>
            <input name="name" defaultValue={auth.user.name} ref={register({ required: true })} placeholder="Name" />
            {errors.name && <span className="error">Name is required</span>}

            <input name="email" defaultValue={auth.user.email} ref={register({ required: true })} placeholder="Email" />
            {errors.email && <span className="error">Email is required</span>}

            <input name="addressLine1" ref={register({ required: true })} placeholder="Address Line1" />
            {errors.addressLine1 && <span className="error">Address is required</span>}

            <input name="addressLine2" ref={register} placeholder="Address Line2" />

            <input name="city" ref={register({ required: true })} placeholder="City" />
            {errors.city && <span className="error">City is required</span>}

            <input name="country" ref={register({ required: true })} placeholder="Country" />
            {errors.country && <span className="error">Country is required</span>}

            <input name="zipcode" ref={register({ required: true })} placeholder="Zip Code" />
            {errors.zipcode && <span className="error">Zipcode is required</span>}

            <input type="submit" />
          </form>
        </div>
        <div style={{ marginTop: '200px', display: shipInfo ? 'block' : 'none' }} className="col-md-6">
          <h3>Payment Information</h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm handlePlaceOrder={handlePlaceOrder}></CheckoutForm>
          </Elements>
          <br />
          {
            orderId && <div>
              <h3>Thank you for shopping with us</h3>
              <p>Your Order id is: {orderId}</p>
            </div>

          }
        </div>
      </div>
    </div>
  )
};

export default Shipment;