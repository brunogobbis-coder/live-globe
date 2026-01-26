// Celebration - First sale celebration overlay
export class Celebration {
    constructor(stateManager) {
        this.state = stateManager;
        this.element = null;
        this.confettiContainer = null;
        this.isShowing = false;
        this.autoHideTimeout = null;
    }
    
    init() {
        this.createElements();
        this.bindEvents();
    }
    
    createElements() {
        // Create celebration overlay
        this.element = document.createElement('div');
        this.element.className = 'first-sale-celebration';
        this.element.id = 'first-sale-celebration';
        this.element.innerHTML = `
            <div class="celebration-card">
                <button class="celebration-close-btn" aria-label="Fechar">×</button>
                <div class="celebration-emoji">🎉</div>
                <div class="celebration-regional-icon"></div>
                <h2 class="celebration-title">PRIMEIRA VENDA!</h2>
                <p class="celebration-subtitle">Um novo sonho começa aqui</p>
                <div class="celebration-store"></div>
                <div class="celebration-location"></div>
                <div class="celebration-journey">
                    <span class="journey-icon">🚀</span>
                    <span class="journey-text">Início de uma jornada incrível</span>
                </div>
                <div class="celebration-value">
                    <span class="value-label">Primeira venda:</span>
                    <span class="value-amount"></span>
                </div>
            </div>
        `;
        document.body.appendChild(this.element);
        
        // Create confetti container
        this.confettiContainer = document.createElement('div');
        this.confettiContainer.className = 'confetti';
        this.confettiContainer.id = 'confetti';
        document.body.appendChild(this.confettiContainer);
    }
    
    bindEvents() {
        // Close button
        const closeBtn = this.element.querySelector('.celebration-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // Click outside to close
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.hide();
            }
        });
        
        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isShowing) {
                this.hide();
            }
        });
    }
    
    show(storeName, cityName, stateName, value) {
        if (this.isShowing) return;
        this.isShowing = true;
        
        // Update content
        const storeEl = this.element.querySelector('.celebration-store');
        const locationEl = this.element.querySelector('.celebration-location');
        const valueEl = this.element.querySelector('.value-amount');
        const regionalIcon = this.element.querySelector('.celebration-regional-icon');
        
        if (storeEl) storeEl.textContent = storeName;
        if (locationEl) locationEl.innerHTML = `📍 ${cityName}, ${stateName}`;
        if (valueEl) valueEl.textContent = this.state.formatCurrency(value);
        if (regionalIcon) regionalIcon.textContent = this.getRegionalEmoji(stateName);
        
        // Show overlay
        this.element.classList.add('active');
        
        // Trigger confetti
        this.triggerConfetti();
        
        // Auto-hide after 8 seconds
        this.autoHideTimeout = setTimeout(() => this.hide(), 8000);
    }
    
    hide() {
        if (!this.isShowing) return;
        this.isShowing = false;
        
        this.element.classList.remove('active');
        
        if (this.autoHideTimeout) {
            clearTimeout(this.autoHideTimeout);
            this.autoHideTimeout = null;
        }
        
        // Clear confetti
        if (this.confettiContainer) {
            this.confettiContainer.innerHTML = '';
        }
    }
    
    triggerConfetti() {
        if (!this.confettiContainer) return;
        
        const colors = ['#ffd700', '#ff5630', '#36b37e', '#0059d5', '#00b8d9', '#ff9800'];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particle.style.animationDuration = `${2 + Math.random() * 2}s`;
            
            this.confettiContainer.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => particle.remove(), 5000);
        }
    }
    
    getRegionalEmoji(stateName) {
        const stateEmojis = {
            'SP': '🏙️', 'RJ': '🏖️', 'MG': '⛰️', 'ES': '🌊',
            'BA': '🥁', 'PE': '🎭', 'CE': '☀️', 'MA': '🏝️',
            'RS': '🧉', 'SC': '🌲', 'PR': '🌾',
            'AM': '🌳', 'PA': '🌿', 'MT': '🦜', 'GO': '🌻',
            'DF': '🏛️'
        };
        return stateEmojis[stateName] || '🇧🇷';
    }
}
