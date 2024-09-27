'use client'

import {useEffect, useState} from 'react';
import './media-details.css';
import {useParams} from "next/navigation";
import ServiceGrid from "@/app/service-grid/service-grid";
import Header from "@/app/header/header";
import LoginModal from "@/app/header/login/login";


const MediaDetails: React.FC = () => {
    const [loginModalOpened, setLoginModalOpened] = useState(false); // Manage login modal state
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

    if (!media) {
        return <p>Loading...</p>;
    }

    const handleBuyClick = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // User is logged in, redirect to payment
            window.location.href = `/payment/${media.id}`;
        } else {
            // User is not logged in, show the login modal
            setLoginModalOpened(true);
        }
    };

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
                        <p><strong>Author:</strong> {media.event.user.firstName}</p>
                        <p><strong>Price:</strong> ${media.price}</p>
                        <p><strong>Resolution:</strong> {media.resolution}</p>
                        <p><strong>Length:</strong> {media.length}</p>
                        <p><strong>File Size:</strong> {media.fileSize}</p>

                        <button className="buy-button" onClick={handleBuyClick}>Buy for ${media.price}</button>

                    </div>
                </div>
            </div>

            <div className="related-media">
                <ServiceGrid/>
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={loginModalOpened}
                onClose={() => setLoginModalOpened(false)}
                // onOpenSignUp={}
                onLoginSuccess={() => {
                    // On successful login, close the modal and redirect to the payment page
                    setLoginModalOpened(false);
                    window.location.href = `/payment/${media.id}`;
                }}
             />
        </div>
    );
};

export default MediaDetails;



