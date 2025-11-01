const db = require('../database/db');

exports.listBanco = (req, res) => {
    db.query('SELECT * FROM bancos', (err, results) => {
        if (err) throw err;
        res.render('verBanco', { data: results, title: 'Bancos' });
    });
};

exports.createBanco = (req, res) => {
    res.render('createbanco');
};

exports.saveBanco = (req, res) => {
    const { Nombre } = req.body;
    db.query('INSERT INTO bancos (Nombre) VALUES (?)', [Nombre], (err) => {
        if (err) throw err;
        res.redirect('/verBanco');
    });
};

exports.editBanco = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM bancos WHERE IdBanco = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editBanco', { banco: results[0] });
    });
};

exports.updateBanco = (req, res) => {
    const { Id, Nombre } = req.body;
    db.query('UPDATE bancos SET Nombre = ? WHERE IdBanco = ?', [Nombre, Id], (err) => {
        if (err) throw err;
        res.redirect('/verBanco');
    });
};

exports.deleteBanco = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM bancos WHERE IdBanco = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar banco:', err);
            return res.status(500).send('Error al eliminar banco');
        }
        res.redirect('/verBanco');
    });
};