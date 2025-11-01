const db = require('../database/db');

// ver devoluciones
exports.listDevolucion = (req, res) => {
    db.query('SELECT * FROM devoluciones', (err, results) => {
        if (err) throw err;
        res.render('verDevolucion', { data: results, title: 'Devoluciones'});
    });
};

// Crear devolucion
exports.createDevolucion = (req, res) => {
    db.query('SELECT IdVenta FROM ventas', (errVentas, ventas) => {
        if (errVentas) throw errVentas;
        
        db.query('SELECT IdProd, Nombre FROM productos', (errProd, productos) => {
            if (errProd) throw errProd;
            
            res.render('createDevolucion', { ventas: ventas, productos: productos });
        });
    });
};

// Guardar devolución
exports.saveDevolucion = (req, res) => {
    const { IdVenta, IdProd, Cantidad, Fecha, Motivo } = req.body;
    
    // Insertar devokucin en bd
    db.query(
        'INSERT INTO devoluciones (IdVenta, IdProd, Cantidad, Fecha, Motivo) VALUES (?, ?, ?, ?, ?)', 
        [IdVenta, IdProd, Cantidad, Fecha, Motivo], 
        (err) => {
            if (err) throw err;
            
            // Actualizar el Stock del producto 
            db.query(
                'UPDATE productos SET Stock = Stock + ? WHERE IdProd = ?', 
                [Cantidad, IdProd],
                (errUpdate) => {
                    if (errUpdate) throw errUpdate;
                    res.redirect('/verDevolucion');
                }
            );
        }
    );
};

// Editar devolución 
exports.editDevolucion = (req, res) => {
    const { id } = req.params;
    
    db.query('SELECT * FROM devoluciones WHERE IdDev = ?', [id], (err, devolucion) => {
        if (err) throw err;

        db.query('SELECT IdVenta FROM ventas', (errVentas, ventas) => {
            if (errVentas) throw errVentas;

            db.query('SELECT IdProd, Nombre FROM productos', (errProd, productos) => {
                if (errProd) throw errProd;

                res.render('editDevolucion', {
                    devolucion: devolucion[0], 
                    ventas: ventas, 
                    productos: productos
                });
            });
        });
    });
};

// Actualizar devolución
exports.updateDevolucion = (req, res) => {
    const { IdDev, IdVenta, IdProd, Cantidad, Fecha, Motivo } = req.body;

    // Consultar la devolución original
    db.query('SELECT Cantidad FROM devoluciones WHERE IdDev = ?', [IdDev], (errSelect, result) => {
        if (errSelect) throw errSelect;

        // Obtener la cantidad original de la devolución
        const cantidadOriginal = result[0].Cantidad;

        // Actualizar la devolución con los nuevos datos
        db.query(
            'UPDATE devoluciones SET IdVenta = ?, IdProd = ?, Cantidad = ?, Fecha = ?, Motivo = ? WHERE IdDev = ?', 
            [IdVenta, IdProd, Cantidad, Fecha, Motivo, IdDev], 
            (errUpdate) => {
                if (errUpdate) throw errUpdate;

                // Actualizar el Stock: primero restar la cantidad original (porque se estámos editando)
                db.query('UPDATE productos SET Stock = Stock - ? WHERE IdProd = ?', [cantidadOriginal, IdProd], (errRestar) => {
                    if (errRestar) throw errRestar;

                    // Ahora sumar la nueva cantidad de productos devueltos
                    db.query('UPDATE productos SET Stock = Stock + ? WHERE IdProd = ?', [Cantidad, IdProd], (errSumar) => {
                        if (errSumar) throw errSumar;
                        
                        // Redirigir 
                        res.redirect('/verDevolucion');
                    });
                });
            }
        );
    });
};


// Eliminar devolución
exports.deleteDevolucion = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM devoluciones WHERE IdDev = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/verDevolucion');
    });
};