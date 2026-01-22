/**
 * Tooltip Component
 * ==================
 * Handles region/city tooltips
 */

const TooltipComponent = {
    // Show city tooltip
    showCity(city, x, y) {
        state.selectedCity = city;
        state.tooltipVisible = true;
        
        const tooltip = document.getElementById('region-tooltip');
        const stateData = CONFIG.states[city.state];
        const stateIcon = CONFIG.stateIcons[city.state] || {};
        
        // Update content
        document.getElementById('tooltip-flag').textContent = stateIcon.flag || '🇧🇷';
        document.getElementById('tooltip-city').textContent = city.name;
        document.getElementById('tooltip-country').textContent = stateData ? stateData.name + ' (' + city.state + ')' : city.state;
        document.getElementById('tooltip-orders').textContent = formatNumber(city.orders);
        document.getElementById('tooltip-gmv').textContent = formatCurrency(city.gmv);
        document.getElementById('tooltip-stores').textContent = city.stores.toLocaleString('pt-BR');
        document.getElementById('tooltip-ticket').textContent = 'R$ ' + city.ticket;
        
        // Update segments
        const segmentsList = document.getElementById('tooltip-segments');
        segmentsList.innerHTML = '';
        city.topSegments.forEach((segKey, i) => {
            const seg = CONFIG.segments[segKey];
            if (seg) {
                const percent = i === 0 ? 38 : i === 1 ? 25 : 18;
                const tag = document.createElement('span');
                tag.className = 'region-segment-tag';
                tag.innerHTML = `<span style="color: ${seg.color}">●</span> ${seg.name} ${percent}%`;
                segmentsList.appendChild(tag);
            }
        });
        
        // Position tooltip
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const tooltipWidth = 320;
            const tooltipHeight = 360;
            
            let left = x + 20;
            let top = y - tooltipHeight / 2;
            
            // Adjust if off screen
            if (left + tooltipWidth > viewportWidth - 20) {
                left = x - tooltipWidth - 20;
            }
            if (top < 80) top = 80;
            if (top + tooltipHeight > viewportHeight - 20) {
                top = viewportHeight - tooltipHeight - 20;
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.style.right = 'auto';
            tooltip.style.bottom = 'auto';
            tooltip.style.transform = 'none';
        }
        
        tooltip.classList.add('visible');
    },
    
    // Close tooltip
    close() {
        state.tooltipVisible = false;
        state.selectedCity = null;
        document.getElementById('region-tooltip').classList.remove('visible');
        
        // Remove active state
        document.querySelectorAll('#brazil-map .state').forEach(s => s.classList.remove('active'));
        
        // Also reset map zoom if zoomed
        if (state.zoomedState) {
            resetMapZoom();
        }
    }
};

// Global functions for onclick handlers
function showCityTooltip(city, x, y) {
    TooltipComponent.showCity(city, x, y);
}

function closeTooltip() {
    TooltipComponent.close();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipComponent;
}
