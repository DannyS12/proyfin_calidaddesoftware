const db = require('../database/db'); 

// mostrar categorias
exports.listCatProd = (req, res) => {
    db.query('SELECT * FROM categorias', (err, results) => {
        if (err) throw err;
        res.render('verCatProd', { data: results, title: 'Categorías'});
    });
};

// Renderizar form para crear cat prod
exports.createCatProd = (req, res) => {
    res.render('createCatProd');
};

// Guardar cat prod
exports.saveCatProd = (req, res) => {
    const { Nombre } = req.body;
    db.query('INSERT INTO categorias (Nombre) VALUES (?)', [Nombre], (err) => {
        if (err) throw err;
        res.redirect('/verCatProd');
    });
};

// Editar categoría prod
exports.editCatProd = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM categorias WHERE IdCategoria = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editCatProd', { categoria: results[0] }); 
    });
};

// Actualizar categoria prod
exports.updateCatProd = (req, res) => {
    const { Id, Nombre } = req.body; 
    db.query('UPDATE categorias SET Nombre = ? WHERE IdCategoria = ?', [Nombre, Id], (err) => {
        if (err) throw err;
        res.redirect('/verCatProd');
    });
};

// Eliminar CAT PROD
exports.deleteCatProd = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM categorias WHERE IdCategoria = ?', [id], (err) => {
        if (err) {
            console.error('Error al eliminar categoría:', err);
            return res.status(500).send('Error al eliminar categoría');
        }
        res.redirect('/verCatProd');
    });
};