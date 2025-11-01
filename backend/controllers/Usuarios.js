const db = require('../database/db');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas

// Crear nuevo usuario
exports.createUsuario = (req, res) => {
    res.render('createUsuario');
};

// Guardar nuevo usuario
exports.saveUsuario = (req, res) => {
    const { NombreUsuario, Contrasena, Rol, Nombre, Apellido, Email, Telefono } = req.body;
    const hashedPassword = bcrypt.hashSync(Contrasena, 10); // Encripta la contraseña

    const query = 'INSERT INTO usuarios (NombreUsuario, Contrasena, Rol, Nombre, Apellido, Email, Telefono, FechaRegistro) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())';
    db.query(query, [NombreUsuario, hashedPassword, Rol, Nombre, Apellido, Email, Telefono], (err) => {
        if (err) throw err;
        res.redirect('/verUsuario');
    });
};

exports.loginUsuario = (req, res) => {
    return res.render('login', { layout: false, title: 'Login', error: undefined, errors: [] });
};

// Autenticar usuario
exports.authUsuario = (req, res) => {
    const { NombreUsuario, Contrasena } = req.body;

    // Validación básica
    if (!NombreUsuario || !Contrasena) {
        return res.render('login', { 
            layout: false, 
            title: 'Login', 
            error: 'Usuario y contraseña son requeridos', 
            errors: [] 
        });
    }

    const query = 'SELECT * FROM usuarios WHERE NombreUsuario = ?';
    
    db.query(query, [NombreUsuario], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).render('login', {
                layout: false,
                title: 'Login',
                error: 'Error del servidor',
                errors: []
            });
        }

        if (results.length === 0) {
            // Usuario no encontrado
            return res.render('login', {
                layout: false,
                title: 'Login',
                error: 'Usuario no encontrado',
                errors: []
            });
        }

        const user = results[0];
        
        // Verificar contraseña
        bcrypt.compare(Contrasena, user.Contrasena, (bcryptErr, isMatch) => {
            if (bcryptErr) {
                console.error('Error comparando contraseñas:', bcryptErr);
                return res.status(500).render('login', {
                    layout: false,
                    title: 'Login',
                    error: 'Error del servidor',
                    errors: []
                });
            }

            if (isMatch) {
                // Contraseña correcta
                req.session.loggedIn = true;
                req.session.user = {
                    id: user.id,
                    NombreUsuario: user.NombreUsuario,
                    // No guardar la contraseña en sesión
                };

                // Guardar sesión antes de redirigir
                req.session.save((saveErr) => {
                    if (saveErr) {
                        console.error('Error guardando sesión:', saveErr);
                        return res.status(500).render('login', {
                            layout: false,
                            title: 'Login',
                            error: 'Error del servidor',
                            errors: []
                        });
                    }
                    return res.redirect('/dashboard');
                });

            } else {
                // Contraseña incorrecta - AQUÍ ESTABA EL ERROR
                return res.render('login', {
                    layout: false,
                    title: 'Login',
                    error: 'Contraseña incorrecta',
                    errors: []
                });
            }
        });
    });
};

// Cerrar sesión
exports.logoutUsuario = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
};

// Listar todos los usuarios
exports.listUsuarios = (req, res) => {
    db.query('SELECT IdUsuario, NombreUsuario, Rol, Nombre, Apellido, Email, Telefono, FechaRegistro FROM usuarios', (err, results) => {
        if (err) throw err;
        res.render('verUsuario', { data: results, title: 'Usuarios'});
    });
};

// Editar usuario
exports.editUsuario = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM usuarios WHERE IdUsuario = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editUsuario', { usuario: results[0] });
    });
};

// Actualizar un usuario
exports.updateUsuario = (req, res) => {
    const { IdUsuario, NombreUsuario, Rol, Nombre, Apellido, Email, Telefono } = req.body;
    db.query('UPDATE usuarios SET NombreUsuario = ?, Rol = ?, Nombre = ?, Apellido = ?, Email = ?, Telefono = ? WHERE IdUsuario = ?', 
    [NombreUsuario, Rol, Nombre, Apellido, Email, Telefono, IdUsuario], (err) => {
        if (err) throw err;
        res.redirect('/verUsuario');
    });
};

// Eliminar usuario
exports.deleteUsuario = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM usuarios WHERE IdUsuario = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/verUsuario');
    });
};