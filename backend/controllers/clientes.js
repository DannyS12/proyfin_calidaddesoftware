const db = require('../database/db');

exports.listCliente = (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
        if (err) throw err;
        res.render('verCliente', { data: results, title: 'Clientes' });
    });
};

exports.createCliente = (req, res) => {
    res.render('createCliente');
};

exports.saveCliente = (req, res) => {
    const { Nombre, Direccion, Telefono, Email, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza } = req.body;
    db.query('INSERT INTO clientes (Nombre, Direccion, Telefono, Email, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [Nombre, Direccion, Telefono, Email, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza], 
    (err) => {
        if (err) throw err;
        res.redirect('/verCliente');
    });
};

exports.editCliente = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM clientes WHERE IdCliente = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editCliente', { cliente: results[0] });
    });
};

exports.updateCliente = (req, res) => {
    const { Id, Nombre, Direccion, Telefono, Email, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza } = req.body;
    db.query('UPDATE clientes SET Nombre = ?, Direccion = ?, Telefono = ?, Email = ?, Sexo = ?, NIT = ?, CUI = ?, SeguroMedico = ?, NumeroPoliza = ? WHERE IdCliente = ?', 
    [Nombre, Direccion, Telefono, Email, Sexo, NIT, CUI, SeguroMedico, NumeroPoliza, Id], 
    (err) => {
        if (err) throw err;
        res.redirect('/verCliente'); 
    });
};


exports.deleteCliente = (req, res) => {
    const id = req.params.id; 
    db.query('DELETE FROM clientes WHERE IdCliente = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar cliente:', err);
            return res.status(500).send('Error al eliminar cliente');
        }
        res.redirect('/verCliente');
    });
};