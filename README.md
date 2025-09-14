# ⚽ SmartLeague - Sistema de Gerenciamento de Liga

> Sistema moderno de gerenciamento de liga de futebol construído com Angular 19, Angular Material e Bootstrap

## 📋 Sobre o Projeto

O SmartLeague é um sistema completo de gerenciamento de liga de futebol que oferece funcionalidades mockadas para demonstrar as capacidades modernas do Angular 19. O projeto utiliza as mais recentes tecnologias Angular com foco em performance, usabilidade e manutenibilidade.

## ✨ Funcionalidades Principais

### 🏆 **Gerenciamento de Times e Jogadores**
- Cadastro completo de times com informações detalhadas
- Sistema de registro de jogadores com posições e estatísticas
- Formulários reativos com validação completa
- Interface responsiva com Angular Material

### ⚽ **Sistema de Partidas**
- Agendamento de partidas entre times
- Registro de eventos (gols, cartões, substituições)
- Acompanhamento de partidas ao vivo
- Histórico completo de resultados

### 📊 **Classificação e Rankings**
- Tabela de classificação atualizada automaticamente
- Ranking de artilheiros e assistências
- Estatísticas detalhadas por time e jogador
- Cálculo automático de pontos e saldo de gols

### 🔔 **Sistema de Notificações**
- Notificações em tempo real sobre partidas
- Alertas sobre eventos importantes
- Sistema de preferências por time
- Interface intuitiva para gerenciamento

### 📈 **Relatórios e Estatísticas**
- Relatórios detalhados por jogador
- Análises de desempenho por time
- Estatísticas da liga completa
- Exportação simulada para PDF/CSV

## 🚀 Tecnologias Utilizadas

### **Core**
- **Angular 19** - Framework principal com sintaxe moderna (@if, @for)
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **Angular Signals** - Gerenciamento de estado reativo

### **UI/UX**
- **Angular Material 19** - Componentes de interface
- **Bootstrap 5** - Sistema de grid e utilitários
- **Flexbox** - Layout responsivo
- **SCSS** - Pré-processador CSS

### **Funcionalidades Avançadas**
- **Standalone Components** - Arquitetura moderna
- **Signals** - Estado reativo centralizado
- **Services Mockados** - Simulação de backend
- **Formulários Reativos** - Validação e controle

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                    # Serviços centrais
│   │   └── services/            # Services globais (team, match, ranking, etc.)
│   ├── shared/                  # Recursos compartilhados
│   │   ├── components/          # Componentes reutilizáveis
│   │   └── interfaces/          # Interfaces TypeScript
│   ├── features/                # Módulos de funcionalidades
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── teams/               # Gerenciamento de times
│   │   ├── matches/             # Sistema de partidas
│   │   ├── ranking/             # Classificação e rankings
│   │   ├── notifications/       # Sistema de notificações
│   │   └── reports/             # Relatórios e estatísticas
│   └── layout/                  # Componentes de layout
└── assets/                      # Recursos estáticos
```

## 🛠️ Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Angular CLI 19

### **Instalação**

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd smart-league

# Instale as dependências 
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### **Comandos Disponíveis**

```bash
# Servidor de desenvolvimento
npm start
# ou
ng serve

# Acesse: http://localhost:4200

# Build de produção
npm run build

# Verificação de código
npm run lint
```

## 🎯 Funcionalidades por Módulo

### **Dashboard (`/dashboard`)**
- Visão geral do sistema
- Estatísticas em tempo real
- Ações rápidas
- Cards informativos

### **Times (`/teams`)**
- Listagem de times cadastrados
- Formulário de criação de times
- Detalhes e estatísticas
- Gerenciamento de jogadores

### **Jogadores (`/players`)**
- Cadastro de jogadores
- Listagem com filtros
- Estatísticas individuais
- Associação com times

### **Partidas (`/matches`)**
- Agendamento de jogos
- Registro de eventos
- Partidas ao vivo
- Histórico de resultados

### **Classificação (`/ranking`)**
- Tabela da liga
- Ranking de artilheiros
- Ranking de assistências
- Estatísticas gerais

### **Notificações (`/notifications`)**
- Central de notificações
- Alertas em tempo real
- Preferências por time
- Histórico de mensagens

### **Relatórios (`/reports`)**
- Relatórios por jogador
- Análises por time
- Estatísticas da liga
- Exportação de dados

## 🎨 Características do Design

### **Cores Principais**
- **Primary**: Blue (#1976d2)
- **Accent**: Green (#4caf50)
- **Warn**: Red (#f44336)
- **Background**: Light Gray (#f5f5f5)

### **Componentes Reutilizáveis**
- Cards responsivos para times e jogadores
- Tabelas com ordenação e filtros
- Formulários com validação em tempo real
- Notificações e feedbacks visuais

## 🔧 Configurações Importantes

### **Angular 19 Features**
- Uso de `@if` e `@for` em vez de `*ngIf` e `*ngFor`
- Standalone components em toda aplicação
- Angular Signals para estado reativo
- Nova sintaxe de controle de fluxo

### **Services Mockados**
- **TeamService** - Gerenciamento de times e jogadores
- **MatchService** - Sistema de partidas e eventos
- **RankingService** - Cálculo de classificações
- **NotificationService** - Sistema de notificações
- **ReportService** - Geração de relatórios

## 📱 Responsividade

O projeto é totalmente responsivo, suportando:
- **Desktop** (1200px+) - Layout completo com sidebar
- **Tablet** (768px-1199px) - Layout adaptado
- **Mobile** (< 768px) - Interface otimizada para toque

## 🚀 Próximos Passos

Para transformar este projeto em um sistema real:

1. **Backend Integration** - Conectar com APIs reais
2. **Autenticação** - Sistema de login e permissões
3. **Real-time Updates** - WebSocket para atualizações em tempo real
4. **Imagens** - Upload e gerenciamento de imagens
5. **PWA** - Transformar em Progressive Web App

## 📄 Licença

Este projeto foi desenvolvido como demonstração das capacidades do Angular 19 e está disponível para uso educacional e comercial.

---

**Desenvolvido com ❤️ usando Angular 19**
