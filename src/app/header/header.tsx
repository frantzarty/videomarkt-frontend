'use client'
import React, {useState} from 'react';
import './header.css';
import Link from "next/link";
import {FaMapMarkerAlt} from 'react-icons/fa';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';


interface Suggestion {
    id: number;
    thumbnail: string;
    name: string;
    place: string;
    description: string;
    price: number;
    createdAt: Date;
}


const Header: React.FC = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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
            fetchSuggestions(value);  // Fetch suggestions based on the query
        } else {
            setSuggestions([]);  // Clear suggestions if input is empty
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
                                    <img src={suggestion.thumbnail} alt={suggestion.name}/>
                                    <div className="suggestion-details">
                                        <span>{suggestion.name}</span>
                                        <span className="place">
                                           <FaMapMarkerAlt className="location-icon"/> {/* React icon */}
                                            {suggestion.place}
                                       </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>


                <Modal opened={opened} onClose={close} title="Authentication" centered>
                    {/* Modal content */}
                </Modal>


            <div className="auth-buttons">
                <button className="sign-up" onClick={open}>Sign up</button>
                <button className="log-in">Log in</button>
            </div>
        </header>
    );
};


export default Header;





