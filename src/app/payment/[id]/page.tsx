'use client';
import './payment.css';
import React, { useEffect, useState } from 'react';
import Header from '@/app/header/header';
import { useParams, useRouter } from 'next/navigation';

const Checkout: React.FC = () => {
    const { id } = useParams();
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

    const formatCardNumber = (value: string) => {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');

        // Add spaces after every 4 digits
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();

        return formatted;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Check if input is cardNumber and format it
        if (name === 'cardNumber') {
            const formattedCardNumber = formatCardNumber(value);
            setFormData((prevData) => ({
                ...prevData,
                [name]: formattedCardNumber,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Clean up the card number (remove spaces)
        const cleanedCardNumber = formData.cardNumber.replace(/\s+/g, '');

        try {
            const response = await fetch('http://localhost:3001/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: media.price,
                    cardHolderName: formData.fullName,
                    cardNumber: cleanedCardNumber, // Use cleaned card number
                    expiration: formData.expiration,
                    cvc: formData.cvc,
                    user: { id: 1 },
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
        <div className="max-w-[1500px] mx-auto">
            <Header />
            <div className="flex justify-between max-w-[1500px] mx-auto mt-10 bg-white rounded-lg shadow-lg gap-5">

                {/* Expanded Order Summary */}
                <div className="flex-[2] p-6">
                    <div className="flex justify-start items-start mb-6">
                        <img src={media.thumbnail} alt="Product 1" className="w-32 h-20 object-cover rounded-md" />
                        <div className="ml-4">
                            <p className="text-left">{media.title}</p>
                        </div>
                        <div className="ml-auto">${media.price}</div>
                    </div>
                    <div className="flex justify-between mb-3">
                        <p>Subtotal</p>
                        <p>${media.price}</p>
                    </div>

                    <div className="flex justify-between font-bold mt-10">
                        <h3>Total Due</h3>
                        <h3>${media.price}</h3>
                    </div>
                </div>

                {/* Narrower Payment Details */}
                <div className="flex-[1] p-6 bg-gray-100 rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label htmlFor="fullName" className="block font-bold mb-2">Payment Information</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Full name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />

                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 2345 1234"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            maxLength={19} // To limit it to the formatted length
                            required
                        />

                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="expiration"
                                placeholder="MM / YY"
                                value={formData.expiration}
                                onChange={handleInputChange}
                                className="w-1/2 p-3 border border-gray-300 rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                name="cvc"
                                placeholder="CVC"
                                value={formData.cvc}
                                onChange={handleInputChange}
                                className="w-1/2 p-3 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                            Pay ${media.price}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
