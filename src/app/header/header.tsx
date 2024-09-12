'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing the eye icons
import { useForm } from 'react-hook-form';
import axios from 'axios';

// Suggestion interface
interface Suggestion {
    id: number;
    thumbnail: string;
    name: string;
    place: string;
    description: string;
    price: number;
    createdAt: Date;
}

// Register form interface
interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

const Header: React.FC = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [signUpModalOpened, setSignUpModalOpened] = useState(false); // Modal state

    // States to manage password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const fetchSuggestions = async (searchQuery: string) => {
        try {
            const res = await fetch(`http://localhost:3001/event?search=${searchQuery}`);
            const data: Suggestion[] = await res.json();
            setSuggestions(data);
        } catch (err) {
            console.error('Error fetching suggestions:', err);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    // React Hook Form for handling sign-up form
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
    const password = watch('password');

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post('/api/register', data);
            console.log('Registration Successful', response.data);
            setSignUpModalOpened(false); // Close modal on success
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    return (
        <header className="flex justify-between items-center p-5 bg-gray-100">
            <Link href={`/`} passHref>
                <div className="font-bold text-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
                        <text x="10" y="45" fontFamily="Arial, Helvetica, sans-serif" fontSize="40" fill="green">
                            VidMarkt
                        </text>
                    </svg>
                </div>
            </Link>

            <div className="relative w-full max-w-2xl">
                <input
                    type="text"
                    placeholder="Search event"
                    value={query}
                    onChange={handleSearchChange}
                    className="w-full p-3 border border-green-500 rounded-lg text-base"
                />
                {suggestions.length > 0 && (
                    <div className="absolute w-full mt-1 bg-white shadow-lg border border-gray-300 rounded-lg max-h-60 overflow-y-auto z-10">
                        {suggestions.map(suggestion => (
                            <Link key={suggestion.id} href={`/event/${suggestion.id}`} passHref>
                                <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                                    <img src={suggestion.thumbnail} alt={suggestion.name} className="w-20 h-12 rounded-lg mr-4" />
                                    <div className="flex-1 flex justify-between items-center">
                                        <span>{suggestion.name}</span>
                                        <span className="flex items-center text-sm text-gray-500">
                                           <FaMapMarkerAlt className="text-red-600 mr-1" />
                                            {suggestion.place}
                                       </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex space-x-4">
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg" onClick={() => setSignUpModalOpened(true)}>
                    Sign up
                </button>
                <button className="bg-white text-green-500 border border-green-500 py-2 px-4 rounded-lg">
                    Log in
                </button>
            </div>

            {/* Registration Modal */}
            {signUpModalOpened && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
                        {/* Close icon in the top-right */}
                        <button
                            onClick={() => setSignUpModalOpened(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 focus:outline-none"
                        >
                            <FaTimes size={20} />
                        </button>

                        {/* Sign Up Header */}
                        <h2 className="text-xl font-bold mb-6 text-left">Sign Up</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your first name"
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        {...register('firstName', { required: 'First name is required' })}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-sm font-bold mb-2">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your last name"
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        {...register('lastName', { required: 'Last name is required' })}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Invalid email format',
                                        },
                                    })}
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-bold mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-bold mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={confirmPasswordVisible ? 'text' : 'password'}
                                        placeholder="Confirm password"
                                        className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: (value) => value === password || 'Passwords do not match',
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    >
                                        {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded"
                                        {...register('terms', { required: 'You must agree to the terms' })}
                                    />
                                </div>
                                <div className="ml-2 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-700">
                                        I agree to sell my soul and privacy to this corporation <span className="text-red-500">*</span>
                                    </label>
                                    {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
                                </div>
                            </div>

                            <button type="submit" className="bg-green-600 text-white py-3 px-6 rounded-lg w-full">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;



