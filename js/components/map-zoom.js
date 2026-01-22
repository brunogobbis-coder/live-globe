/**
 * Map Zoom Component
 * ===================
 * Handles zoom in/out functionality for the Brazil map
 */

const MapZoom = {
    // Zoom to a specific state
    zoomToState(stateCode, pathElement) {
        const svg = document.querySelector('.brazil-map-svg');
        const indicator = document.getElementById('zoom-state-indicator');
        const stateName = document.getElementById('zoom-state-name');
        const stateData = CONFIG.states[stateCode];
        
        if (!svg || !stateData || !pathElement) return;
        
        // If already zoomed to this state, reset
        if (state.zoomedState === stateCode) {
            this.reset();
            return;
        }
        
        // Get the bounding box of the state path
        const bbox = pathElement.getBBox();
        const stateCenterX = bbox.x + bbox.width / 2;
        const stateCenterY = bbox.y + bbox.height / 2;
        
        // Get SVG viewBox dimensions
        const viewBox = svg.viewBox.baseVal;
        const svgWidth = viewBox.width;
        const svgHeight = viewBox.height;
        
        // Calculate state center as percentage of SVG
        const centerXPercent = (stateCenterX / svgWidth) * 100;
        const centerYPercent = (stateCenterY / svgHeight) * 100;
        
        // Calculate zoom level based on state size
        const stateArea = bbox.width * bbox.height;
        let zoomLevel;
        
        if (stateArea > 8000) zoomLevel = 2;        // Very large (AM, PA, MT)
        else if (stateArea > 4000) zoomLevel = 2.5; // Large (MG, BA, GO)
        else if (stateArea > 1500) zoomLevel = 3;   // Medium (SP, PR, RS)
        else if (stateArea > 500) zoomLevel = 3.5;  // Small (RJ, SC, PE)
        else zoomLevel = 4;                          // Very small (DF, SE, AL)
        
        // Apply zoom transform with transform-origin at center
        svg.style.transformOrigin = `${centerXPercent}% ${centerYPercent}%`;
        svg.style.transform = `scale(${zoomLevel})`;
        
        // Update state
        state.zoomedState = stateCode;
        
        // Show indicator
        stateName.textContent = `${stateData.name} (${stateCode})`;
        indicator.classList.add('visible');
    },
    
    // Reset zoom to full map view
    reset() {
        const svg = document.querySelector('.brazil-map-svg');
        const indicator = document.getElementById('zoom-state-indicator');
        const statePaths = document.querySelectorAll('.state-path');
        const tooltip = document.getElementById('region-tooltip');
        
        if (!svg) return;
        
        // Reset transform
        svg.style.transformOrigin = 'center center';
        svg.style.transform = 'scale(1)';
        
        // Clear state first to prevent recursion
        state.zoomedState = null;
        
        // Hide indicator
        indicator.classList.remove('visible');
        
        // Remove active from all states
        statePaths.forEach(p => p.classList.remove('active'));
        
        // Close tooltip directly
        state.tooltipVisible = false;
        state.selectedCity = null;
        tooltip.classList.remove('visible');
    }
};

// Global functions for onclick handlers
function zoomToState(stateCode, pathElement) {
    MapZoom.zoomToState(stateCode, pathElement);
}

function resetMapZoom() {
    MapZoom.reset();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapZoom;
}
