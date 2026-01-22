/**
 * Celebration Component
 * ======================
 * Handles first sale celebrations
 */

const CelebrationComponent = {
    // Show first sale celebration
    show(storeName, cityName, stateName, saleValue) {
        const celebration = document.getElementById('first-sale-celebration');
        document.getElementById('celebration-store').textContent = storeName;
        document.getElementById('celebration-location').textContent = `${cityName}, ${stateName}`;
        
        // Get state-specific icon
        const stateIcon = CONFIG.stateIcons[stateName] || {};
        const regionalIcon = stateIcon.icon || '🏙️';
        
        document.getElementById('celebration-regional-icon').textContent = regionalIcon;
        
        // Emotional subtitles that rotate
        const subtitles = [
            'Um sonho que acaba de virar realidade',
            'O primeiro passo de uma grande jornada',
            'Mais um empreendedor fazendo história',
            'O e-commerce brasileiro pulsa com força',
            'De ideia a realidade: a magia aconteceu'
        ];
        const randomSubtitle = subtitles[Math.floor(Math.random() * subtitles.length)];
        document.getElementById('celebration-subtitle').textContent = randomSubtitle;
        
        // Simulate days since store opened (1-14 days for first sale)
        const daysOpen = Math.floor(Math.random() * 14) + 1;
        const journeyText = daysOpen === 1 
            ? 'Abriu a loja hoje!' 
            : `Abriu a loja há ${daysOpen} dias`;
        document.getElementById('celebration-journey').querySelector('.journey-text').textContent = journeyText;
        
        // Sale value
        const value = saleValue || (Math.random() * 300 + 50);
        document.getElementById('celebration-value').querySelector('.value-amount').textContent = 
            'R$ ' + value.toFixed(2).replace('.', ',');
        
        celebration.classList.add('active');
        this.createConfetti();
        
        // Pulse the map faster during celebration
        const svg = document.querySelector('.brazil-map-svg');
        if (svg) {
            svg.classList.add('pulse-fast');
            setTimeout(() => svg.classList.remove('pulse-fast'), 6000);
        }
        
        // Store current celebration data for sharing
        window.currentCelebration = { storeName, cityName, stateName, value };
        
        // Auto close after 6 seconds
        window.celebrationTimeout = setTimeout(() => {
            celebration.classList.remove('active');
        }, 6000);
    },
    
    // Close celebration overlay
    close(event) {
        if (event) event.stopPropagation();
        
        const celebration = document.getElementById('first-sale-celebration');
        celebration.classList.remove('active');
        
        if (window.celebrationTimeout) {
            clearTimeout(window.celebrationTimeout);
        }
    },
    
    // Create confetti particles
    createConfetti() {
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9ff3'];
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti';
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = Math.random() * 0.5 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confettiContainer.appendChild(particle);
        }
        
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 5000);
    },
    
    // Share celebration moment
    share(event) {
        event.stopPropagation();
        
        const { storeName, cityName, stateName } = window.currentCelebration || {};
        const shareText = `🎉 Primeira venda histórica!\n\n${storeName} de ${cityName}, ${stateName} acabou de fazer sua primeira venda na Nuvemshop!\n\nO e-commerce brasileiro pulsa! 🇧🇷\n\n#Nuvemshop #Empreendedorismo #PrimeiraVenda`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Primeira Venda - Nuvemshop',
                text: shareText,
                url: window.location.href
            }).catch(console.log);
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Texto copiado para a área de transferência!');
            }).catch(console.log);
        }
    }
};

// Global functions for onclick handlers
function showFirstSaleCelebration(storeName, cityName, stateName, saleValue) {
    CelebrationComponent.show(storeName, cityName, stateName, saleValue);
}

function closeCelebration(event) {
    CelebrationComponent.close(event);
}

function shareCelebration(event) {
    CelebrationComponent.share(event);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CelebrationComponent;
}
