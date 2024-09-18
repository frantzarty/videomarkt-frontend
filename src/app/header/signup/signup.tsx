'use client';
import React, {useEffect, useState} from 'react';
import {FaAt, FaEye, FaEyeSlash, FaLock, FaTimes} from 'react-icons/fa'; // Importing the icons
import {useForm} from 'react-hook-form';
import axios from 'axios';
const apiUrl = process.env.API_URL

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({isOpen, onClose}) => {
    // States to manage password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // State to handle fade-in and fade-out transitions

    // React Hook Form
    const {register, handleSubmit, formState: {errors}, watch} = useForm<FormData>();
    const password = watch('password');

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50); // Add a slight delay for the fade effect to work
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post(`http://localhost:3001/user`, data);
            console.log('Registration Successful', response.data);
            onClose(); // Close modal on success
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative transition-transform duration-300 transform scale-100">
                {/* Close icon in the top-right */}
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300); // Allow the fade-out transition before closing the modal
                    }}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 focus:outline-none"
                >
                    <FaTimes size={18}/>
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
                                {...register('firstName', {required: 'First name is required'})}
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
                                {...register('lastName', {required: 'Last name is required'})}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    {/* Email Field with @ Icon */}
                    <div className="relative">
                        <label className="block text-sm font-bold mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaAt className="absolute left-3 top-[1rem] text-gray-400"/>
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
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
                    </div>

                    {/* Password Field with Lock Icon */}
                    <div className="relative">
                        <label className="block text-sm font-bold mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-[1rem] text-gray-400"/>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg pr-10"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {value: 6, message: 'Password must be at least 6 characters'}
                                })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password Field with Lock Icon */}
                    <div className="relative">
                        <label className="block text-sm font-bold mb-2">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-[1rem] text-gray-400"/>
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                placeholder="Confirm password"
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg pr-10"
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
                                {confirmPasswordVisible ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                        {errors.confirmPassword &&
                            <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                type="checkbox"
                                className="h-4 w-4 text-green-600 border-gray-300 rounded"
                                {...register('terms', {required: 'You must agree to the terms'})}
                            />
                        </div>
                        <div className="ml-2 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">
                                I agree to sell my soul and privacy to this corporation <span
                                className="text-red-500">*</span>
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
    );
};

export default SignUpModal;



