/**
 * Stats Component
 * ================
 * Handles stats display and updates
 */

const StatsComponent = {
    // Update main stats display
    updateStats() {
        // Update orders and other stats
        state.totalOrders += Math.floor(Math.random() * 15) + 5;
        state.ordersPerMinute = 800 + Math.floor(Math.random() * 200);
        
        // Vary the GMV per second slightly
        state.gmvPerSecond = 40000 + Math.floor(Math.random() * 15000);
        
        // Update displays
        document.getElementById('total-orders').textContent = formatNumber(state.totalOrders);
        document.getElementById('orders-per-minute').textContent = state.ordersPerMinute;
        document.getElementById('active-stores').textContent = formatNumber(state.activeStores);
        document.getElementById('avg-ticket').textContent = 'R$ ' + state.avgTicket;
        
        // Update Brazilian context
        this.updateBrazilianContext();
        
        // Update map pulse based on sales intensity
        this.updateMapPulse();
        
        // Stats view
        const statsGmv = document.getElementById('stats-gmv');
        const statsOrders = document.getElementById('stats-orders');
        if (statsGmv) statsGmv.textContent = formatCurrency(state.gmv);
        if (statsOrders) statsOrders.textContent = formatNumber(state.totalOrders);
        
        // Mobile stats
        this.updateMobileStats();
    },
    
    // Update Brazilian context messages
    updateBrazilianContext() {
        const ordersPerSec = Math.floor(state.ordersPerMinute / 60);
        
        // Orders per minute context
        const ordersMinContext = document.getElementById('orders-min-context');
        if (ordersMinContext) {
            if (ordersPerSec >= 14) {
                ordersMinContext.textContent = `${ordersPerSec} por segundo 🔥`;
            } else if (ordersPerSec >= 10) {
                ordersMinContext.textContent = `${ordersPerSec} por segundo`;
            } else {
                ordersMinContext.textContent = '+1 por segundo';
            }
        }
        
        // Stores context - rotate messages
        const storesContext = document.getElementById('stores-context');
        if (storesContext && Math.random() < 0.1) {
            const messages = [
                'empreendedores',
                'sonhos em ação',
                'negócios crescendo',
                'histórias de sucesso'
            ];
            storesContext.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
    },
    
    // Update map pulse based on sales volume
    updateMapPulse() {
        const svg = document.querySelector('.brazil-map-svg');
        if (!svg) return;
        
        // Remove all pulse classes
        svg.classList.remove('pulse-fast', 'pulse-medium', 'pulse-slow');
        
        // Add appropriate class based on orders per minute
        if (state.ordersPerMinute >= 900) {
            svg.classList.add('pulse-fast');
        } else if (state.ordersPerMinute >= 800) {
            svg.classList.add('pulse-medium');
        } else {
            svg.classList.add('pulse-slow');
        }
    },
    
    // Update mobile stats
    updateMobileStats() {
        const mobileOrders = document.getElementById('mobile-orders');
        const mobileStores = document.getElementById('mobile-stores');
        const mobileTicket = document.getElementById('mobile-ticket');
        const mobilePerSec = document.getElementById('mobile-per-sec');
        
        if (mobileOrders) mobileOrders.textContent = formatNumber(state.totalOrders);
        if (mobileStores) mobileStores.textContent = formatNumber(state.activeStores);
        if (mobileTicket) mobileTicket.textContent = 'R$ ' + state.avgTicket;
        if (mobilePerSec) mobilePerSec.textContent = formatPerSecond(state.gmvPerSecond);
    },
    
    // Update solutions stats (NuvemPay, NuvemEnvios)
    updateSolutionsStats() {
        const nuvemPayEl = document.getElementById('nuvem-pay-percent');
        const nuvemEnviosEl = document.getElementById('nuvem-envios-percent');
        const nuvemPayCountEl = document.getElementById('nuvem-pay-count');
        const nuvemEnviosCountEl = document.getElementById('nuvem-envios-count');
        
        if (state.totalSalesTracked > 0) {
            const payPercent = Math.round((state.nuvemPayCount / state.totalSalesTracked) * 100);
            const enviosPercent = Math.round((state.nuvemEnviosCount / state.totalSalesTracked) * 100);
            
            if (nuvemPayEl) nuvemPayEl.textContent = payPercent + '%';
            if (nuvemEnviosEl) nuvemEnviosEl.textContent = enviosPercent + '%';
            if (nuvemPayCountEl) nuvemPayCountEl.textContent = formatNumber(state.nuvemPayCount);
            if (nuvemEnviosCountEl) nuvemEnviosCountEl.textContent = formatNumber(state.nuvemEnviosCount);
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatsComponent;
}
