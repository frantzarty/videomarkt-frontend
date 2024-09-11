'use client';

import React, {useEffect, useState} from 'react';
import './payment.css';
import Header from "@/app/header/header";
import {useParams, useRouter} from "next/navigation";

const Checkout: React.FC = () => {
    const {id} = useParams();
    const router = useRouter();
    const [media, setMedia] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        cardNumber: '',
        expiration: '',
        cvc: ''
    });

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/media/${id}`)
                .then((res) => res.json())
                .then((data) => setMedia(data))
                .catch((err) => console.error(err));
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Make POST request to backend API with form data
        try {
            const response = await fetch('http://localhost:3001/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: media.price,
                    cardHolderName: formData.fullName,
                    cardNumber: formData.cardNumber,
                    expiration: formData.expiration,
                    cvc: formData.cvc,
                    user: {id: 1},
                    medias: [
                        {
                            id: media.id
                        }
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to process payment');
            }

            const result = await response.json();
            console.log('Payment successful:', result);
            if (result.isSuccess) {
                router.push('/profile');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    if (!media) {
        return <p>Loading...</p>;
    }

    return (
        <div className="payment-main-container">
            <Header />
            <div className="checkout-container">
                <div className="order-summary">
                    {/*<h3 className="item-heading">Media Items</h3>*/}

                    <div className="item-list">
                        <div className="item">
                            <img src={media.thumbnail} alt="Product 1" className="product-image"/>
                            <div>
                                <p>{media.title}</p>
                            </div>
                            <div className="price">${media.price}</div>
                        </div>
                    </div>

                    <div className="summary-details">
                        <div>
                            <p>Subtotal</p>
                            <p>${media.price}</p>
                        </div>
                        <div className="total">
                            <h3>Total Due</h3>
                            <h3>${media.price}</h3>
                        </div>
                    </div>
                </div>

                <div className="payment-details">
                    <form onSubmit={handleSubmit}>
                        {/*<h3 className="item-heading">Payment Details</h3>*/}

                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Full name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />

                        <label htmlFor="cardNumber">Card Information</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 2345 1234"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="payment-inputs">
                            <input
                                type="text"
                                name="expiration"
                                placeholder="MM / YY"
                                value={formData.expiration}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="cvc"
                                placeholder="CVC"
                                value={formData.cvc}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-button">
                            Pay ${media.price}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;



