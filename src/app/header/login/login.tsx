// login.tsx

'use client';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaUserAlt, FaLock, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import FaEye and FaEyeSlash for toggling password visibility
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';  // Import Axios

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenSignUp: () => void;
    onLoginSuccess: () => void; // New prop to handle login success
}

interface IFormInput {
    username: string;
    password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onOpenSignUp, onLoginSuccess }) => {
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            // Call the login API
            const response = await axios.post('http://localhost:3001/auth/login', {
                username: data.username,
                password: data.password,
                grantType: 'password',
            });

            // Save user info to localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Trigger the login success handler from Header
            onLoginSuccess();

            // Hide the modal after successful login
            onClose();
        } catch (error) {
            // Handle error
            console.error('Error logging in', error);
        }
    };

    // If the modal is not open, do not render anything
    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-1000 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div
                className={`bg-white rounded-lg w-full max-w-4xl p-6 pt-10 relative transform transition-all duration-300 ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
            >
                {/* Close button */}
                <button
                    onClick={onClose} // Close the modal
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 focus:outline-none"
                >
                    <FaTimes size={18} />
                </button>

                {/* Login form inside the modal */}
                <div className="flex flex-col lg:flex-row bg-white rounded-lg overflow-hidden">
                    {/* Left Side */}
                    <div className="lg:w-1/2 p-8">
                        <h2 className="text-3xl font-bold mb-6 text-center">LOGIN</h2>
                        <p className="text-sm text-center mb-6">Login with your email and password</p>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Username */}
                            <div className="relative flex items-center">
                                <FaUserAlt className="absolute left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    {...register('username', { required: 'Username is required' })}
                                    className={`pl-10 pr-4 py-2 w-full border rounded-lg ${
                                        errors.username ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                            </div>
                            {errors.username && (
                                <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>
                            )}

                            {/* Password */}
                            <div className="relative flex items-center">
                                <FaLock className="absolute left-3 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'} // Toggle between text and password
                                    placeholder="Password"
                                    {...register('password', { required: 'Password is required' })}
                                    className={`pl-10 pr-4 py-2 w-full border rounded-lg ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                                {/* Eye Icon for Toggling Password Visibility */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                    className="absolute right-3 text-gray-400 focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                                Login Now
                            </button>
                        </form>

                        {/* Social Login */}
                        <div className="mt-6">
                            <div className="flex items-center my-6">
                                <div className="flex-grow mt-4 border-t border-gray-300"></div>
                                <span className="mx-4 mt-4 text-gray-500 font-semibold">Login with Others</span>
                                <div className="flex-grow mt-4 border-t border-gray-300"></div>
                            </div>
                            <div className="flex justify-center mt-3">
                                <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg">
                                    <FcGoogle className="mr-2 text-xl" />
                                    Login with Google
                                </button>
                            </div>

                            {/* Sign up label */}
                            <div className="text-center mt-16 text-gray-500">
                                Don’t have an account?{' '}
                                <a
                                    className="text-indigo-500 hover:underline cursor-pointer"
                                    onClick={() => {
                                        onClose(); // Close the login modal
                                        onOpenSignUp(); // Open the sign-up modal
                                    }}
                                >
                                    Sign up now!
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="lg:w-1/2 bg-white-500 text-white flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <img
                                src="/img_10.png"
                                alt="Illustration"
                                className="object-cover w-full h-full rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
