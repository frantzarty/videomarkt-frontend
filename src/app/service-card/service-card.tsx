'use client';
import './service-card.css';
import { useState } from 'react'; // Import useState
import { Avatar, Badge, Button, Card, Image, Text } from '@mantine/core';
import { IconEye, IconStar } from '@tabler/icons-react';
import Link from "next/link";
import LoginModal from '../header/login/login'; // Import the LoginModal component

interface ServiceCardProps {
    service: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    const [loginModalOpened, setLoginModalOpened] = useState(false); // Manage login modal state

    const handleBuyClick = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // User is logged in, redirect to payment
            window.location.href = `/payment/${service.id}`;
        } else {
            // User is not logged in, show the login modal
            setLoginModalOpened(true);
        }
    };

    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder className="service-card">
                <Link href={`/media-details/${service.id}`} passHref>
                    <Card.Section>
                        <Image
                            src={service.thumbnail}
                            height={160}
                            alt={service.title}
                        />
                    </Card.Section>
                </Link>

                <div className="service-details">
                    <div className="service-header">
                        <div className="service-header-left">
                            <Avatar className="author-section img" src={service.thumbnail}
                                    alt={service.event.name}
                                    radius="xl" size="sm"/>
                            <Text className="author-name">{service.event.user.firstName}</Text>
                        </div>
                        <div className="service-header-right">
                            <div className="views-section">
                                <IconEye size={16}/>
                                <Text className="views">25k</Text>
                            </div>
                            {service.isNew && <Badge color="green" size="sm" className="new-badge">New</Badge>}
                        </div>
                    </div>

                    <Text className="title" fw={500} mt="xs" lineClamp={1}>
                        {service.title}
                    </Text>

                    <div className="rating-price-section">
                        <div className="rating-section">
                            <IconStar size={16} color="orange"/>
                            <Text className="rating">4 (30)</Text>
                        </div>
                        <Text className="price-section">
                            Price ${service.price}
                        </Text>
                        {/* Instead of Link, handle the button click manually */}
                        <Button className="buy-button" onClick={handleBuyClick}>
                            Buy
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Login Modal */}
            <LoginModal
                isOpen={loginModalOpened}
                onClose={() => setLoginModalOpened(false)}
                onLoginSuccess={() => {
                    // On successful login, close the modal and redirect to the payment page
                    setLoginModalOpened(false);
                    window.location.href = `/payment/${service.id}`;
                }}
            />
        </>
    );
};

export default ServiceCard;
