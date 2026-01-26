// Brazil states GeoJSON data - simplified coordinates for 3D rendering
// Coordinates are normalized to fit within a -5 to 5 range for Three.js

export const BRAZIL_STATES = {
    // Region colors (hex values for Three.js)
    regionColors: {
        norte: 0x00b4b4,      // Cyan - Amazon
        nordeste: 0x50b464,   // Green - Coast
        'centro-oeste': 0xc8a050, // Amber - Cerrado
        sudeste: 0x0059d5,    // Blue - Urban
        sul: 0x8c50b4         // Purple - Araucarias
    },
    
    // State polygons (simplified for 3D, coordinates in local space)
    states: {
        // Norte
        AM: {
            region: 'norte',
            center: { x: -2.5, z: -2.0 },
            polygon: [
                [-4.0, -3.5], [-3.0, -4.0], [-1.5, -3.8], [-0.5, -3.0],
                [-0.3, -1.5], [-1.0, -0.5], [-2.5, -0.3], [-3.8, -1.0],
                [-4.2, -2.0], [-4.0, -3.5]
            ],
            elevation: 0.15
        },
        PA: {
            region: 'norte',
            center: { x: -0.5, z: -2.0 },
            polygon: [
                [-0.3, -3.0], [1.0, -3.2], [2.0, -2.5], [2.2, -1.0],
                [1.5, 0.0], [0.0, 0.2], [-0.5, -0.8], [-0.3, -1.5],
                [-0.3, -3.0]
            ],
            elevation: 0.1
        },
        AC: {
            region: 'norte',
            center: { x: -4.2, z: -1.5 },
            polygon: [
                [-4.8, -2.0], [-4.0, -2.2], [-3.8, -1.0], [-4.2, -0.5],
                [-4.8, -0.8], [-4.8, -2.0]
            ],
            elevation: 0.2
        },
        RO: {
            region: 'norte',
            center: { x: -3.2, z: -0.5 },
            polygon: [
                [-3.8, -1.0], [-2.5, -0.3], [-2.2, 0.5], [-3.0, 0.8],
                [-3.8, 0.3], [-4.2, -0.5], [-3.8, -1.0]
            ],
            elevation: 0.15
        },
        RR: {
            region: 'norte',
            center: { x: -2.0, z: -4.0 },
            polygon: [
                [-2.5, -4.5], [-1.5, -4.8], [-1.0, -4.0], [-1.5, -3.5],
                [-2.5, -3.5], [-2.8, -4.0], [-2.5, -4.5]
            ],
            elevation: 0.2
        },
        AP: {
            region: 'norte',
            center: { x: 0.5, z: -3.8 },
            polygon: [
                [0.0, -4.2], [1.0, -4.5], [1.5, -3.8], [1.0, -3.2],
                [0.0, -3.2], [0.0, -4.2]
            ],
            elevation: 0.1
        },
        TO: {
            region: 'norte',
            center: { x: 0.0, z: 0.0 },
            polygon: [
                [-0.5, -0.8], [0.5, -0.8], [1.0, 0.5], [0.5, 1.2],
                [-0.3, 1.0], [-0.8, 0.3], [-0.5, -0.8]
            ],
            elevation: 0.3
        },
        
        // Nordeste
        MA: {
            region: 'nordeste',
            center: { x: 0.8, z: -1.5 },
            polygon: [
                [0.0, -2.2], [1.5, -2.5], [2.2, -1.8], [2.0, -0.8],
                [1.2, -0.5], [0.0, -0.8], [0.0, -2.2]
            ],
            elevation: 0.1
        },
        PI: {
            region: 'nordeste',
            center: { x: 1.2, z: -0.3 },
            polygon: [
                [0.5, -0.8], [1.8, -1.0], [2.2, 0.0], [1.8, 0.8],
                [0.8, 0.5], [0.5, -0.8]
            ],
            elevation: 0.15
        },
        CE: {
            region: 'nordeste',
            center: { x: 2.2, z: -1.2 },
            polygon: [
                [1.8, -1.8], [2.8, -1.8], [3.2, -1.0], [2.8, -0.5],
                [2.0, -0.8], [1.8, -1.8]
            ],
            elevation: 0.1
        },
        RN: {
            region: 'nordeste',
            center: { x: 2.8, z: -0.8 },
            polygon: [
                [2.5, -1.2], [3.5, -1.0], [3.5, -0.5], [2.8, -0.3],
                [2.5, -0.6], [2.5, -1.2]
            ],
            elevation: 0.05
        },
        PB: {
            region: 'nordeste',
            center: { x: 2.8, z: -0.2 },
            polygon: [
                [2.3, -0.5], [3.5, -0.5], [3.5, 0.0], [2.5, 0.2],
                [2.3, -0.5]
            ],
            elevation: 0.05
        },
        PE: {
            region: 'nordeste',
            center: { x: 2.5, z: 0.3 },
            polygon: [
                [1.5, 0.0], [3.2, 0.0], [3.5, 0.5], [2.8, 0.8],
                [1.5, 0.5], [1.5, 0.0]
            ],
            elevation: 0.1
        },
        AL: {
            region: 'nordeste',
            center: { x: 2.8, z: 0.7 },
            polygon: [
                [2.5, 0.5], [3.3, 0.5], [3.5, 1.0], [2.8, 1.0],
                [2.5, 0.5]
            ],
            elevation: 0.05
        },
        SE: {
            region: 'nordeste',
            center: { x: 2.5, z: 1.0 },
            polygon: [
                [2.2, 0.8], [2.8, 0.8], [3.0, 1.3], [2.5, 1.5],
                [2.2, 0.8]
            ],
            elevation: 0.05
        },
        BA: {
            region: 'nordeste',
            center: { x: 1.5, z: 1.2 },
            polygon: [
                [0.5, 0.5], [2.5, 0.5], [2.8, 1.5], [2.5, 2.5],
                [1.5, 2.8], [0.2, 2.2], [0.0, 1.2], [0.5, 0.5]
            ],
            elevation: 0.35
        },
        
        // Centro-Oeste
        MT: {
            region: 'centro-oeste',
            center: { x: -1.8, z: 0.8 },
            polygon: [
                [-3.0, 0.0], [-1.0, -0.2], [-0.5, 1.0], [-0.8, 2.0],
                [-2.0, 2.2], [-3.2, 1.5], [-3.0, 0.0]
            ],
            elevation: 0.35
        },
        GO: {
            region: 'centro-oeste',
            center: { x: -0.2, z: 1.5 },
            polygon: [
                [-0.8, 0.8], [0.5, 0.8], [1.0, 1.8], [0.5, 2.5],
                [-0.5, 2.5], [-1.0, 1.8], [-0.8, 0.8]
            ],
            elevation: 0.45
        },
        MS: {
            region: 'centro-oeste',
            center: { x: -1.8, z: 2.5 },
            polygon: [
                [-2.5, 1.8], [-1.2, 1.8], [-0.8, 2.8], [-1.5, 3.5],
                [-2.8, 3.2], [-3.0, 2.2], [-2.5, 1.8]
            ],
            elevation: 0.25
        },
        DF: {
            region: 'centro-oeste',
            center: { x: 0.0, z: 1.2 },
            polygon: [
                [-0.2, 1.0], [0.2, 1.0], [0.3, 1.4], [-0.1, 1.5],
                [-0.3, 1.2], [-0.2, 1.0]
            ],
            elevation: 0.6
        },
        
        // Sudeste
        SP: {
            region: 'sudeste',
            center: { x: -0.5, z: 3.0 },
            polygon: [
                [-1.5, 2.2], [0.5, 2.0], [1.2, 2.8], [1.0, 3.8],
                [-0.5, 4.0], [-1.8, 3.5], [-1.5, 2.2]
            ],
            elevation: 0.5
        },
        RJ: {
            region: 'sudeste',
            center: { x: 1.2, z: 3.2 },
            polygon: [
                [0.8, 2.8], [2.0, 2.5], [2.5, 3.2], [2.0, 3.8],
                [1.0, 3.8], [0.8, 2.8]
            ],
            elevation: 0.55
        },
        MG: {
            region: 'sudeste',
            center: { x: 0.8, z: 2.0 },
            polygon: [
                [0.0, 1.2], [1.8, 1.0], [2.5, 1.8], [2.2, 2.8],
                [1.0, 3.0], [0.0, 2.5], [-0.2, 1.8], [0.0, 1.2]
            ],
            elevation: 0.55
        },
        ES: {
            region: 'sudeste',
            center: { x: 2.0, z: 2.2 },
            polygon: [
                [1.8, 1.8], [2.5, 1.8], [2.8, 2.5], [2.2, 2.8],
                [1.8, 1.8]
            ],
            elevation: 0.3
        },
        
        // Sul
        PR: {
            region: 'sul',
            center: { x: -0.8, z: 3.8 },
            polygon: [
                [-1.8, 3.2], [0.0, 3.2], [0.5, 4.0], [0.0, 4.5],
                [-1.5, 4.5], [-2.0, 3.8], [-1.8, 3.2]
            ],
            elevation: 0.45
        },
        SC: {
            region: 'sul',
            center: { x: -0.5, z: 4.5 },
            polygon: [
                [-1.5, 4.2], [0.2, 4.2], [0.5, 4.8], [0.0, 5.2],
                [-1.2, 5.0], [-1.5, 4.2]
            ],
            elevation: 0.35
        },
        RS: {
            region: 'sul',
            center: { x: -1.0, z: 5.2 },
            polygon: [
                [-2.0, 4.5], [-0.5, 4.5], [0.0, 5.2], [-0.5, 6.0],
                [-2.0, 6.2], [-2.8, 5.5], [-2.5, 4.8], [-2.0, 4.5]
            ],
            elevation: 0.25
        }
    },
    
    // City positions for sale particles
    cities: {
        'São Paulo': { x: -0.3, z: 3.2 },
        'Rio de Janeiro': { x: 1.5, z: 3.3 },
        'Belo Horizonte': { x: 0.8, z: 2.2 },
        'Salvador': { x: 2.0, z: 1.5 },
        'Brasília': { x: 0.0, z: 1.2 },
        'Fortaleza': { x: 2.5, z: -1.0 },
        'Curitiba': { x: -0.5, z: 4.0 },
        'Recife': { x: 3.0, z: 0.3 },
        'Porto Alegre': { x: -1.0, z: 5.5 },
        'Manaus': { x: -2.5, z: -2.5 },
        'Goiânia': { x: -0.3, z: 1.5 },
        'Belém': { x: 0.5, z: -2.5 },
        'Florianópolis': { x: -0.2, z: 4.8 },
        'Vitória': { x: 2.2, z: 2.3 },
        'Natal': { x: 3.2, z: -0.6 },
        'Campinas': { x: -0.2, z: 3.0 },
        'Ribeirão Preto': { x: 0.0, z: 2.6 },
        'Santos': { x: 0.2, z: 3.5 },
        'Niterói': { x: 1.8, z: 3.4 },
        'Joinville': { x: -0.3, z: 4.3 }
    }
};
