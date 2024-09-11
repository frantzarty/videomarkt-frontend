'use client';
import './service-grid.css';
import ServiceCard from '@/app/service-card/service-card';
import React, { useState, useEffect } from 'react';

const ServiceGrid: React.FC = () => {
    const [cardData, setCardData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3001/media');
                const data = await res.json();
                setCardData(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="service-grid-container">
            <div className="header-row">
                <h2>Feature Videos</h2>
                <div className="search-container">
                    <input type="text" placeholder="Search video" className="search-input"/>
                    <button className="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white"
                             stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="service-grid">
                {cardData.map(service => (
                    <ServiceCard key={service.id} service={service}/>
                ))}
            </div>
        </section>
    );
}

export default ServiceGrid;



