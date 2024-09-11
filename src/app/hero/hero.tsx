'use client';
import './hero.css';

export default function Hero() {

    function scrollLeft(): void {
        const slider = document.getElementById('tagSlider');
        if (slider) {
            slider.scrollBy({ left: -200, behavior: 'smooth' });
        }
    }

    function scrollRight(): void {
        const slider = document.getElementById('tagSlider');
        if (slider) {
            slider.scrollBy({ left: 200, behavior: 'smooth' });
        }
    }

    return (
        <section className="hero">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Get the best sales <br /><span className="highlight">video services</span></h1>
                    <p>Find the best sales video services you need to help you successfully meet your project planning
                        goals and deadline</p>
                    <a href="#" className="cta-button">Join now</a>
                </div>
            </div>
            {/*<br />*/}
            {/*<div>
                <div className="tag-slider-container">
                    <button className="slider-btn left-btn" onClick={scrollLeft}>&#8249;</button>
                    <div className="tag-slider" id="tagSlider">
                        <div className="tag active">Aerial Video</div>
                        <div className="tag">Football</div>
                        <div className="tag">Cricket</div>
                        <div className="tag">Cloud Skies</div>
                        <div className="tag">Day Videos</div>
                        <div className="tag">Volleyball</div>
                        <div className="tag">Drone</div>
                        <div className="tag">Basketball</div>
                        <div className="tag">Mountain Forest</div>
                        <div className="tag">Travel</div>
                        <div className="tag">Highway</div>
                        <div className="tag">Evergreen</div>
                        <div className="tag">Day Videos</div>
                    </div>
                    <button className="slider-btn right-btn" onClick={scrollRight}>&#8250;</button>
                </div>
            </div>*/}
        </section>
    );
}



