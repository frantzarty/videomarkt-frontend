'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaUserCircle, FaChevronDown, FaSignOutAlt, FaUser } from 'react-icons/fa';
import axios from 'axios';
import SignUpModal from './signup/signup';
import LoginModal from './login/login';

const Header: React.FC = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [signUpModalOpened, setSignUpModalOpened] = useState(false);
    const [loginModalOpened, setLoginModalOpened] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
    const [user, setUser] = useState<any | null>(null); // User data
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Manage dropdown state

    // Load user info from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []); // Empty dependency array means this only runs once when the component mounts

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        // Fetch suggestions based on the query
        if (value.length > 0) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const fetchSuggestions = async (searchQuery: string) => {
        try {
            const res = await axios.get('http://localhost:3001/event', {
                params: {
                    search: searchQuery,
                },
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error('Error fetching suggestions:', err);
        }
    };

    // Handle login success from the login modal
    const handleLoginSuccess = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Set user data from localStorage after login
            setIsLoggedIn(true); // Set login state to true
        }
        setLoginModalOpened(false); // Close login modal
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false); // Set login state to false
        setProfileDropdownOpen(false); // Close profile dropdown
        localStorage.removeItem('user'); // Clear localStorage
        setUser(null); // Clear user data
    };

    return (
        <header className="flex justify-between items-center p-5 bg-gray-200">
            {/* Logo */}
            <Link href="/" passHref>
                <div className="font-bold text-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
                        <text x="10" y="45" fontFamily="Arial, Helvetica, sans-serif" fontSize="40" fill="green">
                            VidMarkt
                        </text>
                    </svg>
                </div>
            </Link>

            {/* Search Bar */}
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
                        {suggestions.map((suggestion: any) => (
                            <Link key={suggestion['id']} href={`/event/${suggestion['id']}`} passHref>
                                <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                                    <img
                                        src={suggestion['thumbnail']}
                                        alt={suggestion['name']}
                                        className="w-20 h-12 rounded-lg mr-4"
                                    />
                                    <div className="flex-1 flex justify-between items-center">
                                        <span>{suggestion['name']}</span>
                                        <span className="flex items-center text-sm text-gray-500">
                                            <FaMapMarkerAlt className="text-red-600 mr-1" />
                                            {suggestion['place']}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Sign up and Log in Buttons or Profile Icon */}
            <div className="flex space-x-4">
                {!isLoggedIn ? (
                    <>
                        {/* Sign up button triggers modal */}
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg"
                            onClick={() => setSignUpModalOpened(true)}
                        >
                            Sign up
                        </button>

                        {/* Log in button opens the login modal */}
                        <button
                            className="bg-white text-green-500 border border-green-500 py-2 px-4 rounded-lg"
                            onClick={() => setLoginModalOpened(true)}
                        >
                            Log in
                        </button>
                    </>
                ) : (
                    <div className="relative">
                        {/* Profile icon and dropdown */}
                        <button
                            className="flex items-center space-x-2 bg-gray-100 py-2 px-4 rounded-full"
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        >
                            <FaUserCircle className="text-green-700 text-4xl" />
                            <FaChevronDown className="text-green-700" />
                        </button>

                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-20">
                                <div className="p-4 border-b">
                                    <div className="flex items-center">
                                        <FaUser className="text-xl text-gray-500 mr-4" />
                                        <div>
                                            <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-sm text-gray-500">{user?.roles}</p>
                                        </div>
                                    </div>
                                </div>
                                <ul className="p-2">
                                    <li className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer">
                                        <FaSignOutAlt className="text-xl text-gray-500 mr-4" />
                                        <button onClick={handleLogout} className="w-full text-left">
                                            Log out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sign Up Modal */}
            <SignUpModal isOpen={signUpModalOpened} onClose={() => setSignUpModalOpened(false)} />

            {/* Login Modal */}
            <LoginModal
                isOpen={loginModalOpened}
                onClose={() => setLoginModalOpened(false)}
                onLoginSuccess={handleLoginSuccess} // Pass success handler to login modal
                onOpenSignUp={() => {
                    setLoginModalOpened(false); // Close login modal
                    setSignUpModalOpened(true); // Open sign-up modal
                }}
            />
        </header>
    );
};

export default Header;
