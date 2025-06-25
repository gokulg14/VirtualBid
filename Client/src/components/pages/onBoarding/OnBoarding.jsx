
import React, { useState } from 'react';
import '../../styles/OnBoarding.css';

import img1 from '../../../assets/react.svg';


const slides = [
  {
    title: 'Welcome to VirtualBid',
    description: 'Bid smarter, win bigger. Join our live auctions with just a few clicks.',
    image: img1,
  },
  {
    title: 'Real-time Auctions',
    description: 'Compete in real-time auctions and grab the best deals instantly.',
    image: img1,
  },
  {
    title: 'Secure Transactions',
    description: 'Your payments and data are safe with us using bank-level encryption.',
    image: img1,
  },
];

function OnBoarding({ onFinish }) {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="onboarding-container">
      <img src={slides[index].image} alt="slide" className="onboarding-image" />
      <h2>{slides[index].title}</h2>
      <p>{slides[index].description}</p>
      <button onClick={nextSlide} className="onboarding-button">
        {index === slides.length - 1 ? 'Get Started' : 'Next'}
      </button>
      <div className="onboarding-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default OnBoarding;
