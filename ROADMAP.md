# 💡 Ideias de Produto — Mapa Universal

---

## 👥 Quem usaria? (Público-alvo)

- **🚀 Startups e Pequenos Negócios**: Para exibir redes de lojas, pontos de retirada ou áreas de atendimento.
- **🌱 ONGs e Projetos Sociais**: Mapeamento de serviços gratuitos, pontos de doação ou suporte comunitário.
- **🎉 Organizadores de Eventos**: Mapas dinâmicos de festivais, feiras ou conferências (palcos, stands, utilidades).
- **📝 Criadores de Conteúdo**: "Guias de viagem" interativos ou mapeamento de nicho (ex: melhores cafés, parques pet-friendly).
- **🏠 Mercado Imobiliário**: Exibição de imóveis e infraestrutura do entorno (escolas, parques, mercados).
- **🛠️ Agências Web/Freelancers**: Uma solução de mapa customizável e fácil de integrar via widget para clientes.

---

## Visão Geral
Transformar o projeto atual em um **widget de mapa genérico e configurável**, onde qualquer usuário define suas próprias categorias e marcações — sem código.

---

## Funcionalidades Planejadas

### 🖱️ Adicionar marcações pelo mapa
- Usuário clica em um ponto do mapa
- Abre um **modal** para preencher as informações do marcador:
  - Nome / Label
  - Categoria (com cor/ícone)
  - Descrição (opcional)
  - Coordenadas (preenchidas automaticamente pelo clique)

### 📂 Importação via Excel
- Usuário faz upload de um arquivo `.xlsx` no **formato definido pelo projeto**
- O sistema lê o arquivo e cria os marcadores automaticamente
- Formato esperado a definir (ex: colunas: `nome`, `lat`, `lng`, `categoria`)

### 🗂️ Sessão por usuário
- Cada sessão de usuário tem suas **próprias marcações** (sem persistência entre sessões por enquanto)
- Armazenamento via `localStorage` ou estado em memória
- **Nada é compartilhado entre usuários** (por ora)

### 🏷️ Categorias configuráveis
- Usuário define quantas categorias quiser
- Cada categoria tem: nome, cor, ícone (opcional)
- Schema genérico (sem "cursinhos", "gratuitos" etc. hardcoded)

---

## 🔐 Features com Backend
- **Login** — usuário acessa suas marcações de qualquer dispositivo
- **Compartilhar mapa via link** — link público ou privado para o mapa
- **Controle de permissão no compartilhamento** — "só visualizar" ou "pode editar"
- **Múltiplos mapas por usuário** — cada mapa com tema e categorias próprios
- **Colaboração entre usuários** — edição simultânea em tempo real (WebSockets)
- **Comentários nos marcadores** — colaboradores deixam notas em pontos específicos

## 💡 Mais Ideias
- **Dashboard de estatísticas** — total de marcadores por categoria, mapa de calor
- **Busca de endereço** — digitar endereço e o mapa navega até ele (geocoding)
- **Exportação** — baixar mapa como imagem (PNG) ou dados como Excel/JSON
- **Temas visuais** — modo escuro, cores customizáveis do mapa
- **PWA** — funciona offline, instalável no celular
- **Embedável via `postMessage`** — integrável em Wix, Webflow, etc.

---

## 🚦 Plano de Fases

### Fase 1 — Frontend Universal _(sem backend)_
> Refatora o projeto atual para ser genérico e usa `localStorage` para persistência.
- [ ] Remover conceito de "cursinhos" do código (tudo genérico)
- [ ] Clicar no mapa → modal para adicionar marcação (nome, categoria, descrição)
- [ ] Categorias configuráveis pelo usuário (nome + cor)
- [ ] Marcações salvas no `localStorage` por sessão
- [ ] Import de Excel no formato definido (`xlsx`)
- [ ] Busca de endereço no mapa (geocoding)

### Fase 2 — Backend + Autenticação
> Introduz backend para persistência real e login.
- [ ] Escolher stack (ex: Node.js + PostgreSQL ou Firebase)
- [ ] Login (Google OAuth ou e-mail/senha)
- [ ] Múltiplos mapas por usuário
- [ ] Dados salvos no banco, acessíveis em qualquer dispositivo

### Fase 3 — Compartilhamento
> Permite que mapas sejam compartilhados.
- [ ] Compartilhar mapa via link
- [ ] Controle de permissão: "só visualizar" ou "pode editar"
- [ ] Comentários nos marcadores

### Fase 4 — Colaboração e Extras
> Edição em tempo real e funcionalidades avançadas.
- [ ] Colaboração em tempo real (WebSockets)
- [ ] Dashboard de estatísticas / mapa de calor
- [ ] Exportação (PNG, Excel, JSON)
- [ ] Temas visuais (modo escuro, cores do mapa)
- [ ] PWA (offline + instalável no celular)
- [ ] **Integrações** — usar o mapa como widget embedável em qualquer plataforma:
  - Via `<iframe>` (qualquer site)
  - Via `postMessage` (Wix, Webflow, etc.)
  - Via snippet de código gerado automaticamente (`<script>` tag)
