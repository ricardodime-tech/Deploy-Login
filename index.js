const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const session = require('express-session');

const app = express();

// --- Configuração de Sessão ---
app.use(session({
    secret: 'chave-secreta-richard-field', // Use uma string aleatória e complexa
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // O cookie expira em 24 horas
        secure: false // Mude para 'true' se usar HTTPS (em produção)
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
        // SALVANDO NA SESSÃO
        req.session.userId = user._id;
        req.session.userEmail = user.email;
        res.redirect('/dashboard');
    } else {
        res.send("E-mail ou senha incorretos. <a href='/'>Tentar novamente</a>");
    }
});

// --- Rota Protegida (Só acessa se tiver o Cookie) ---
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // Se não estiver logado, volta para o login
    }
    res.send(`
        <h1>Bem-vindo à área restrita!</h1>
        <p>Logado como: ${req.session.userEmail}</p>
        <a href="/logout">Sair do sistema</a>
    `);
});

// --- Logout ---
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// --- app.listen(3000, () => console.log('Servidor com Cookies em http://localhost:3000'));
module.exports = app;