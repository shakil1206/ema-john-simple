import React from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Poduct/Product';
import { useState } from 'react';
import { useEffect } from 'react';

const ProductDetails = () => {
    const {productKey} = useParams();
    const [product, setProduct] = useState(null);

    useEffect(()=>{
        fetch(`https://boiling-tor-50537.herokuapp.com/product/${productKey}`)
        .then(res=>res.json())
        .then(data=>{
            setProduct(data);
        })

    },[productKey])

    //const product = fakeData.find(pd => pd.key === productKey);
    //console.log(product);
    return (
        <div>
            <h1>Your Product Details</h1>
            {
               product && <Product showAddToCart={false} product={product}></Product>
            }
        </div>
    );
};

export default ProductDetails;          