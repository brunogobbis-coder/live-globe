// Stats - Statistics display management
export class Stats {
    constructor(stateManager) {
        this.state = stateManager;
        this.elements = {};
        this.updateInterval = null;
        this.focusedState = null;
    }
    
    init() {
        this.cacheElements();
        this.startAutoUpdate();
    }
    
    cacheElements() {
        this.elements = {
            statsBar: document.querySelector('.stats-bar'),
            statsOnline: document.getElementById('stat-online'),
            statsPos: document.getElementById('stat-pos'),
            statsChat: document.getElementById('stat-chat'),
            statsSocial: document.getElementById('stat-social'),
            totalSales: document.getElementById('total-sales')
        };
    }
    
    startAutoUpdate() {
        // Update stats every second
        this.updateInterval = setInterval(() => {
            if (!this.focusedState) {
                this.updateChannelStats();
            }
        }, 1000);
    }
    
    updateChannelStats() {
        const stats = this.state.salesByChannel;
        
        this.updateStatElement('statsOnline', stats.online || 0);
        this.updateStatElement('statsPos', stats.pos || 0);
        this.updateStatElement('statsChat', stats.chat || 0);
        this.updateStatElement('statsSocial', stats.social || 0);
    }
    
    updateStatElement(key, value) {
        const el = this.elements[key];
        if (!el) return;
        
        const currentValue = parseInt(el.textContent) || 0;
        if (currentValue !== value) {
            el.textContent = value;
            
            // Pulse animation
            const card = el.closest('.stat-card');
            if (card) {
                card.classList.add('updated');
                setTimeout(() => card.classList.remove('updated'), 300);
            }
        }
    }
    
    updateTotalSales() {
        const total = Object.values(this.state.salesByChannel).reduce((a, b) => a + b, 0);
        if (this.elements.totalSales) {
            this.elements.totalSales.textContent = `${total} vendas`;
        }
    }
    
    updateFromStats(stats) {
        if (stats.salesByChannel) {
            this.updateStatElement('statsOnline', stats.salesByChannel.online || 0);
            this.updateStatElement('statsPos', stats.salesByChannel.pos || 0);
            this.updateStatElement('statsChat', stats.salesByChannel.chat || 0);
            this.updateStatElement('statsSocial', stats.salesByChannel.social || 0);
        }
        
        if (this.elements.totalSales && stats.totalSales !== undefined) {
            this.elements.totalSales.textContent = `${stats.totalSales} vendas`;
        }
    }
    
    showStateStats(stateCode, stateInfo) {
        this.focusedState = stateCode;
        
        // Add visual indicator that we're showing state-specific stats
        if (this.elements.statsBar) {
            this.elements.statsBar.classList.add('state-focused');
        }
        
        // Get state-specific stats
        const stateSales = this.state.getStateSales(stateCode);
        const stateGMV = this.state.getStateGMV ? this.state.getStateGMV(stateCode) : 0;
        
        // Update display to show state stats
        // This could be expanded to show more detailed state data
        if (this.elements.totalSales) {
            this.elements.totalSales.textContent = `${stateSales} vendas em ${stateInfo.name}`;
        }
    }
    
    showGlobalStats() {
        this.focusedState = null;
        
        if (this.elements.statsBar) {
            this.elements.statsBar.classList.remove('state-focused');
        }
        
        this.updateChannelStats();
        this.updateTotalSales();
    }
    
    updateExtendedStats(data) {
        // For future extensibility - handle additional stats data
        if (data.customStats) {
            // Handle custom statistics display
        }
    }
    
    reset() {
        this.focusedState = null;
        
        this.updateStatElement('statsOnline', 0);
        this.updateStatElement('statsPos', 0);
        this.updateStatElement('statsChat', 0);
        this.updateStatElement('statsSocial', 0);
        
        if (this.elements.totalSales) {
            this.elements.totalSales.textContent = '0 vendas';
        }
        
        if (this.elements.statsBar) {
            this.elements.statsBar.classList.remove('state-focused');
        }
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}
