const conexion = require('../database/db');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

exports.mostrarFormularioVenta = async (req, res) => {
    try {
        const clientes = await queryAsync('SELECT * FROM clientes');
        const productos= await queryAsync('SELECT * FROM productos');
        const usuarios = await queryAsync('SELECT * FROM usuarios');
        res.render('createVenta', { clientes, productos, usuarios });
    } catch (error) {
        console.error('Error en la consulta de clientes, productos o usuarios:', error);
        res.status(500).send('Error en el servidor');
    }
};

exports.agregarPT = async(req, res) => {
    const { productoId, cantidad, precio} = req.body;
    try {
        await queryAsync('INSERT INTO tempdetalle (idProd, Cantidad, Precio) VALUES (?, ?, ?)', 
            [productoId, cantidad, precio]
        );
        res.json({ message: 'Producto guardado exitosamente.' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: 'Error al guardar el producto.' });
    }
};

exports.guardarVenta = async(req, res) => {
    const { 
        IdCliente, 
        FormaPago, 
        Anticipo, 
        Descuento, 
        CuentaCorriente,
        Total,
        IdUsuario 
    } = req.body;

    const productosSeleccionados = await queryAsync('SELECT * FROM tempdetalle');

    try {
        if (!Array.isArray(productosSeleccionados) || productosSeleccionados.length === 0) {
            throw new Error('No se han seleccionado productos.');
        }
    try {
        await queryAsync('START TRANSACTION');
      
        let totalVenta = 0;

        async function obtenerUltimoIdVenta() {
            const result = await queryAsync(`
                SELECT IdVenta 
                FROM VENTAS 
                ORDER BY IdVenta DESC 
                LIMIT 1
            `);
            return result[0] ? result[0].IdVenta : 0; // Retorna el último IdVenta o 0 si no hay ventas
        }
        
        
        const fecha = new Date();
        const formatofecha = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });

        function generarNumeroFactura(ultimoSecuencia = 1) {
            
            const fechaActual = new Date();
            const anio = fechaActual.getFullYear();
            const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos
            const dia = String(fechaActual.getDate()).padStart(2, '0'); // Día con 2 dígitos
          
            const secuencia = String(ultimoSecuencia).padStart(3, '0'); // Secuencia con 3 dígitos
            return `${anio}${mes}${dia}-${secuencia}`;
        }
        const ultimoIdVenta = await obtenerUltimoIdVenta(); 
        const nuevoIdVenta = ultimoIdVenta + 1; 
        const Nnfactura = generarNumeroFactura(nuevoIdVenta);

        const resultVenta = await queryAsync(
            'INSERT INTO ventas (IdCliente, Fecha, FormaPago, NumeroFactura , Total, Anticipo, Descuento, CuentaCorriente ,IdUsuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
            [IdCliente, fecha, FormaPago, Nnfactura, Total, Anticipo, Descuento, CuentaCorriente ? 1 : 0, IdUsuario]
        );
        
        const ventaId = resultVenta.insertId;

        for (const producto of productosSeleccionados) {
            const productoId = producto.idProd; // Adjust if necessary
            const cantidadProducto = producto.Cantidad; // Adjust if necessary
        

            const precioProducto = producto.Precio;
            const totalProducto = precioProducto * cantidadProducto;
            totalVenta += totalProducto;
        
            await queryAsync(
                'INSERT INTO detalleventas (IdVenta, IdProd, Cantidad) VALUES ( ?, ?, ?)',
                [ventaId, productoId, cantidadProducto]
            );
        }
    
        
        const descuentoAplicado = (totalVenta * Descuento) / 100;
        const totalConDescuento = totalVenta - descuentoAplicado;
        const totalFinal = totalConDescuento - Anticipo;

        await queryAsync('UPDATE ventas SET Total = ?, Descuento = ? WHERE IdVenta = ?', [totalFinal, descuentoAplicado, ventaId]);
        await queryAsync('COMMIT');
        await queryAsync('TRUNCATE tempdetalle');
        
            res.redirect('/verVenta');

    } catch (error) {
        console.error('Error al guardar la venta:', error);
        await queryAsync('ROLLBACK');
        res.status(500).send('Error al guardar la venta: ' + error.message);
    }

} catch (error) {
    console.error('Error al guardar la venta:', error);
    res.status(500).json({ message: 'Error al guardar la venta', error: error.message });
}
};

exports.mostrarVentas = async (req, res) => {
    try {
        const query = `
            SELECT v.IdVenta, v.Fecha, c.Nombre AS ClienteNombre, v.FormaPago, v.Total, v.Anticipo, v.Descuento
            FROM ventas v
            JOIN clientes c ON v.IdCliente = c.IdCliente
            ORDER BY v.Fecha
        `;
        const venta = await queryAsync(query);
        res.render('verVenta', { venta, title: 'Ventas' });
    } catch (error) {
        console.error('Error al mostrar las ventas:', error);
        res.status(500).json({ message: 'Error en la base de datos' });
    }
};


const express = require('express');
const app = express();

exports.generarFactura = async (req, res) => {
    const { IdVenta } = req.params;

    try {
        const venta = await queryAsync('SELECT * FROM  ventas WHERE IdVenta = ?', [IdVenta]);
        const ventacliente = await queryAsync('SELECT * FROM clientes INNER JOIN ventas ON clientes.IdCliente = ventas.IdCliente WHERE ventas.IdVenta = ?', [IdVenta]);
        if (venta.length === 0) {
            return res.status(404).send('Venta no encontrada');
        }

        const detalles = await queryAsync(`
            SELECT dv.*, p.Nombre, p.Precio 
            FROM detalleventas dv
            JOIN productos p ON dv.IdProd = p.IdProd
            WHERE dv.IdVenta = ?
        `, [IdVenta]);

        const result = venta[0]; 
        const result2 = ventacliente[0];
        const products = detalles; 

        const doc = new PDFDocument();
        res.setHeader('Content-type', 'application/pdf');
        //res.setHeader('Content-Disposition', `inline; filename="Factura_${result.NumeroFactura}.pdf"`);

        const inlineOrAttachment = req.forceDownload ? 'attachment' : 'inline';
        res.setHeader('Content-Disposition', `${inlineOrAttachment}; filename="Factura_${result.NumeroFactura}.pdf"`);

        doc.pipe(res);


        // ENCABEZADO
        const logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'LogoUMG.png');
        doc.image(logoPath, 50, 50, { width: 50 });
        doc.fontSize(20).font('Helvetica-Bold').text('Factura', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text('Tienda Santa Julia', { align: 'center' });
        doc.moveDown(2);

        // DETALLES
        const now = new Date();
        doc.text(`Fecha de emisión: ${now.toLocaleString()}`).moveDown();
        doc.font('Helvetica-Bold').text(`Factura No: ${result.NumeroFactura}`, { align: 'center' }).moveDown();

        // DATOS CLIENTE
        doc.text(`Cliente: ${result2.Nombre}`).moveDown(); 
        doc.text(`NIT: ${result2.NIT}`).moveDown(); 
        doc.text(`Direccion: ${result2.Direccion}`).moveDown(); 
        doc.text(`Tel: ${result2.Telefono}`).moveDown(); 
        

// Detalles de la tabla 
const columnaAncho = [60, 80, 60, 120];

// Encabezados de la tabla
doc.fontSize(10).font('Helvetica-Bold');

const encabezados = ['Descripcion', 'Precio', 'Cantidad', 'Subtotal'];

let xPos = 50; // Posición inicial X
const headerY = doc.y; // Guardar la posición Y inicial para dibujar la línea

// Dibujar los encabezados
encabezados.forEach((header, index) => {
    doc.text(header, xPos, headerY, { width: columnaAncho[index], align: 'center' });
    xPos += columnaAncho[index]; // Incrementar la posición X
});

// Línea de separación debajo de los encabezados
doc.moveTo(50, headerY + 12) // Ajusta el valor según el espaciado deseado
   .lineTo(50 + columnaAncho.reduce((a, b) => a + b, 0), headerY + 12) // Línea hasta el ancho total de las columnas
   .stroke();

// Mover hacia abajo para las filas de productos
doc.moveDown(0.5);      
        
        let subtotalg = 0;

        products.forEach(product => {
            const subtotal = product.Cantidad * product.Precio.toFixed(2); 
            subtotalg += subtotal;
        
            let xPos = 50; // Posición inicial X
            const startY = doc.y; // Guardar la posición Y inicial para cada fila
        
            // Colocar cada dato en su respectiva columna
            doc.font('Helvetica').text(product.Nombre, xPos, startY, { width: columnaAncho[0], align: 'center' });
            xPos += columnaAncho[0]; 
        
            doc.text(product.Precio.toFixed(2).toString(), xPos, startY, { width: columnaAncho[1], align: 'center' }); // Formato de precio a dos decimales
            xPos += columnaAncho[1]; 
        
            doc.text(product.Cantidad.toString(), xPos, startY, { width: columnaAncho[2], align: 'center' }); // Mostrar cantidad
            xPos += columnaAncho[2]; 
        
            doc.text(`Q${subtotal.toFixed(2)}`, xPos, startY, { width: columnaAncho[3], align: 'center' }); // Formato de subtotal a dos decimales
        
            // Dibujar una línea para la fila actual
            doc.moveTo(50, startY + 12) // Ajusta el Y según sea necesario para que la línea esté correctamente alineada con la fila
               .lineTo(50 + columnaAncho.reduce((a, b) => a + b, 0), startY + 12) // Línea hasta el ancho total de las columnas
               .stroke();
        
            doc.moveDown(0.5); // Mover hacia abajo para la siguiente fila
        });
        doc.moveDown(0.5);      
   
   

doc.font('Helvetica-Bold').text('SUBTOTAL', { width: 100, align: 'left' });
doc.text(`Q${subtotalg.toFixed(2)}`, { width: 34, align: 'left' }).moveDown();
doc.text('Descuento', { width: 100, align: 'left' });
doc.text(`Q${result.Descuento.toFixed(2)}`, { width: 34, align: 'left' }).moveDown();
doc.text('Anticipo', { width: 100, align: 'left' });
doc.text(`Q${result.Anticipo.toFixed(2)}`, { width: 34, align: 'left' }).moveDown();
doc.text('TOTAL A PAGAR', { width: 100, align: 'left' });
doc.text(`Q${result.Total.toFixed(2)}`, { width: 34, align: 'left' }).moveDown(8);

doc.fontSize(10).fillColor('#272739')
.text('*** Precios de productos incluyen impuestos. Para poder realizar un reclamo o devolución debe de presentar esta factura ***', {
    align: 'left'
}).moveDown(9);

    doc.end();
    
    } catch (error) {
        console.error('Error al generar la factura:', error);
        res.status(500).send('Error al regenerar la factura');
    }
};



function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        conexion.query(sql, params, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

module.exports = {
    mostrarFormularioVenta: exports.mostrarFormularioVenta,
    agregarPT: exports.agregarPT,
    guardarVenta: exports.guardarVenta,
    mostrarVentas: exports.mostrarVentas,
    generarFactura: exports.generarFactura
};