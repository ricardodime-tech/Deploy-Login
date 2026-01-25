const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const session = require('express-session');

const app = express();

// --- Configuração de Sessão ---
app.use(session({
    secret: 'chave-secreta-richard-field', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
        secure: false 
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Conexão MongoDB
const MONGODB_URI = "mongodb+srv://ricardodime_db_user:VRm9WGOwTzKb1fiq@cluster0.wxgj33t.mongodb.net/RichardFieldDB?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URI);

const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// --- Rotas de Autenticação ---

app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.send("<h2>Conta criada!</h2><a href='/'>Voltar para Login</a>");
    } catch (e) { res.status(500).send("Erro ao cadastrar."); }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.userEmail = user.email;
        // Redireciona para a rota /dashboard
        res.redirect('/dashboard');
    } else {
        res.send("E-mail ou senha incorretos. <a href='/'>Tentar novamente</a>");
    }
});

// --- Rota Protegida (Modificada para carregar dashboard.html) ---
app.get('/dashboard', (req, res) => {
    // Verifica se o usuário tem uma sessão ativa
    if (!req.session.userId) {
        return res.redirect('/'); 
    }
    // Envia o arquivo HTML físico em vez de uma string as
    res.sendFile(path.join(__dirname, '/dashboard.html'));
});

// --- Rota Auxiliar para pegar dados do usuário via Front-end ---
app.get('/api/user-data', (req, res) => {
    if (req.session.userId) {
        res.json({ email: req.session.userEmail });
    } else {
        res.status(401).json({ error: "Não autorizado" });
    }
});

// --- Logout ---
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// --- app.listen(3000, () => console.log('Servidor com Cookies em http://localhost:3000'));
module.exports = app;