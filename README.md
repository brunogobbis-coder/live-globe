# Nuvemshop Live Globe - Black Friday 2025

Uma página interativa inspirada no [Shopify BFCM Globe](https://bfcm.shopify.com/), adaptada com o look and feel da **Nuvemshop** usando o **Nimbus Design System**.

## 🚀 Demo

Abra o arquivo `index.html` em qualquer navegador moderno para ver a página em ação.

## ✨ Funcionalidades

- **Globo 3D Interativo**: Visualização em Three.js com rotação automática
- **Simulação de Vendas em Tempo Real**: Feed de vendas fictícias com animações
- **Estatísticas Dinâmicas**: Contador de vendas totais, pedidos e pedidos por minuto
- **Efeitos Visuais**: 
  - Partículas flutuantes
  - Pulsos animados nas localizações de vendas
  - Gradientes e efeitos de glow
- **Design Responsivo**: Adaptado para desktop, tablet e mobile
- **Tema Dark**: Consistente com páginas de eventos de e-commerce

## 🎨 Design System

O design utiliza as cores oficiais do **Nimbus Design System** da Nuvemshop:

| Token | Cor | Uso |
|-------|-----|-----|
| `--primary-interactive` | `#0059d5` | Elementos interativos principais |
| `--primary-hover` | `#00429f` | Estado hover |
| `--primary-light` | `#4d8fe8` | Destaques e acentos |
| `--success` | `#36b37e` | Indicadores de sucesso |
| `--neutral-text-high` | `#0a0a0a` | Texto principal |
| `--neutral-text-low` | `#5d5d5d` | Texto secundário |

## 🏙️ Cidades Incluídas

A simulação inclui 20 cidades da América Latina:
- Brasil: São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba, Porto Alegre, Recife, Salvador, Fortaleza, Brasília, Campinas
- Argentina: Buenos Aires, Córdoba, Rosario
- México: Cidade do México, Guadalajara, Monterrey
- Outros: Bogotá (Colômbia), Lima (Peru), Santiago (Chile), Medellín (Colômbia)

## 🛠️ Tecnologias

- **HTML5 / CSS3**: Estrutura e estilos
- **JavaScript ES6+**: Lógica e animações
- **Three.js r128**: Renderização 3D do globo
- **Google Fonts (Inter)**: Tipografia consistente com Nimbus

## 📱 Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| Desktop (> 1200px) | Layout completo com painel de vendas |
| Tablet (768px - 1200px) | Painel de vendas oculto |
| Mobile (< 768px) | Layout empilhado e compacto |

## 🔧 Personalização

### Alterar cores
Modifique as variáveis CSS no `:root` do arquivo `index.html`:

```css
:root {
    --primary-interactive: #0059d5;
    --primary-light: #4d8fe8;
    /* ... */
}
```

### Adicionar cidades
Adicione novos objetos ao array `CONFIG.cities`:

```javascript
{ name: 'Nova Cidade', country: 'País', lat: -23.5505, lng: -46.6333 }
```

### Alterar velocidade das vendas
Modifique o intervalo no `setInterval`:

```javascript
setInterval(addSale, 2000 + Math.random() * 2000); // 2-4 segundos
```

## 📄 Licença

Projeto criado para fins demonstrativos. As cores e identidade visual são propriedade da Nuvemshop.

---

Criado com ❤️ inspirado no ecossistema de e-commerce da América Latina.
