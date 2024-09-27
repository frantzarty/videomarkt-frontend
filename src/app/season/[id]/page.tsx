'use client';
import './event.css';
import Header from "@/app/header/header";
import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import EventMedia from "@/app/event/event-media/event-media";
import {FaMapMarkerAlt} from "react-icons/fa";
import SeasonEvent from "@/app/season/season-event/season-event";

const Season: React.FC = () => {
    const {id} = useParams();
    const [seasonData, setEventData] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/season/${id}`)
                .then((res) => res.json())
                .then((data) => setEventData(data))
                .catch((err) => console.error(err));
        }
    }, [id]);

    // Function to convert date to 'DD MMM YYYY' format
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: 'short', year: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    if (!seasonData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="main-container">
            <Header/>
            {/* Banner */}
            <div className="relative">
                <img
                    src={seasonData.banner}
                    alt="Event Banner"
                    className="w-full h-60 object-cover"
                />
                {/* Profile Thumbnail */}
                <div className="absolute bottom-0 left-8 -mb-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={seasonData.thumbnail}
                        alt="Profile Thumbnail"
                        className="rounded-full border-4 border-white w-40 h-40"
                    />
                </div>
            </div>

            {/* Place below banner */}
            <div className="flex items-center justify-end px-4 py-4">
                <FaMapMarkerAlt className="location-icon mr-2"/> {/* Location icon */}
                <span className="text-md font-normal">{seasonData.place}</span>
            </div>

            <div className="px-4 py-8">
                {/* Event Details */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">{seasonData.name}</h1>
                        <p className="text-gray-500">{formatDate(seasonData.createdAt)}</p> {/* Formatted Date */}
                        <p className="text-sm mt-2">{seasonData.description}</p>
                    </div>
                    {/* Price Button */}
                    <div className="text-right">
                        <button
                            className="text-xl font-semibold text-black-600 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                            $ {seasonData.price}
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-4 border-b-2 border-gray-300 pb-2">
                    <button
                        className="text-gray-600 font-semibold hover:text-black border-b-2 border-transparent hover:border-black transition duration-300">
                        Events
                    </button>
                </div>

                {/* Videos Section */}
                <div className="mt-8">
                    <SeasonEvent eventList={seasonData.events}/>
                </div>
            </div>
        </div>
    );
};

export default Season;
