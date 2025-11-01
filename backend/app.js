const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Layouts globales (OK)
app.use(expressLayouts);
app.set('layout', 'layout');

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Middlewares previos
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔹 Configuración de sesión
app.use(session({
    secret: '9a8d12c6ae280739cf1a06e6b5e90ec2d1dbca90351e21491895a88669ce6e86224bdece575797518a94debe8c9f3d1e57ea7f4a08c35bb8d18f8972a82c939',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true solo en producción con HTTPS
        httpOnly: true,
        sameSite: 'lax', // 🔒 Protección CSRF básica
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// 🔹 Middleware para exponer sesión a las vistas (DEBE ir después de session)
app.use((req, res, next) => {
  res.locals.loggedIn = !!req.session.loggedIn;
  res.locals.user = req.session.user || null;
  next();
});

// 🔹 Ruta raíz: redirige a /login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// 🔹 Rutas principales
app.use('/', router);

// 🔹 Middleware de manejo de errores (debe ir al final)
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err.stack);
  const isLogin = req.path === '/login' || req.originalUrl === '/login';
  res.status(500).render('partials/error', {
    layout: isLogin ? false : 'layout',
    message: 'Algo salió mal en el servidor.',
    error: process.env.NODE_ENV === 'development' ? err : {} // 🔒 No exponer stack en producción
  });
});

// Exportamos app para pruebas
module.exports = app;

// Ejecutamos el servidor solo si no es una prueba
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    const baseUrl = `http://localhost:${PORT}`;
    const loginUrl = `${baseUrl}/login`;

    app.listen(PORT, () => {
        console.log(`✅ Servidor Backend corriendo en: \x1b[36m${baseUrl}\x1b[0m`);
        console.log(`🔑 Accede al sistema aquí: \x1b[32m\x1b[4m${loginUrl}\x1b[0m`);
        console.log(`📁 Vistas: ${path.join(__dirname, '../frontend/views')}`);
        console.log(`🌐 Archivos estáticos: ${path.join(__dirname, '../frontend/public')}`);
    });
}