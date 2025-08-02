class DiamondPlanner {
    constructor() {
        this.diamondCount = 6;
        this.colors = [
            '#ffffff', '#8b5cf6', '#059669', 
            '#06b6d4', '#d97706', '#ffffff'
        ];
        this.defaultColors = [
            '#ffffff', '#8b5cf6', '#059669', 
            '#06b6d4', '#d97706', '#ef4444',
            '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'
        ];
        this.storageKey = 'diamond-planner-history';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateDiamonds();
        this.generateColorPickers();
        this.renderHistory();
    }
    
    setupEventListeners() {
        const countSlider = document.getElementById('diamondCount');
        const countDisplay = document.getElementById('countDisplay');
        const saveBtn = document.getElementById('savePaletteBtn');
        
        countSlider.addEventListener('input', (e) => {
            this.diamondCount = parseInt(e.target.value);
            countDisplay.textContent = this.diamondCount;
            this.updateColors();
            this.generateDiamonds();
            this.generateColorPickers();
        });
        
        saveBtn.addEventListener('click', () => {
            const name = prompt('Enter a name for this palette (or leave blank for auto-generated name):');
            if (name !== null) {
                const success = this.savePalette(name.trim());
                if (success) {
                    alert('Palette saved successfully!');
                } else {
                    alert('Error saving palette. Please try again.');
                }
            }
        });
    }
    
    updateColors() {
        while (this.colors.length < this.diamondCount) {
            const index = this.colors.length % this.defaultColors.length;
            this.colors.push(this.defaultColors[index]);
        }
        this.colors = this.colors.slice(0, this.diamondCount);
    }
    
    generateDiamonds() {
        const container = document.getElementById('diamondDisplay');
        container.innerHTML = '';
        
        const baseSize = 350;
        const minSize = 40;
        const sizeStep = (baseSize - minSize) / Math.max(1, this.diamondCount - 1);
        
        for (let i = 0; i < this.diamondCount; i++) {
            const diamond = document.createElement('div');
            diamond.className = 'diamond';
            diamond.dataset.index = i;
            
            const size = baseSize - (i * sizeStep);
            diamond.style.width = `${size}px`;
            diamond.style.height = `${size}px`;
            diamond.style.backgroundColor = this.colors[i];
            diamond.style.zIndex = i + 1;
            diamond.style.top = '50%';
            diamond.style.left = '50%';
            diamond.style.transform = 'translate(-50%, -50%) rotate(45deg)';
            
            console.log(`Diamond ${i}: size=${size}px, color=${this.colors[i]}, zIndex=${this.diamondCount - i}`);
            
            container.appendChild(diamond);
        }
    }
    
    generateColorPickers() {
        const container = document.getElementById('colorPickers');
        container.innerHTML = '';
        
        for (let i = 0; i < this.diamondCount; i++) {
            const pickerItem = document.createElement('div');
            pickerItem.className = 'color-picker-item';
            
            const label = document.createElement('label');
            label.className = 'color-picker-label';
            label.textContent = `Diamond ${i + 1} (${i === 0 ? 'Outermost' : i === this.diamondCount - 1 ? 'Innermost' : 'Middle'})`;
            
            const pickerContainer = document.createElement('div');
            pickerContainer.className = 'color-picker-container';
            
            const colorPreview = document.createElement('div');
            colorPreview.className = 'color-preview';
            colorPreview.style.backgroundColor = this.colors[i];
            
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.className = 'color-input';
            colorInput.value = this.colors[i];
            
            const rgbContainer = document.createElement('div');
            const rgbLabels = document.createElement('div');
            rgbLabels.className = 'rgb-labels';
            rgbLabels.innerHTML = '<span>R</span><span>G</span><span>B</span>';
            
            const rgbInputs = document.createElement('div');
            rgbInputs.className = 'rgb-inputs';
            
            const rgb = this.hexToRgb(this.colors[i]);
            
            const rInput = document.createElement('input');
            rInput.type = 'number';
            rInput.className = 'rgb-input';
            rInput.min = '0';
            rInput.max = '255';
            rInput.value = rgb.r;
            
            const gInput = document.createElement('input');
            gInput.type = 'number';
            gInput.className = 'rgb-input';
            gInput.min = '0';
            gInput.max = '255';
            gInput.value = rgb.g;
            
            const bInput = document.createElement('input');
            bInput.type = 'number';
            bInput.className = 'rgb-input';
            bInput.min = '0';
            bInput.max = '255';
            bInput.value = rgb.b;
            
            rgbInputs.appendChild(rInput);
            rgbInputs.appendChild(gInput);
            rgbInputs.appendChild(bInput);
            
            const updateColor = (newColor) => {
                this.colors[i] = newColor;
                colorPreview.style.backgroundColor = newColor;
                colorInput.value = newColor;
                
                const rgb = this.hexToRgb(newColor);
                rInput.value = rgb.r;
                gInput.value = rgb.g;
                bInput.value = rgb.b;
                
                this.updateDiamondColor(i, newColor);
            };
            
            const updateFromRgb = () => {
                const r = Math.max(0, Math.min(255, parseInt(rInput.value) || 0));
                const g = Math.max(0, Math.min(255, parseInt(gInput.value) || 0));
                const b = Math.max(0, Math.min(255, parseInt(bInput.value) || 0));
                
                rInput.value = r;
                gInput.value = g;
                bInput.value = b;
                
                const hexColor = this.rgbToHex(r, g, b);
                updateColor(hexColor);
            };
            
            colorInput.addEventListener('input', (e) => {
                updateColor(e.target.value);
            });
            
            colorPreview.addEventListener('click', () => {
                colorInput.click();
            });
            
            rInput.addEventListener('input', updateFromRgb);
            gInput.addEventListener('input', updateFromRgb);
            bInput.addEventListener('input', updateFromRgb);
            
            pickerContainer.appendChild(colorPreview);
            pickerContainer.appendChild(colorInput);
            
            pickerItem.appendChild(label);
            pickerItem.appendChild(pickerContainer);
            pickerItem.appendChild(rgbLabels);
            pickerItem.appendChild(rgbInputs);
            
            container.appendChild(pickerItem);
        }
    }
    
    updateDiamondColor(index, color) {
        const diamond = document.querySelector(`[data-index="${index}"]`);
        if (diamond) {
            diamond.style.backgroundColor = color;
        }
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 0, g: 0, b: 0};
    }
    
    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    getHistory() {
        try {
            const history = localStorage.getItem(this.storageKey);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.warn('Error loading history:', error);
            return [];
        }
    }
    
    savePalette(name = '') {
        const palette = {
            id: Date.now(),
            name: name || `Palette ${new Date().toLocaleString()}`,
            diamondCount: this.diamondCount,
            colors: [...this.colors],
            timestamp: new Date().toISOString()
        };
        
        const history = this.getHistory();
        history.unshift(palette);
        
        if (history.length > 20) {
            history.splice(20);
        }
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            this.renderHistory();
            return true;
        } catch (error) {
            console.warn('Error saving palette:', error);
            return false;
        }
    }
    
    loadPalette(paletteId) {
        const history = this.getHistory();
        const palette = history.find(p => p.id === paletteId);
        
        if (palette) {
            this.diamondCount = palette.diamondCount;
            this.colors = [...palette.colors];
            
            document.getElementById('diamondCount').value = this.diamondCount;
            document.getElementById('countDisplay').textContent = this.diamondCount;
            
            this.generateDiamonds();
            this.generateColorPickers();
        }
    }
    
    deletePalette(paletteId) {
        const history = this.getHistory();
        const filteredHistory = history.filter(p => p.id !== paletteId);
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(filteredHistory));
            this.renderHistory();
            return true;
        } catch (error) {
            console.warn('Error deleting palette:', error);
            return false;
        }
    }
    
    renderHistory() {
        const container = document.getElementById('paletteHistory');
        if (!container) return;
        
        const history = this.getHistory();
        
        if (history.length === 0) {
            container.innerHTML = '<p class="no-history">No saved palettes yet</p>';
            return;
        }
        
        container.innerHTML = history.map(palette => `
            <div class="palette-item" data-id="${palette.id}">
                <div class="palette-preview">
                    ${palette.colors.map(color => `
                        <div class="preview-diamond" style="background-color: ${color}"></div>
                    `).join('')}
                </div>
                <div class="palette-info">
                    <div class="palette-name">${palette.name}</div>
                    <div class="palette-details">${palette.diamondCount} diamonds • ${new Date(palette.timestamp).toLocaleDateString()}</div>
                </div>
                <div class="palette-actions">
                    <button class="load-btn" onclick="diamondPlanner.loadPalette(${palette.id})">Load</button>
                    <button class="delete-btn" onclick="diamondPlanner.deletePalette(${palette.id})">×</button>
                </div>
            </div>
        `).join('');
    }
}

let diamondPlanner;

document.addEventListener('DOMContentLoaded', () => {
    diamondPlanner = new DiamondPlanner();
});