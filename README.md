# Bytebank — Tech Challenge Fase 3

**Bytebank** é uma aplicação de **gerenciamento financeiro mobile** desenvolvida como parte do **Tech Challenge da Pós-Tech em Front-end Engineering (FIAP)**.

Nesta fase, o projeto evolui para uma aplicação **mobile nativa com React Native**, integrando serviços em nuvem para oferecer uma experiência completa de gerenciamento financeiro, incluindo autenticação, persistência de dados e upload de comprovantes.

[Repositório no Github](https://github.com/PedroPA94/fiap-tech-challenge-4)

[Conheça a fase 3 do projeto](https://github.com/PedroPA94/fiap-tech-challenge-3)

## Desafios do projeto

### Fase 3 — Aplicação Mobile com Firebase e Funcionalidades Avançadas

Na Fase 3, o projeto foi expandido com:

- **Aplicação Mobile:** Desenvolvimento com React Native utilizando Expo
- **Autenticação:** Integração com Firebase Authentication
- **Persistência em Cloud:** Utilização do Cloud Firestore para armazenamento das transações
- **Gerenciamento de Estado:** Context API para controle global da aplicação
- **Validações:** Validação de campos no cadastro de transações
- **UX Mobile:** Interface adaptada para dispositivos móveis

## Funcionalidades da aplicação

A aplicação implementa as seguintes funcionalidades:

- **Autenticação:** Login de usuários com persistência de sessão
- **Dashboard:** Exibição de informações financeiras baseadas nas transações do usuário
- **Transações:**
  - Listagem de transações do usuário autenticado
  - Filtros por critérios como categoria e data

- **Gerenciamento de Transações:**
  - Criação de novas transações
  - Edição de transações existentes
  - Validação de dados

- **Anexos:**
  - Upload de comprovantes (imagem ou PDF)
  - Validação de tamanho de arquivo (até 300KB)

## Tecnologias utilizadas

- **React Native**
- **Expo**
- **Firebase (Auth, Firestore)**
- **Context API**
- **AsyncStorage**
- **Expo Router**
- **Expo Document Picker**
- **Expo File System**

## Configuração do Firebase

```js
const firebaseConfig = {
  apiKey: "AIzaSyASdG81ZzExByrwbZwWB-sPIfcZlz5j07g",
  authDomain: "fiap-tech-challenge-3-31728.firebaseapp.com",
  projectId: "fiap-tech-challenge-3-31728",
  storageBucket: "fiap-tech-challenge-3-31728.firebasestorage.app",
  messagingSenderId: "70615285266",
  appId: "1:70615285266:web:520d4759930324c69222cb",
  measurementId: "G-LX9PCCYMFE",
  databaseURL: "",
};
```

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/PedroPA94/fiap-tech-challenge-3.git
cd fiap-tech-challenge-3
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar a aplicação

```bash
npx expo start
```

### 4. Rodar no dispositivo

- Instale o **Expo Go** no celular
- Escaneie o QR Code exibido no terminal

## Demonstração

Vídeo demonstrando as principais funcionalidades da aplicação:

https://github.com/user-attachments/assets/4c407024-4288-4f91-ade2-1180eee01ca6

## Contribuições Futuras

As possibilidades de evolução do projeto incluem:

- Paginação ou scroll infinito otimizado
- Melhorias na experiência do usuário (UX/UI)
- Testes automatizados
- Personalização do dashboard pelo usuário
