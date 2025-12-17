import React from 'react';
import GlassCard from '../GlassCard';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onQuickSearch: (city: string) => void;
}

const popularCities = [
  { name: 'New York', country: 'US', icon: '🗽' },
  { name: 'London', country: 'UK', icon: '🇬🇧' },
  { name: 'Tokyo', country: 'JP', icon: '🗼' },
  { name: 'Paris', country: 'FR', icon: '🗼' },
  { name: 'Sydney', country: 'AU', icon: '🦘' },
  { name: 'Dubai', country: 'AE', icon: '🏙️' },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickSearch }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-screen__hero">
        <div className="welcome-screen__icon-container">
          <span className="welcome-screen__main-icon">🌤️</span>
          <div className="welcome-screen__icon-glow" />
        </div>
        
        <h1 className="welcome-screen__title">Weather</h1>
        <p className="welcome-screen__subtitle">
          Beautiful forecasts, anywhere in the world
        </p>
      </div>

      <div className="welcome-screen__features">
        <GlassCard className="welcome-screen__feature">
          <span className="welcome-screen__feature-icon">📍</span>
          <h3 className="welcome-screen__feature-title">Search Any City</h3>
          <p className="welcome-screen__feature-desc">
            Find weather for any location worldwide with instant search
          </p>
        </GlassCard>

        <GlassCard className="welcome-screen__feature">
          <span className="welcome-screen__feature-icon">📊</span>
          <h3 className="welcome-screen__feature-title">Detailed Forecasts</h3>
          <p className="welcome-screen__feature-desc">
            Hourly and 10-day forecasts with precipitation, wind & more
          </p>
        </GlassCard>

        <GlassCard className="welcome-screen__feature">
          <span className="welcome-screen__feature-icon">✨</span>
          <h3 className="welcome-screen__feature-title">Beautiful Design</h3>
          <p className="welcome-screen__feature-desc">
            Dynamic backgrounds that match current weather conditions
          </p>
        </GlassCard>
      </div>

      <div className="welcome-screen__quick-search">
        <h2 className="welcome-screen__section-title">Popular Cities</h2>
        <div className="welcome-screen__cities">
          {popularCities.map((city) => (
            <GlassCard
              key={city.name}
              variant="compact"
              className="welcome-screen__city"
              hoverable
              onClick={() => onQuickSearch(city.name)}
            >
              <span className="welcome-screen__city-icon">{city.icon}</span>
              <div className="welcome-screen__city-info">
                <span className="welcome-screen__city-name">{city.name}</span>
                <span className="welcome-screen__city-country">{city.country}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
