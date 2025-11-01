const db = require('../database/db'); 

// Mostrar formulario de creación
exports.createKardex = (req, res) => {
    db.query('SELECT * FROM productos', (err, productos) => {
        if (err) throw err;
        res.render('createKardex', { productos, title: 'Crear Kardex' });
    });
};

// Crear un nuevo registro de kardex
exports.saveKardex = (req, res) => {
    const cantidadVendida = parseInt(req.body.CantidadVendida, 10);
    const cantidadRecibida = parseInt(req.body.CantidadRecibida, 10);
    const IdProd = req.body.IdProd;
    const IdUsuario = req.user ? req.user.id : 1;

    const sqlLastExistence = 'SELECT CantidadExistente FROM kardex WHERE IdProd = ? ORDER BY Id DESC LIMIT 1';
    db.query(sqlLastExistence, [IdProd], (err, result) => {
        if (err) throw err;

        const cantidadInicial = result.length > 0 ? result[0].CantidadExistente : parseInt(req.body.CantidadInicial, 10);
        const CantidadExistente = cantidadInicial - cantidadVendida + cantidadRecibida;
        
        const sqlInsertKardex = `INSERT INTO kardex (IdProd, CantidadInicial, CantidadVendida, CantidadRecibida, CantidadExistente, IdUsuario)
                                 VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sqlInsertKardex, [IdProd, cantidadInicial, cantidadVendida, cantidadRecibida, CantidadExistente, IdUsuario], (err) => {
            if (err) throw err;

            // Actualizamos el stock en la tabla productos
            const sqlUpdateProductStock = 'UPDATE productos SET Stock = ? WHERE IdProd = ?';
            db.query(sqlUpdateProductStock, [CantidadExistente, IdProd], (err) => {
                if (err) throw err;
                res.redirect('/verKardex');
            });
        });
    });
};



// Mostrar formulario de edición
exports.editKardex = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM kardex WHERE Id = ?', [id], (err, kardexData) => {
        if (err) throw err;
        
        if (kardexData.length > 0) {  
            const currentRecord = kardexData[0];
            const IdProd = currentRecord.IdProd;

            const sqlLastExistence = 'SELECT CantidadExistente FROM kardex WHERE IdProd = ? ORDER BY Id DESC LIMIT 1';
            db.query(sqlLastExistence, [IdProd], (err, result) => {
                if (err) throw err;

                const lastCantidadExistente = result.length > 0 ? result[0].CantidadExistente : currentRecord.CantidadInicial;

                db.query('SELECT * FROM productos', (err, productos) => {
                    if (err) throw err;
                    res.render('editKardex', { 
                        kardex: { ...currentRecord, CantidadInicial: lastCantidadExistente },
                        productos 
                    });
                });
            });
        } else {
            res.status(404).send('Registro no encontrado');
        }
    });
};


// Actualizar registro de kardex
exports.updateKardex = (req, res) => {
    const { IdProd, CantidadVendida, CantidadRecibida } = req.body;

    const cantidadVendida = parseInt(CantidadVendida, 10);
    const cantidadRecibida = parseInt(CantidadRecibida, 10);
    const Id = req.params.id;

    const sqlLastExistence = 'SELECT CantidadExistente FROM kardex WHERE IdProd = ? ORDER BY Id DESC LIMIT 1';
    db.query(sqlLastExistence, [IdProd], (err, result) => {
        if (err) throw err;

        const cantidadInicial = result.length > 0 ? result[0].CantidadExistente : 0;
        const CantidadExistente = cantidadInicial - cantidadVendida + cantidadRecibida;
        
        const sqlUpdateKardex = `UPDATE kardex SET IdProd = ?, CantidadInicial = ?, CantidadVendida = ?, CantidadRecibida = ?, CantidadExistente = ?
                                 WHERE Id = ?`;

        db.query(sqlUpdateKardex, [IdProd, cantidadInicial, cantidadVendida, cantidadRecibida, CantidadExistente, Id], (err) => {
            if (err) {
                console.error('Error al actualizar el kardex:', err);
                return res.status(500).send("Algo salió mal");
            }

            const sqlUpdateProductStock = 'UPDATE productos SET Stock = ? WHERE IdProd = ?';
            db.query(sqlUpdateProductStock, [CantidadExistente, IdProd], (err) => {
                if (err) throw err;
                res.redirect('/verKardex');
            });
        });
    });
};



// Ver lista de kardex
exports.listKardex = (req, res) => {
    const sql = 'SELECT k.*, p.Nombre as NombreProducto FROM kardex k JOIN productos p ON k.IdProd = p.IdProd';
    db.query(sql, (err, kardexList) => {
        if (err) throw err;
        res.render('verKardex', { kardexList });
    });
};

// Eliminar registro de kardex
exports.deleteKardex = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM kardex WHERE Id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/verKardex');
    });
};

// Controlador para mostrar el formulario de creación del Kardex
exports.mostrarFormularioKardex = async (req, res) => {
    try {
        const productos = await db.query('SELECT * FROM productos');
        res.render('crearKardex', { productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al cargar el formulario de Kardex.');
    }
};