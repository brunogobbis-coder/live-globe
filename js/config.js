/**
 * Configuration & Data
 * =====================
 * All static configuration data for the application
 */

// API Configuration
const API_CONFIG = {
    // Set this to your API Gateway URL after deployment
    // Example: 'https://abc123.execute-api.us-east-1.amazonaws.com/prod'
    baseUrl: null, // null = use simulated data
    refreshInterval: 60000, // 60 seconds
    enabled: false // Set to true when API is ready
};

// Main Configuration
const CONFIG = {
    // Product Segments
    segments: {
        moda: { name: 'Moda & Vestuário', icon: '👗', color: '#e91e63' },
        eletronicos: { name: 'Eletrônicos', icon: '📱', color: '#2196f3' },
        casa: { name: 'Casa & Decoração', icon: '🏠', color: '#ff9800' },
        beleza: { name: 'Beleza & Cosméticos', icon: '💄', color: '#9c27b0' },
        alimentos: { name: 'Alimentos & Bebidas', icon: '🍫', color: '#4caf50' },
        esportes: { name: 'Esportes & Fitness', icon: '⚽', color: '#00bcd4' },
        pets: { name: 'Pet Shop', icon: '🐕', color: '#795548' },
        livros: { name: 'Livros & Papelaria', icon: '📚', color: '#607d8b' },
        agro: { name: 'Agro & Jardim', icon: '🌱', color: '#8bc34a' }
    },
    
    // Sales Channels
    channels: {
        online: { name: 'Loja Online', icon: '🛒', color: '#2196f3', percent: 50 },
        chat: { name: 'Nuvemchat', icon: '💬', color: '#4caf50', percent: 20 },
        pos: { name: 'Loja Física', icon: '🏪', color: '#ff9800', percent: 15 },
        social: { name: 'Redes Sociais', icon: '📱', color: '#e91e63', percent: 15 }
    },
    
    // Brazilian States
    states: {
        'AC': { name: 'Acre', region: 'norte' },
        'AL': { name: 'Alagoas', region: 'nordeste' },
        'AP': { name: 'Amapá', region: 'norte' },
        'AM': { name: 'Amazonas', region: 'norte' },
        'BA': { name: 'Bahia', region: 'nordeste' },
        'CE': { name: 'Ceará', region: 'nordeste' },
        'DF': { name: 'Distrito Federal', region: 'centro-oeste' },
        'ES': { name: 'Espírito Santo', region: 'sudeste' },
        'GO': { name: 'Goiás', region: 'centro-oeste' },
        'MA': { name: 'Maranhão', region: 'nordeste' },
        'MT': { name: 'Mato Grosso', region: 'centro-oeste' },
        'MS': { name: 'Mato Grosso do Sul', region: 'centro-oeste' },
        'MG': { name: 'Minas Gerais', region: 'sudeste' },
        'PA': { name: 'Pará', region: 'norte' },
        'PB': { name: 'Paraíba', region: 'nordeste' },
        'PR': { name: 'Paraná', region: 'sul' },
        'PE': { name: 'Pernambuco', region: 'nordeste' },
        'PI': { name: 'Piauí', region: 'nordeste' },
        'RJ': { name: 'Rio de Janeiro', region: 'sudeste' },
        'RN': { name: 'Rio Grande do Norte', region: 'nordeste' },
        'RS': { name: 'Rio Grande do Sul', region: 'sul' },
        'RO': { name: 'Rondônia', region: 'norte' },
        'RR': { name: 'Roraima', region: 'norte' },
        'SC': { name: 'Santa Catarina', region: 'sul' },
        'SP': { name: 'São Paulo', region: 'sudeste' },
        'SE': { name: 'Sergipe', region: 'nordeste' },
        'TO': { name: 'Tocantins', region: 'norte' }
    },
    
    // State Icons & Regional Elements
    stateIcons: {
        'SP': { icon: '🏙️', flag: '🔴⚪⚫', food: '🍕', drink: '☕', culture: 'Paulistano', greeting: 'E aí, mano!' },
        'RJ': { icon: '🏖️', flag: '🔵⚪', food: '🧀', drink: '🍺', culture: 'Carioca', greeting: 'E aí, parceiro!' },
        'MG': { icon: '⛰️', flag: '🔴⚪🟢', food: '🫘', drink: '☕', culture: 'Mineiro', greeting: 'Uai, sô!' },
        'RS': { icon: '🧉', flag: '🟢🔴🟡', food: '🥩', drink: '🧉', culture: 'Gaúcho', greeting: 'Bah, tchê!' },
        'BA': { icon: '🥁', flag: '🔴⚪🔵', food: '🍲', drink: '🥥', culture: 'Baiano', greeting: 'Ôxe, meu rei!' },
        'PE': { icon: '🎭', flag: '🔵⚪🟡', food: '🍰', drink: '🍹', culture: 'Pernambucano', greeting: 'Oxente!' },
        'CE': { icon: '☀️', flag: '🟢🟡⚪', food: '🦞', drink: '🥥', culture: 'Cearense', greeting: 'Oxe, cabra!' },
        'PR': { icon: '🌲', flag: '🟢⚪🔵', food: '🥟', drink: '☕', culture: 'Paranaense', greeting: 'E aí!' },
        'SC': { icon: '🏔️', flag: '🟢⚪🔴', food: '🦪', drink: '🍺', culture: 'Catarinense', greeting: 'Ô, loco!' },
        'GO': { icon: '🌾', flag: '🟢⚪🟡', food: '🍚', drink: '🥛', culture: 'Goiano', greeting: 'Uai, trem bão!' },
        'DF': { icon: '🏛️', flag: '⚪🟢🟡', food: '🍖', drink: '🧃', culture: 'Candango', greeting: 'E aí!' },
        'AM': { icon: '🌴', flag: '🔵🔴⚪', food: '🐟', drink: '🍹', culture: 'Amazonense', greeting: 'E aí, cunhado!' },
        'PA': { icon: '🦜', flag: '🔵🔴⚪', food: '🦀', drink: '🍹', culture: 'Paraense', greeting: 'Égua!' },
        'ES': { icon: '🏝️', flag: '🔵🔴⚪', food: '🦐', drink: '☕', culture: 'Capixaba', greeting: 'Poxa!' },
        'MT': { icon: '🐊', flag: '🔵🟢⚪', food: '🐟', drink: '🍺', culture: 'Mato-grossense', greeting: 'E aí!' },
        'MS': { icon: '🌿', flag: '🟢⚪🔵', food: '🍖', drink: '🍵', culture: 'Sul-mato-grossense', greeting: 'E aí!' },
        'RN': { icon: '🌅', flag: '🟢⚪', food: '🦐', drink: '🥥', culture: 'Potiguar', greeting: 'Oxe!' },
        'PB': { icon: '🎋', flag: '🔴⚪⚫', food: '🥘', drink: '🥥', culture: 'Paraibano', greeting: 'Oxente!' },
        'AL': { icon: '🏖️', flag: '🔵⚪🔴', food: '🦀', drink: '🥥', culture: 'Alagoano', greeting: 'Oxe!' },
        'SE': { icon: '🌊', flag: '🔵⚪🟢', food: '🦐', drink: '🥥', culture: 'Sergipano', greeting: 'Oxe!' },
        'PI': { icon: '🏜️', flag: '🟢🟡🔴', food: '🍖', drink: '🥛', culture: 'Piauiense', greeting: 'Égua!' },
        'MA': { icon: '🏝️', flag: '🔴⚪⚫', food: '🦀', drink: '🍹', culture: 'Maranhense', greeting: 'Égua!' },
        'RO': { icon: '🌳', flag: '🟢🔵🟡', food: '🐟', drink: '🍹', culture: 'Rondoniense', greeting: 'E aí!' },
        'AC': { icon: '🌲', flag: '🟢🟡🔴', food: '🐟', drink: '🍹', culture: 'Acreano', greeting: 'E aí!' },
        'RR': { icon: '🦋', flag: '🟢⚪🔵', food: '🐟', drink: '🍹', culture: 'Roraimense', greeting: 'E aí!' },
        'AP': { icon: '🐢', flag: '🔵⚪🟢', food: '🐟', drink: '🍹', culture: 'Amapaense', greeting: 'E aí!' },
        'TO': { icon: '🌻', flag: '🔵🟡⚪', food: '🍖', drink: '🍹', culture: 'Tocantinense', greeting: 'E aí!' }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, CONFIG };
}
