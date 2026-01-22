/**
 * Map Animations Component
 * =========================
 * Handles delivery, money, and regional emoji animations
 */

const MapAnimations = {
    // Show delivery animation (truck or package)
    showDelivery(cityName) {
        const mapContainer = document.getElementById('brazil-map-container');
        if (!mapContainer || state.currentView !== 'globe') return;
        
        const cityPos = CITY_POSITIONS[cityName];
        if (!cityPos) return;
        
        const containerRect = mapContainer.getBoundingClientRect();
        const x = (cityPos.x / 100) * containerRect.width;
        const y = (cityPos.y / 100) * containerRect.height;
        
        const delivery = document.createElement('div');
        delivery.className = 'delivery-animation';
        
        const isTruck = Math.random() > 0.4;
        delivery.innerHTML = isTruck ? '🚚' : '📦';
        delivery.classList.add(isTruck ? 'delivery-truck' : 'delivery-package');
        
        delivery.style.left = `${x}px`;
        delivery.style.top = `${y}px`;
        
        mapContainer.appendChild(delivery);
        
        setTimeout(() => {
            if (delivery.parentNode) {
                delivery.parentNode.removeChild(delivery);
            }
        }, isTruck ? 2500 : 2000);
    },
    
    // Show regional emoji animation
    showRegionalEmoji(cityName, stateCode) {
        const mapContainer = document.getElementById('brazil-map-container');
        if (!mapContainer || state.currentView !== 'globe') return;
        
        const cityPos = CITY_POSITIONS[cityName];
        if (!cityPos) return;
        
        const stateIcon = CONFIG.stateIcons[stateCode];
        if (!stateIcon) return;
        
        const elements = [stateIcon.food, stateIcon.drink, stateIcon.icon].filter(Boolean);
        if (elements.length === 0) return;
        
        const emoji = elements[Math.floor(Math.random() * elements.length)];
        
        const containerRect = mapContainer.getBoundingClientRect();
        const x = (cityPos.x / 100) * containerRect.width;
        const y = (cityPos.y / 100) * containerRect.height;
        
        const regional = document.createElement('div');
        regional.className = 'regional-emoji-animation';
        regional.innerHTML = emoji;
        regional.style.left = `${x}px`;
        regional.style.top = `${y}px`;
        
        mapContainer.appendChild(regional);
        
        setTimeout(() => {
            if (regional.parentNode) {
                regional.parentNode.removeChild(regional);
            }
        }, 2000);
    },
    
    // Show money flying animation
    showMoney(cityName, value) {
        const mapContainer = document.getElementById('brazil-map-container');
        if (!mapContainer || state.currentView !== 'globe') return;
        
        const cityPos = CITY_POSITIONS[cityName];
        if (!cityPos) return;
        
        const containerRect = mapContainer.getBoundingClientRect();
        const x = (cityPos.x / 100) * containerRect.width;
        const y = (cityPos.y / 100) * containerRect.height;
        
        // Determine size based on value
        let sizeClass = 'money-small';
        let emoji = '💰';
        
        if (value >= 1000) {
            sizeClass = 'money-large';
            emoji = '💵';
        } else if (value >= 300) {
            sizeClass = 'money-medium';
            emoji = '💵';
        } else if (value < 100) {
            emoji = '🪙';
        }
        
        // Create main money element
        const money = document.createElement('div');
        money.className = `money-animation ${sizeClass}`;
        money.innerHTML = emoji;
        money.style.left = `${x}px`;
        money.style.top = `${y}px`;
        
        mapContainer.appendChild(money);
        
        // Create burst effect for large values
        if (value >= 500) {
            this.createMoneyBurst(mapContainer, x, y);
        }
        
        setTimeout(() => {
            if (money.parentNode) {
                money.parentNode.removeChild(money);
            }
        }, sizeClass === 'money-large' ? 1800 : sizeClass === 'money-medium' ? 1500 : 1200);
    },
    
    // Create burst of money particles
    createMoneyBurst(container, x, y) {
        const particles = ['💵', '🪙', '✨'];
        const count = 3;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'money-animation money-particle';
            particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const angle = (i / count) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance - 40}px`);
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
};

// Global functions for compatibility
function showDeliveryAnimation(cityName) {
    MapAnimations.showDelivery(cityName);
}

function showRegionalEmoji(cityName, stateCode) {
    MapAnimations.showRegionalEmoji(cityName, stateCode);
}

function showMoneyAnimation(cityName, value) {
    MapAnimations.showMoney(cityName, value);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapAnimations;
}
