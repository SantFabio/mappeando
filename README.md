# 🗺️ Mappeando

Aplicação React que exibe um **mapa interativo de cursinhos populares** da Grande São Paulo. Roda como `<iframe>` dentro de um site Wix e recebe dados via `window.postMessage`.

---

## 📋 Índice

- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura e Fluxo de Dados](#-arquitetura-e-fluxo-de-dados)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Tipos (TypeScript)](#-tipos-typescript)
- [Hooks Customizados](#-hooks-customizados)
- [Componentes](#-componentes)
- [Assets (SVGs)](#-assets-svgs)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Build e Deploy](#-build-e-deploy)

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Para quê serve |
|---|---|---|
| **React** | 18 | Biblioteca principal de UI |
| **TypeScript** | 5 | Tipagem estática — previne erros em tempo de compilação |
| **Vite** | 7 | Bundler ultra-rápido + dev server com HMR |
| **TailwindCSS** | 4 (plugin Vite) | Classes utilitárias de CSS inline |
| **react-leaflet** | 5 | Componentes React para o mapa Leaflet |
| **Leaflet** | 1.9 | Biblioteca de mapas interativos (OpenStreetMap) |

---

## 🔄 Arquitetura e Fluxo de Dados

```
Site Wix (iframe pai)
        │
        │  window.postMessage({ cursinhos, filtros })
        ▼
┌─────────────────────────────────┐
│   React App (dentro do iframe)  │
│                                 │
│   usePostMessage() hook         │  ← escuta o evento 'message'
│         │                       │
│         ▼                       │
│       App.tsx                   │  ← componente raiz
│      /        \                 │
│  Legend     MapView             │  ← componentes visuais
│               │                 │
│           CourseCard            │  ← popup de cada marcador
└─────────────────────────────────┘
```

**Por que `postMessage`?**
O navegador bloqueia comunicação direta entre páginas de origens diferentes (política de mesma origem). O `postMessage` é a forma segura e oficial de enviar dados do Wix (pai) para o `<iframe>` (filho).

---

## 📁 Estrutura de Pastas

```
react-app/
├── public/
│   ├── test-sender.example.html  # Exemplo de como criar o simulador local
│   └── test-sender.html          # ← gerado localmente, no .gitignore
│
├── src/
│   ├── assets/                   # SVGs dos marcadores (ver seção Assets)
│   │   ├── leafGreen.svg
│   │   ├── leafOrange.svg
│   │   ├── leafYellow.svg
│   │   ├── leafletGreen.svg
│   │   ├── leafletOrange.svg
│   │   ├── leafletYellow.svg
│   │   └── leafShadow.svg
│   │
│   ├── components/
│   │   ├── CourseCard.tsx        # Popup de detalhes do cursinho
│   │   ├── Legend.tsx            # Barra de legenda
│   │   └── MapView.tsx           # Mapa principal
│   │
│   ├── hooks/
│   │   └── usePostMessage.ts     # Escuta mensagens do Wix
│   │
│   ├── types/
│   │   └── index.ts              # Interfaces TypeScript
│   │
│   ├── App.tsx                   # Componente raiz
│   ├── index.css                 # CSS global (Tailwind + Leaflet)
│   └── main.tsx                  # Ponto de entrada React
│
├── .gitignore
├── index.html                    # HTML base do Vite
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🏷️ Tipos (TypeScript)

> **Arquivo:** `src/types/index.ts`

Define a forma exata dos dados que chegam via `postMessage`. TypeScript usa essas interfaces para garantir que você nunca acesse uma propriedade inexistente.

---

### `Cursinho`
Representa um único cursinho no banco de dados do Wix.

```typescript
interface Cursinho {
  _id?: string;                              // ID único do Wix CMS
  nome?: string;                             // "Cursinho da Poli - USP"
  regiao?: string;                           // "Butantã, São Paulo, SP"
  enderecoCompleto?: string;                 // Endereço para exibição
  horario?: string;                          // "Seg. a sex. 18h – 22h"
  temProcessoSeletivo?: string;             // "Sim" | "Não"
  modalidadeRemota?: string;                // "Sim" | "Não"
  vagasDisponiveisPresencial?: string | number;
  vagasDisponiveisRemoto?: string | number;
  telefone?: string;
  email?: string;
  observacoes?: string;
  urlSite?: string;
  urlFacebook?: string;
  urlInstagram?: string;
  latitude?: number;                         // Coordenada geográfica
  longitude?: number;                        // Coordenada geográfica
}
```

> ⚠️ Todos os campos são opcionais (`?`) porque os dados do Wix nem sempre estão completos.

---

### `Cursinhos`
Agrupa os cursinhos por categoria.

```typescript
interface Cursinhos {
  gratuitos:  Cursinho[];   // 🌿 Sem custo
  caros:      Cursinho[];   // 🍊 Pagos, mas oferecem bolsa
  acessiveis: Cursinho[];   // 🌕 Pagos com mensalidade acessível
}
```

---

### `Endereco`
Estrutura do endereço retornado pelo componente de busca do Wix.

```typescript
interface Endereco {
  location?: {
    latitude: number;
    longitude: number;
  };
}
```

---

### `Filtros`
Configurações de filtragem enviadas pelo Wix junto com os dados.

```typescript
interface Filtros {
  tipoCurso?: 'checkboxTodos'
            | 'checkboxGratuitos'
            | 'checkboxPagosBolsa'
            | 'checkboxPagosAcessiveis';
  distancia?: number;              // Raio em km (ex: 10)
  endereco?: Endereco | string;   // Localização do usuário
}
```

---

### `PostMessageEvent`
Estrutura completa da mensagem recebida do Wix.

```typescript
interface PostMessageEvent {
  cursinhos: Cursinhos;
  filtros: Filtros;
}
```

---

## 🪝 Hooks Customizados

### `usePostMessage`
> **Arquivo:** `src/hooks/usePostMessage.ts`

Hook que fica "escutando" mensagens enviadas pelo site Wix (ou pela página de teste) e retorna os dados como estado React.

```typescript
function usePostMessage(): PostMessageEvent | null
```

**Como funciona internamente:**

```
1. Componente monta
        │
        ▼
2. useEffect registra: window.addEventListener('message', handler)
        │
        ▼
3. Wix envia: iframe.postMessage({ cursinhos, filtros }, '*')
        │
        ▼
4. handler() valida se a mensagem tem { cursinhos, filtros }
        │
        ▼
5. setData(payload) → React re-renderiza o mapa
        │
        ▼
6. Componente desmonta → removeEventListener() (cleanup)
```

**Uso no App.tsx:**
```tsx
const data = usePostMessage();
// data é null até o Wix enviar a primeira mensagem
const cursinhos = data?.cursinhos ?? { gratuitos: [], caros: [], acessiveis: [] };
const filtros   = data?.filtros   ?? { tipoCurso: 'checkboxTodos', distancia: 10 };
```

> **Por que `useEffect` e não `useState` direto?**
> Eventos de janela são efeitos colaterais externos ao React. O `useEffect` garante que o listener seja registrado após a montagem e removido antes da desmontagem, evitando memory leaks.

---

## 🧩 Componentes

### `App`
> **Arquivo:** `src/App.tsx`

Componente raiz. Orquestra todos os outros — obtém os dados via hook e distribui para os filhos.

```
App
 ├── usePostMessage()    ← obtém dados do Wix
 ├── <Legend />          ← barra de legenda fixa (48px)
 └── <MapView />         ← mapa (altura = 100vh - 48px)
```

**Detalhe importante — heights explícitas:**
```tsx
// Legenda com altura fixa em px
<div style={{ height: 48, flexShrink: 0 }}>
  <Legend />
</div>

// Mapa com o restante exato da tela
<div style={{ height: 'calc(100vh - 48px)' }}>
  <MapView ... />
</div>
```
> ⚠️ O Leaflet **exige** que seu container tenha altura calculável. Se o container tiver `height: 0` ou `height: auto`, o mapa não renderiza.

---

### `Legend`
> **Arquivo:** `src/components/Legend.tsx`

Barra de legenda no topo do mapa, explicando o significado de cada cor de marcador.

**O que renderiza:**
```
🌿 Cursos gratuitos   🍊 Cursos pagos   🌕 Cursos pagos acessíveis
```

**Recursos usados:**
- SVGs importados de `src/assets/` (folhas sem o ramo)

```tsx
// Exemplo de uso no componente
<div className="flex items-center gap-2 hover:scale-105 transition-transform">
  <img src={leafGreen} />
  <span>Cursos gratuitos</span>
</div>
```

---

### `MapView`
> **Arquivo:** `src/components/MapView.tsx`

O componente mais complexo. Renderiza o mapa Leaflet com todos os marcadores, lida com filtragem e localização do usuário.

**Sub-componentes internos:**

#### `FlyTo` (interno)
Move a câmera do mapa para a localização do usuário quando ela muda.

```typescript
// Usa useEffect (não useMemo!) para não causar efeito colateral em render
function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();         // hook do react-leaflet — acessa a instância do mapa
  const prevRef = useRef(null); // guarda posição anterior para evitar re-fly desnecessário

  useEffect(() => {
    if (posição mudou) {
      map.setView([lat, lon], zoom);
    }
  }, [lat, lon, map]);
}
```

> **Por que `useRef` aqui?**  
> Para comparar a posição nova com a anterior sem causar re-render. `setState` causaria loop infinito.

#### `Markers` (interno)
Renderiza a lista de marcadores de uma categoria.

```tsx
function Markers({ lista, icon }) {
  return lista
    .filter(c => coordenadas válidas)
    .map(c => (
      <Marker position={[c.latitude, c.longitude]} icon={icon}>
        <Popup>
          <CourseCard cursinho={c} />
        </Popup>
      </Marker>
    ));
}
```

**Lógica de filtragem:**

```
Recebe filtros do Wix
        │
        ├─ tem localização? ──► filtra por distância (Haversine)
        │                        ↓
        │              só mostra cursinhos dentro do raio
        │
        └─ qual tipoCurso?  ──► mostra só a categoria selecionada
                                 (gratuitos | caros | acessiveis | todos)
```

**Fórmula de Haversine** (distância entre dois pontos geográficos):
```typescript
function distKm(lat1, lon1, lat2, lon2): number {
  const R = 6371; // raio da Terra em km
  // ... cálculo trigonométrico
  return distância em km;
}
```

---

### `CourseCard`
> **Arquivo:** `src/components/CourseCard.tsx`

Conteúdo do popup que aparece ao clicar em um marcador no mapa.

**O que exibe:**
- Nome e região
- Endereço completo
- Horário de funcionamento
- Processo seletivo
- Modalidade remota
- Vagas presenciais e remotas
- Telefone e e-mail
- Observações (se houver)
- Links: Site oficial, Facebook, Instagram

**Renderização condicional:**
```tsx
{cursinho.observacoes && (
  <p>Observação: {cursinho.observacoes}</p>
)}
// Só mostra se o campo existir — evita "undefined" na tela
```

---

## 🖼️ Assets (SVGs)

> **Pasta:** `src/assets/`

Todos os SVGs foram criados no Figma e são importados diretamente nos componentes.

| Arquivo | Tamanho aprox. | Uso |
|---|---|---|
| `leafGreen.svg` | 165×173px | Legenda — folha verde 🌿 |
| `leafOrange.svg` | 165×173px | Legenda — folha laranja 🍊 |
| `leafYellow.svg` | 165×173px | Legenda — folha amarela 🌕 |
| `leafletGreen.svg` | 175×439px | Pin do mapa — folha verde + ramo |
| `leafletOrange.svg` | 175×439px | Pin do mapa — folha laranja + ramo |
| `leafletYellow.svg` | 175×439px | Pin do mapa — folha amarela + ramo |
| `leafShadow.svg` | 50×64px | Sombra embaixo dos pins |

**Como os SVGs são usados:**

```typescript
// Em Legend.tsx — importa como URL de imagem
import leafGreen from '../assets/leafGreen.svg';
<img src={leafGreen} width={25} height={26} />

// Em MapView.tsx — cria ícone Leaflet
import leafletGreenUrl from '../assets/leafletGreen.svg';
const iconGreen = L.icon({
  iconUrl:      leafletGreenUrl,  // URL gerada pelo Vite
  shadowUrl:    leafShadowUrl,
  iconSize:     [38, 95],         // largura x altura em px no mapa
  iconAnchor:   [19, 94],         // ponto do ícone que fica sobre a coordenada
  shadowAnchor: [4, 62],          // ponto da sombra alinhado ao ícone
  popupAnchor:  [0, -80],         // onde o popup abre em relação ao ícone
});
```

> **Como o Vite processa SVGs?**
> Por padrão, o Vite transforma `import foo from './foo.svg'` em uma URL pública (ex: `/assets/leafGreen-AbCd1234.svg`). Isso funciona com `<img src={foo}>` e com `L.icon({ iconUrl: foo })`.

---

## 🚀 Como Rodar Localmente

### 1. Instalar dependências
```bash
cd react-app
npm install
```

### 2. Criar o simulador do Wix
O arquivo `test-sender.html` fica no `.gitignore` (contém dados reais). Crie um a partir do exemplo:
```bash
cp public/test-sender.example.html public/test-sender.html
```
Edite o `test-sender.html` e adicione os dados dos cursinhos no formato descrito no exemplo.

### 3. Iniciar o dev server
```bash
npm run dev
```

### 4. Acessar
| URL | O quê |
|---|---|
| `http://localhost:5173` | O mapa (sem dados — aguarda postMessage) |
| `http://localhost:5173/test-sender.html` | Simulador do Wix com controles |

---

## 📜 Scripts Disponíveis

```bash
npm run dev      # Inicia o dev server (HMR ativado)
npm run build    # Compila TypeScript + gera a pasta dist/
npm run preview  # Serve a pasta dist/ localmente para testar o build
```

---

## 📦 Build e Deploy

```bash
npm run build
```

Gera a pasta `dist/` pronta para servir como site estático. Qualquer CDN ou hosting estático funciona (GitHub Pages, Vercel, Netlify, etc.).

Para usar no Wix:
1. Faça o deploy do `dist/` em algum host (ex: GitHub Pages)
2. No Wix, adicione um componente HTML/iframe apontando para a URL publicada
3. No código Velo do Wix, use `iframe.postMessage({ cursinhos, filtros }, '*')` para enviar os dados

---

## 🤝 ONG Semeando Educação

Os dados dos cursinhos são gerenciados pela ONG e servidos via **Wix CMS**. Este repositório contém apenas a interface do mapa — os dados não ficam hardcoded aqui por questão de controle e privacidade.
