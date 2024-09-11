'use client';
import './event.css';
import Header from "@/app/header/header";
import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import EventMedia from "@/app/event/event-media/event-media";


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
                {/* Profile Thumbnail */}
                <div className="absolute bottom-0 left-8 -mb-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={eventData.thumbnail}
                        alt="Profile Thumbnail"
                        className="rounded-full border-4 border-white w-40 h-40"
                    />
                </div>
            </div>


            <div className="px-4 py-16">
                {/* Event Details */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">{eventData.name}</h1>
                        <p className="text-gray-500">{formatDate(eventData.createdAt)}</p> {/* Formatted Date */}
                        <p className="text-sm mt-2">{eventData.description}</p>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                        <p className="text-xl pr-4 font-semibold text-black-600">${eventData.price}</p>
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
                    <EventMedia mediaList={eventData.media}/>
                </div>
            </div>
        </div>
    );
};


export default Event;
