'use client';
import React, { useState } from 'react';
import './header.css';
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
        <header className="header">
            <Link href={`/`} passHref>
                <div className="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
                        <text x="10" y="45" fontFamily="Arial, Helvetica, sans-serif" fontSize="40" fill="green">
                            VidMarkt
                        </text>
                    </svg>
                </div>
            </Link>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search event"
                    value={query}
                    onChange={handleSearchChange}
                />
                {suggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                        {suggestions.map(suggestion => (
                            <Link key={suggestion.id} href={`/event/${suggestion.id}`} passHref>
                                <div className="suggestion-item">
                                    <img src={suggestion.thumbnail} alt={suggestion.name} />
                                    <div className="suggestion-details">
                                        <span>{suggestion.name}</span>
                                        <span className="place">
                      <FaMapMarkerAlt className="location-icon" /> {/* React icon */}
                                            {suggestion.place}
                    </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="auth-buttons">
                <button className="sign-up" onClick={() => setSignUpModalOpened(true)}>
                    Sign up
                </button>
                <button className="log-in">Log in</button>
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

                        {/* Align Authentication text to the top-left corner */}
                        <h2 className="text-xl font-bold mb-6 text-left">Authentication</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your first name"
                                        className="input w-full p-2 border border-gray-300 rounded"
                                        {...register('firstName', { required: 'First name is required' })}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Your last name"
                                        className="input w-full p-2 border border-gray-300 rounded"
                                        {...register('lastName', { required: 'Last name is required' })}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="input w-full p-2 border border-gray-300 rounded"
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
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="input w-full p-2 border border-gray-300 rounded pr-10"  // Ensure right padding for the icon
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
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={confirmPasswordVisible ? 'text' : 'password'}
                                        placeholder="Confirm password"
                                        className="input w-full p-2 border border-gray-300 rounded pr-10"  // Ensure right padding for the icon
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

                            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded w-full">
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



