'use client'

import {useEffect, useState} from 'react';
import './media-details.css';
import {useParams} from "next/navigation";
import ServiceGrid from "@/app/service-grid/service-grid";
import Header from "@/app/header/header";
import Link from "next/link";


const MediaDetails: React.FC = () => {
    const {id} = useParams();
    const [media, setMedia] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3001/media/${id}`)
                .then((res) => res.json())
                .then((data) => setMedia(data))
                .catch((err) => console.error(err));
        }
    }, [id]);

    console.log(media);
    if (!media) {
        return <p>Loading...</p>;
    }

    return (
        <div className="media-details-container">
            <div>
                <Header/>
            </div>
            <div className="media-details-content">
                <div className="media-image">
                    <img src={media.thumbnail} alt={media.title}/>
                </div>

                <div className="media-info">
                    <h1>{media.title}</h1>
                    <p>{media.description}</p>
                    <div className="media-attributes">
                        <p><strong>Event name:</strong> {media.event.name}</p>
                        <p><strong>Author:</strong> {media.event.users[0].firstName}</p>
                        <p><strong>Price:</strong> ${media.price}</p>
                        <p><strong>Resolution:</strong> {media.resolution}</p>
                        <p><strong>Length:</strong> {media.length}</p>
                        <p><strong>File Size:</strong> {media.fileSize}</p>
                        <Link href={`/payment/${media.id}`} passHref>
                            <button className="buy-button">Buy for ${media.price}</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="related-media">
                <ServiceGrid/>
            </div>
        </div>
    );
};

export default MediaDetails;



