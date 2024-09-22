'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import SignUpModal from './signup/signup'; // Assuming SignUpModal exists
import LoginModal from './login/login'; // Assuming LoginModal exists

const Header: React.FC = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [signUpModalOpened, setSignUpModalOpened] = useState(false);
    const [loginModalOpened, setLoginModalOpened] = useState(false); // State to manage login modal visibility

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
            const res = await axios.get(`http://localhost:3001/event`, {
                params: {
                    search: searchQuery,
                },
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error('Error fetching suggestions:', err);
        }
    };

    return (
        <header className="flex justify-between items-center p-5 bg-gray-100">
            {/* Logo */}
            <Link href={`/`} passHref>
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
                        {suggestions.map((suggestion) => (
                            <Link key={suggestion.id} href={`/event/${suggestion.id}`} passHref>
                                <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                                    <img
                                        src={suggestion.thumbnail}
                                        alt={suggestion.name}
                                        className="w-20 h-12 rounded-lg mr-4"
                                    />
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

            {/* Sign up and Log in Buttons */}
            <div className="flex space-x-4">
                {/* Sign up button triggers modal */}
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg" onClick={() => setSignUpModalOpened(true)}>
                    Sign up
                </button>

                {/* Log in button opens the login modal */}
                <button
                    className="bg-white text-green-500 border border-green-500 py-2 px-4 rounded-lg"
                    onClick={() => setLoginModalOpened(true)}
                >
                    Log in
                </button>
            </div>

            {/* Sign Up Modal */}
            <SignUpModal isOpen={signUpModalOpened} onClose={() => setSignUpModalOpened(false)} />

            {/* Login Modal */}
            <LoginModal
                isOpen={loginModalOpened}
                onClose={() => setLoginModalOpened(false)}
                onOpenSignUp={() => {
                    setLoginModalOpened(false); // Close login modal
                    setSignUpModalOpened(true); // Open sign-up modal
                }}
            />
        </header>
    );
};

export default Header;
