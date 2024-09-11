'use client'
import React, {useState} from 'react';
import Link from "next/link";


interface MediaProps {
    mediaList: any;
}

// Function to convert date to 'DD MMM YYYY' format
const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {day: '2-digit', month: 'short', year: 'numeric'};
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options); // Converts 'Sep' to 'Sept' .replace('Sep', 'Sept')
};


const EventMedia: React.FC<MediaProps> = ({mediaList}) => {
    const [videos] = useState<any[]>(mediaList);


    return (
        <div>
            {/*<div className="mb-4">
                <input
                    type="text"
                    placeholder="Search videos"
                    className="p-2 border rounded w-full mb-4"
                />
            </div>*/}


            <div className="space-y-4">
                {videos.map((video) => (
                    <div key={video.id} className="flex items-center border-b-[1.5px] border-gray-200 py-4">
                        {/* Thumbnail */}
                        <div className="w-28 h-16">
                            <img src={video.thumbnail} alt={video.title}
                                 className="object-cover w-full h-full rounded"/>
                        </div>


                        {/* Title & Date */}
                        <div className="ml-4 flex-grow">
                            <p className="text-md font-semibold">{video.title}</p>
                            <p className="text-sm text-gray-500">{formatDate(video.createdAt)}</p>
                        </div>


                        {/* Price */}
                        <div className="ml-4 mr-20">
                            <p className="text-md font-semibold">${video.price}</p>
                        </div>


                        {/* Buy Button */}
                        <div className="ml-4">
                            <Link href={`/payment/${video.id}`} passHref>
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                    Buy
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default EventMedia;
