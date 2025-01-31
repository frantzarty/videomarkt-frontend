'use client';
import './event.css';
import Header from "@/app/header/header";
import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import EventMedia from "@/app/event/event-media/event-media";
import {FaMapMarkerAlt} from "react-icons/fa";

const Event: React.FC = () => {
    const {id} = useParams();
    const [eventData, setEventData] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/event/${id}`)
                .then((res) => res.json())
                .then((data) => setEventData(data))
                .catch((err) => console.error(err));
        }
    }, [id]);

    // Function to convert date to 'DD MMM YYYY' format
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: 'short', year: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options); // Converts 'Sep' to 'Sept' .replace('Sep', 'Sept')
    };

    if (!eventData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="main-container">
            <Header/>
            {/* Banner */}
            <div className="relative">
                <img
                    src={eventData.banner}
                    alt="Event Banner"
                    className="w-full h-60 object-cover"
                />
                {/* Profile Thumbnail Centered */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={eventData.thumbnail}
                        alt="Profile Thumbnail"
                        className="rounded-full border-4 border-white w-40 h-40"
                    />
                </div>
            </div>

            {/* Season Name on the Left, Place on the Right */}
            <div className="flex items-center justify-between px-4 py-4">
                {/* Season Name Aligned to Left */}
                <div className="flex-1">
                    <span className="text-4xl text-gray-500 font-bold">{eventData.season.name}</span>
                </div>

                {/* Place and Location Icon */}
                <div className="flex items-center justify-end">
                    <FaMapMarkerAlt className="location-icon mr-2"/>
                    <span className="text-md font-normal">{eventData.place}</span>
                </div>
            </div>

            <div className="px-4 py-16">
                {/* Event Details */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">{eventData.name}</h1>
                        <p className="text-gray-500">{formatDate(eventData.createdAt)}</p> {/* Formatted Date */}
                        <p className="text-sm mt-2">{eventData.description}</p>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                        <button
                            className="text-xl font-semibold text-black-600 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                            $ {eventData.price}
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-4 border-b-2 border-gray-300 pb-2">
                    <button
                        className="text-gray-600 font-semibold hover:text-black border-b-2 border-transparent hover:border-black transition duration-300">
                        Videos
                    </button>
                </div>

                {/* Videos Section */}
                <div className="mt-8">
                    <EventMedia mediaList={eventData.medias}/>
                </div>
            </div>
        </div>
    );
};

export default Event;
