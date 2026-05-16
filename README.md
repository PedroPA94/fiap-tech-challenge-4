# Bytebank — Tech Challenge Fase 4

**Bytebank** é uma aplicação de **gerenciamento financeiro mobile** desenvolvida como parte do **Tech Challenge da Pós-Tech em Front-end Engineering (FIAP)**.

Nesta fase, o projeto evolui a aplicação mobile criada anteriormente, incorporando melhorias de **arquitetura**, **gerenciamento de estado**, **segurança**, **performance**, **cache** e **organização do código**, seguindo princípios de **Clean Architecture**.

[Repositório no GitHub](https://github.com/PedroPA94/fiap-tech-challenge-4)

[Conheça a fase anterior do projeto](https://github.com/PedroPA94/fiap-tech-challenge-3)

## Fase 4 — Arquitetura, Segurança e Performance

Na Fase 4, o projeto foi refatorado e aprimorado com foco em:

- **Clean Architecture:** separação entre domínio, aplicação, infraestrutura e apresentação
- **Arquitetura modular:** melhor organização das responsabilidades do código
- **State Management avançado:** migração de Context API para Redux Toolkit
- **Segurança:** armazenamento seguro de sessão com `expo-secure-store`
- **Criptografia:** criptografia de comprovantes antes da persistência
- **Performance:** paginação, memoização, debounce e otimizações de lista
- **Cache:** cache local para dados derivados do dashboard
- **Programação reativa:** interface orientada a estado, eventos e atualizações controladas

---

## Funcionalidades da aplicação

A aplicação implementa as seguintes funcionalidades:

- **Autenticação**
  - Login de usuários
  - Cadastro de novos usuários
  - Persistência segura da sessão

- **Dashboard**
  - Exibição do saldo financeiro
  - Resumo de receitas e despesas
  - Gráficos de fluxo mensal
  - Gráfico de despesas por categoria

- **Transações**
  - Listagem de transações do usuário autenticado
  - Paginação / scroll infinito
  - Filtro por categoria
  - Filtro por data
  - Busca textual com debounce

- **Gerenciamento de transações**
  - Criação de novas transações
  - Edição de transações existentes
  - Validação e sanitização de dados

- **Comprovantes**
  - Upload de comprovantes em imagem ou PDF
  - Validação de tipo e tamanho do arquivo
  - Criptografia antes da persistência no Firestore

## Tecnologias utilizadas

- **React Native**
- **Expo SDK 54**
- **Expo Router**
- **Firebase Authentication**
- **Cloud Firestore**
- **Redux Toolkit**
- **React Redux**
- **AsyncStorage**
- **Expo Secure Store**
- **Expo Document Picker**
- **Expo File System**
- **CryptoJS**
- **React Native Gifted Charts**
- **React Native Reanimated**

## Evoluções em relação à Fase 3

Na Fase 3, a aplicação utilizava uma estrutura mais simples baseada em telas, contextos e serviços.

Na Fase 4, a aplicação foi reorganizada em camadas:

```txt
src/
├── application/      # Casos de uso da aplicação
├── domain/           # Entidades e regras de negócio
├── infrastructure/   # Firebase, segurança, cache e serviços externos
└── presentation/     # Telas, componentes, hooks e estado global
```

Principais evoluções:

- Migração de **Context API** para **Redux Toolkit**
- Criação de entidades de domínio, como `User`, `Transaction`, `Summary` e `Analytics`
- Criação de casos de uso para autenticação, transações, resumo e analytics
- Repositórios Firebase isolados na camada de infraestrutura
- Container de dependências para reduzir acoplamento com implementações concretas
- Cache local para dados derivados do dashboard
- Armazenamento seguro da sessão com `expo-secure-store`
- Criptografia de comprovantes com `crypto-js`
- Melhorias de performance em listas, filtros e carregamento de dados

## Segurança

Foram aplicadas melhorias relacionadas à segurança da aplicação:

- Autenticação com **Firebase Authentication**
- Armazenamento seguro da sessão com **expo-secure-store**
- Separação entre dados de sessão e cache local
- Validação de senha no cadastro
- Sanitização de campos de entrada
- Criptografia de comprovantes antes da persistência no Firestore
- Uso de variáveis de ambiente para configurações do Firebase e criptografia

## Performance e otimização

Foram aplicadas melhorias para reduzir processamento desnecessário e melhorar a experiência do usuário:

- Paginação de transações
- Scroll infinito com `FlatList`
- Debounce na busca de transações
- Carregamento paralelo de dados do dashboard
- Renderização condicional dos gráficos
- Cache local para dados do dashboard

## Programação reativa

A aplicação utiliza conceitos de programação reativa por meio de:

- Estado global com Redux Toolkit
- Hooks para acesso e reação ao estado da aplicação
- Atualização automática da interface conforme mudanças de dados
- Debounce na busca de transações
- Renderização condicional baseada em estados de carregamento e disponibilidade de dados

## Qualidade e segurança de dependências

Foram utilizadas ferramentas de análise para apoiar a qualidade do projeto.

### Snyk

O projeto foi analisado com **Snyk** para identificação de vulnerabilidades em dependências.

Foram identificadas vulnerabilidades transitivas em pacotes internos do ecossistema Expo/React Native, como `inflight`, `postcss` e `uuid`.

As correções sugeridas exigem atualização para versões associadas ao **Expo SDK 55** ou versões superiores do React Native. Como a entrega utiliza **Expo Go com SDK 54**, essas atualizações foram mantidas fora do escopo para manter a compatibilidade da aplicação.

### SonarQube

O projeto também foi analisado com **SonarQube** para identificação de pontos de melhoria relacionados à qualidade de código.

Alguns apontamentos ainda serão tratados em melhorias futuras.

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/PedroPA94/fiap-tech-challenge-4.git
cd fiap-tech-challenge-4
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto e preencha as variáveis necessárias para Firebase e criptografia.

### 4. Executar a aplicação

```bash
npx expo start
```

### 5. Rodar no dispositivo

- Instale o **Expo Go** no celular
- Escaneie o QR Code exibido no terminal
- A aplicação será carregada no dispositivo
