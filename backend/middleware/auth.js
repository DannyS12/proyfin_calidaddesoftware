// middleware/auth.js
function isAuthenticated(req, res, next) {
    if (req.session.loggedIn) {
        // Si el usuario está autenticado, continuar con la siguiente función de middleware
        return next();
    } else {
        // Si no está autenticado, redirigir al inicio de sesión
        return res.redirect('/login');
    }
}


module.exports = isAuthenticated;