/**
 * Utility Functions
 * ==================
 * Common helper functions used across the application
 */

// Format number with thousands separator (Brazilian format)
function formatNumber(num) {
    return num.toLocaleString('pt-BR');
}

// Format currency (Brazilian Real)
function formatCurrency(value) {
    if (value >= 1000000000) {
        return 'R$ ' + (value / 1000000000).toFixed(1).replace('.', ',') + ' bi';
    }
    if (value >= 1000000) {
        return 'R$ ' + (value / 1000000).toFixed(1).replace('.', ',') + ' mi';
    }
    return 'R$ ' + value.toLocaleString('pt-BR');
}

// Format per second value
function formatPerSecond(value) {
    if (value >= 1000) {
        return 'R$ ' + (value / 1000).toFixed(0) + 'K/s';
    }
    return 'R$ ' + value + '/s';
}

// Generate random store name
function generateStoreName() {
    const adjectives = ['Nova', 'Super', 'Mega', 'Plus', 'Top', 'Premium', 'Express', 'Digital', 'Online', 'Smart'];
    const nouns = ['Store', 'Shop', 'Loja', 'Boutique', 'Market', 'Outlet', 'Fashion', 'Style', 'House', 'Center'];
    const suffixes = ['Brasil', 'BR', 'Digital', 'Online', 'Shop', ''];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${adj} ${noun}${suffix ? ' ' + suffix : ''}`;
}

// Generate random Brazilian name
function generateBrazilianName() {
    const firstNames = CONFIG.brazilianNames?.firstNames || ['João', 'Maria', 'Carlos', 'Ana'];
    const lastNames = CONFIG.brazilianNames?.lastNames || ['Silva', 'Santos', 'Oliveira', 'Souza'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
}

// Get random channel based on percentages
function getRandomChannel() {
    const channels = Object.entries(CONFIG.channels);
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const [key, channel] of channels) {
        cumulative += channel.percent;
        if (random <= cumulative) {
            return key;
        }
    }
    
    return 'online';
}

// Get weighted random state (more sales in larger states)
function getWeightedRandomState() {
    const states = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'ES', 'PA', 'AM', 'MT', 'MS'];
    const weights = [30, 20, 15, 10, 8, 7, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1];
    
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < states.length; i++) {
        random -= weights[i];
        if (random <= 0) return states[i];
    }
    
    return 'SP';
}

// Get random segment
function getRandomSegment() {
    const segments = Object.keys(CONFIG.segments);
    return segments[Math.floor(Math.random() * segments.length)];
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        formatCurrency,
        formatPerSecond,
        generateStoreName,
        generateBrazilianName,
        getRandomChannel,
        getWeightedRandomState,
        getRandomSegment,
        debounce,
        throttle
    };
}
