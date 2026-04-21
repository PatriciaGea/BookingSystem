# Sistema de Agendamento com Autenticação JWT

Sistema completo de agendamento com autenticação JWT, verificação de horários disponíveis e envio de e-mail de confirmação.

## 🚀 Funcionalidades

### Backend (Node.js + Express + MongoDB)
- ✅ Autenticação JWT com bcrypt
- ✅ Cadastro e login de usuários
- ✅ CRUD de agendamentos
- ✅ Verificação de conflito de horários
- ✅ Envio de e-mail de confirmação (Nodemailer)
- ✅ Middleware de autenticação para proteger rotas

### Frontend (React)
- ✅ Componente de Login
- ✅ Componente de Registro
- ✅ Formulário de Agendamento com verificação de horários ocupados
- ✅ Lista de agendamentos do usuário
- ✅ Dashboard com navegação por abas
- ✅ Gerenciamento de estado com localStorage

## 📋 Pré-requisitos

- Node.js 16+
- MongoDB Atlas (ou MongoDB local)
- Conta Gmail para envio de e-mails (ou outro provedor SMTP)

## ⚙️ Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd devClubCadastrouser-v2
```

### 2. Configure o Backend

```bash
# Entre na pasta da API
cd api_users

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Copie o arquivo .env.example para .env
cp .env.example .env

# Edite o arquivo .env com suas configurações:
# - MONGO_URI: String de conexão do MongoDB
# - JWT_SECRET: Chave secreta para JWT (pode ser qualquer string longa e aleatória)
# - EMAIL_USER: Seu email do Gmail
# - EMAIL_PASS: Senha de aplicativo do Gmail
```

### 3. Configure o Frontend

```bash
# Volte para a raiz do projeto
cd ..

# Instale as dependências
npm install
```

### 4. Configure o arquivo api.js

Edite `src/services/api.js` para apontar para seu backend:

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000' // URL do seu backend
})

export default api
```

## 🎯 Como Executar

### Executar o Backend

```bash
cd api_users
npm start
```

O servidor estará rodando em `http://localhost:3000`

### Executar o Frontend

Em outro terminal:

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🔑 Como Configurar Email (Gmail)

1. Acesse sua conta Google
2. Vá em **Segurança** → **Verificação em duas etapas** (ative se não estiver ativo)
3. Vá em **Senhas de app**: https://myaccount.google.com/apppasswords
4. Crie uma nova senha de aplicativo
5. Use essa senha no arquivo `.env` na variável `EMAIL_PASS`

## 📡 Endpoints da API

### Autenticação (Públicas)

#### POST /auth/register
Cadastra um novo usuário
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### POST /auth/login
Faz login e retorna JWT
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Agendamentos (Protegidas - Requer JWT)

#### POST /bookings
Cria um novo agendamento
```json
{
  "serviceSize": "medio",
  "bookingDate": "2026-03-15",
  "bookingTime": "14:00"
}
```

#### GET /bookings/my
Retorna os agendamentos do usuário logado

#### GET /bookings?date=2026-03-15
Retorna todos os agendamentos de uma data específica (para verificar horários ocupados)

#### DELETE /bookings/:id
Cancela um agendamento

## 🏗️ Estrutura do Projeto

```
devClubCadastrouser-v2/
├── api_users/                    # Backend
│   ├── models/
│   │   ├── user.js              # Modelo de usuário
│   │   └── booking.js           # Modelo de agendamento
│   ├── routes/
│   │   ├── auth.js              # Rotas de autenticação
│   │   ├── bookings.js          # Rotas de agendamento
│   │   └── users.js             # Rotas de usuários (legado)
│   ├── middleware/
│   │   └── auth.js              # Middleware JWT
│   ├── server.js                # Servidor Express
│   ├── db.js                    # Conexão MongoDB
│   └── package.json
├── src/                         # Frontend
│   ├── pages/
│   │   ├── Login/               # Tela de login
│   │   ├── Register/            # Tela de cadastro
│   │   ├── Dashboard/           # Dashboard principal
│   │   ├── BookingForm/         # Formulário de agendamento
│   │   └── MyBookings/          # Lista de agendamentos
│   ├── services/
│   │   └── api.js               # Configuração do Axios
│   └── main.jsx                 # Ponto de entrada React
└── package.json
```

## 🎨 Fluxo de Uso

1. **Registro**: Usuário cria conta com nome, email e senha
2. **Login**: Usuário faz login e recebe token JWT
3. **Dashboard**: Após login, usuário acessa dashboard com duas abas:
   - **Novo Agendamento**: Seleciona serviço, data e horário
     - Sistema mostra horários já ocupados
     - Ao criar, envia email de confirmação
   - **Meus Agendamentos**: Lista todos os agendamentos
     - Pode cancelar agendamentos
4. **Logout**: Remove token e volta para tela de login

## 🔒 Segurança

- Senhas criptografadas com bcrypt (10 rounds)
- JWT com expiração de 7 dias
- Middleware de autenticação protege rotas sensíveis
- Índice único no MongoDB para evitar duplo agendamento no mesmo horário
- CORS configurado para origens específicas

## 📝 Notas Importantes

- **Email**: O envio de email é opcional. Se falhar, o agendamento é criado mesmo assim
- **Horários**: O sistema oferece horários das 8h às 18h
- **Tamanhos de serviço**: pequeno, medio, grande
- **Conflitos**: Apenas um agendamento por horário é permitido

## 🐛 Troubleshooting

### Email não está sendo enviado
- Verifique se EMAIL_USER e EMAIL_PASS estão corretos no .env
- Use senha de aplicativo do Gmail, não a senha normal
- Verifique os logs do servidor para mais detalhes

### Erro de autenticação
- Verifique se o token está sendo salvo no localStorage
- Verifique se JWT_SECRET está configurado no .env
- Limpe o localStorage e faça login novamente

### Erro de conexão com API
- Verifique se o backend está rodando
- Verifique a URL em src/services/api.js
- Verifique se o CORS está configurado corretamente

## 📄 Licença

Este projeto é livre para uso educacional.
