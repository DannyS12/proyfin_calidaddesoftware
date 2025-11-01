const db = require('../database/db');

// ver pagos clientes
exports.listPago = (req, res) => {
    db.query('SELECT * FROM pagos', (err, results) => {
        if (err) throw err;
        res.render('verPago', { data: results, title: 'Pagos'});
    });
};

// crear pago 
exports.createPago = (req, res) => {
    // selectr de ventas, usuarios, y bancos
    db.query('SELECT * FROM ventas', (errVentas, ventas) => {
        if (errVentas) throw errVentas;
        db.query('SELECT * FROM bancos', (errBancos, bancos) => {
            if (errBancos) throw errBancos;
            db.query('SELECT * FROM usuarios', (errUsuarios, usuarios) => {
                if (errUsuarios) throw errUsuarios;
                res.render('createPago', { ventas, bancos, usuarios });
            });
        });
    });
};

// Guardar pago
exports.savePago = (req, res) => {
    const { IdVenta, Fecha, FormaPago, Monto, IdBanco, NumeroReferencia, IdUsuario } = req.body;

    // calculo para saldo pendiente
    db.query('SELECT Total FROM ventas WHERE IdVenta = ?', [IdVenta], (err, results) => {
        if (err) throw err;
        const Total = results[0].Total;
        const SaldoPendiente = Total - Monto;

        db.query('INSERT INTO pagos (IdVenta, Fecha, FormaPago, Monto, SaldoPendiente, IdBanco, NumeroReferencia, IdUsuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [IdVenta, Fecha, FormaPago, Monto, SaldoPendiente, IdBanco, NumeroReferencia, IdUsuario], 
        (err) => {
            if (err) throw err;
            res.redirect('/verPago');
        });
    });
};

// editar pago
exports.editPago = (req, res) => {
    const { id } = req.params;

    // entidades para los selectores
    db.query('SELECT * FROM pagos WHERE IdPago = ?', [id], (errPago, resultsPago) => {
        if (errPago) throw errPago;
        
        const pago = resultsPago[0];

        db.query('SELECT * FROM ventas', (errVentas, ventas) => {
            if (errVentas) throw errVentas;
            db.query('SELECT * FROM bancos', (errBancos, bancos) => {
                if (errBancos) throw errBancos;
                db.query('SELECT * FROM usuarios', (errUsuarios, usuarios) => {
                    if (errUsuarios) throw errUsuarios;
                    res.render('editPago', { pago, ventas, bancos, usuarios });
                });
            });
        });
    });
};

// Actualizar pago
exports.updatePago = (req, res) => {
    const { IdPago, IdVenta, Fecha, FormaPago, Monto, IdBanco, NumeroReferencia, IdUsuario } = req.body;

    // OBTENER TOTAL VENTA PARA RESTARLE EL MONTO QUE DA EL CLIENTE
    db.query('SELECT Total FROM ventas WHERE IdVenta = ?', [IdVenta], (err, results) => {
        if (err) throw err;
        const Total = results[0].Total;
        const SaldoPendiente = Total - Monto;

        db.query('UPDATE pagos SET IdVenta = ?, Fecha = ?, FormaPago = ?, Monto = ?, SaldoPendiente = ?, IdBanco = ?, NumeroReferencia = ?, IdUsuario = ? WHERE IdPago = ?', 
        [IdVenta, Fecha, FormaPago, Monto, SaldoPendiente, IdBanco, NumeroReferencia, IdUsuario, IdPago], 
        (err) => {
            if (err) throw err;
            res.redirect('/verPago');
        });
    });
};

// Eliminar PAGO
exports.deletePago = (req, res) => {
    const id = req.params.id; 
    db.query('DELETE FROM pagos WHERE IdPago = ?', [id], (err) => {
        if (err) {
            console.error('Error al eliminar pago:', err);
            return res.status(500).send('Error al eliminar pago');
        }
        res.redirect('/verPago'); 
    });
};