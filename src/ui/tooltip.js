// Tooltip - State tooltip management
export class Tooltip {
    constructor(stateManager) {
        this.state = stateManager;
        this.element = null;
        this.visible = false;
    }
    
    init() {
        this.element = document.getElementById('state-tooltip');
        this.bindEvents();
    }
    
    bindEvents() {
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.visible && 
                !e.target.closest('#state-tooltip') && 
                !e.target.closest('.state-path')) {
                this.hide();
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.visible) {
                this.hide();
            }
        });
    }
    
    show(stateCode, x, y) {
        if (!this.element) return;
        
        const stateInfo = this.state.getStateInfo(stateCode);
        if (!stateInfo) return;
        
        const sales = this.state.getStateSales(stateCode);
        const gmv = this.state.getStateGMV ? this.state.getStateGMV(stateCode) : 0;
        
        this.element.innerHTML = this.buildTooltipContent(stateCode, stateInfo, sales, gmv);
        this.positionTooltip(x, y);
        this.element.classList.add('visible');
        this.visible = true;
    }
    
    showEnriched(stateCode, x, y, data) {
        if (!this.element) return;
        
        const { stateInfo, gmv, regionStats } = data;
        if (!stateInfo) {
            this.show(stateCode, x, y);
            return;
        }
        
        const sales = this.state.getStateSales(stateCode);
        
        this.element.innerHTML = this.buildEnrichedContent(stateCode, stateInfo, sales, gmv, regionStats);
        this.positionTooltip(x, y);
        this.element.classList.add('visible');
        this.visible = true;
    }
    
    buildTooltipContent(stateCode, stateInfo, sales, gmv) {
        const regionClass = `region-${stateInfo.region.replace('-', '')}`;
        
        return `
            <div class="tooltip-header">
                <div class="tooltip-title">
                    <span class="tooltip-state">${stateInfo.name}</span>
                    <span class="tooltip-code">${stateCode}</span>
                </div>
                <span class="tooltip-region ${regionClass}">${this.getRegionName(stateInfo.region)}</span>
            </div>
            <div class="tooltip-stats">
                <div class="tooltip-stat">
                    <span class="stat-label">Capital</span>
                    <span class="stat-value">${stateInfo.capital}</span>
                </div>
                <div class="tooltip-stat highlight">
                    <span class="stat-label">Vendas Hoje</span>
                    <span class="stat-value">${sales}</span>
                </div>
                ${gmv > 0 ? `
                <div class="tooltip-stat">
                    <span class="stat-label">GMV</span>
                    <span class="stat-value">${this.state.formatCurrency(gmv)}</span>
                </div>
                ` : ''}
            </div>
            <button class="tooltip-close" onclick="window.uiManager?.hideStateTooltip()">
                <span class="close-icon">×</span> Fechar
            </button>
        `;
    }
    
    buildEnrichedContent(stateCode, stateInfo, sales, gmv, regionStats) {
        const regionClass = `region-${stateInfo.region.replace('-', '')}`;
        
        let regionStatsHtml = '';
        if (regionStats) {
            regionStatsHtml = `
                <div class="tooltip-stat region-stat">
                    <span class="stat-label">Total ${this.getRegionName(stateInfo.region)}</span>
                    <span class="stat-value">${regionStats.sales || 0} vendas</span>
                </div>
            `;
        }
        
        return `
            <div class="tooltip-header">
                <div class="tooltip-title">
                    <span class="tooltip-state">${stateInfo.name}</span>
                    <span class="tooltip-code">${stateCode}</span>
                </div>
                <span class="tooltip-region ${regionClass}">${this.getRegionName(stateInfo.region)}</span>
            </div>
            <div class="tooltip-stats">
                <div class="tooltip-stat">
                    <span class="stat-label">Capital</span>
                    <span class="stat-value">${stateInfo.capital}</span>
                </div>
                <div class="tooltip-stat highlight">
                    <span class="stat-label">Vendas Hoje</span>
                    <span class="stat-value">${sales}</span>
                </div>
                ${gmv > 0 ? `
                <div class="tooltip-stat">
                    <span class="stat-label">GMV</span>
                    <span class="stat-value">${this.state.formatCurrency(gmv)}</span>
                </div>
                ` : ''}
                ${regionStatsHtml}
            </div>
            <button class="tooltip-close" onclick="window.uiManager?.hideStateTooltip()">
                <span class="close-icon">×</span> Fechar
            </button>
        `;
    }
    
    positionTooltip(x, y) {
        if (!this.element) return;
        
        const padding = 15;
        const tooltipRect = this.element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let left = x + padding;
        let top = y - padding;
        
        // Adjust if overflowing right
        if (left + tooltipRect.width > viewportWidth - padding) {
            left = x - tooltipRect.width - padding;
        }
        
        // Adjust if overflowing bottom
        if (top + tooltipRect.height > viewportHeight - padding) {
            top = viewportHeight - tooltipRect.height - padding;
        }
        
        // Ensure not off-screen top
        if (top < padding) {
            top = padding;
        }
        
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }
    
    hide() {
        if (this.element) {
            this.element.classList.remove('visible');
            this.visible = false;
        }
    }
    
    getRegionName(region) {
        const names = {
            'norte': 'Norte',
            'nordeste': 'Nordeste',
            'centro-oeste': 'Centro-Oeste',
            'sudeste': 'Sudeste',
            'sul': 'Sul'
        };
        return names[region] || region;
    }
}
