'use client'
import React, {useState} from 'react';
import Link from "next/link";


interface EventProps {
    eventList: any;
}

// Function to convert date to 'DD MMM YYYY' format
const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: 'short', year: 'numeric'};
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options); // Converts 'Sep' to 'Sept' .replace('Sep', 'Sept')
};


const SeasonEvent: React.FC<EventProps> = ({eventList}) => {
    const [events] = useState<any[]>(eventList);


    return (
        <div>
            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="flex items-center border-b-[1.5px] border-gray-200 py-4">
                        {/* Thumbnail */}
                        <div className="w-28 h-16">
                            <img src={event.thumbnail} alt={event.title}
                                 className="object-cover w-full h-full rounded"/>
                        </div>


                        {/* Title & Date */}
                        <div className="ml-4 flex-grow">
                            <p className="text-md font-semibold">{event.name}</p>
                            <p className="text-sm text-gray-500">{formatDate(event.createdAt)}</p>
                        </div>

                        {/* Price */}
                        <div className="ml-4 mr-60">
                            <p className="text-md font-semibold">{event.medias.length} videos</p>
                        </div>

                        {/* Price */}
                        <div className="ml-4 mr-20">
                            <p className="text-md font-semibold">${event.price}</p>
                        </div>


                        {/* Buy Button */}
                        <div className="ml-4">
                            <Link href={`/event/${event.id}`} passHref>
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                    View Event
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default SeasonEvent;
