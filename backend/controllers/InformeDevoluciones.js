const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const pdf = require('pdfkit');
const db = require('../database/db');

exports.generarInformeDevoluciones = (req, res) => {
    const query = ` 
        SELECT d.IdDev, d.Fecha, d.Cantidad, d.Motivo, p.Nombre AS NombreProducto, c.Nombre AS NombreCliente
        FROM devoluciones d
        JOIN productos p ON d.IdProd = p.IdProd
        JOIN ventas v ON d.IdVenta = v.IdVenta
        JOIN clientes c ON v.IdCliente = c.IdCliente
    `;

    db.query(query, (err, devoluciones) => {
        if (err) {
            console.error('Error al obtener las devoluciones: ', err);
            return res.status(500).send('Error al obtener las devoluciones');
        }

        const doc = new pdf();
        const nombreArchivo = 'Informe_Devoluciones.pdf';
        const rutaArchivo = path.join(__dirname, '..', '..', 'frontend', 'public', 'informesdev', nombreArchivo);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=' + nombreArchivo);

        doc.pipe(fs.createWriteStream(rutaArchivo));
        doc.pipe(res);

        // Estilo, detalles del encabezado
        const logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'LogoUMG.png');
        doc.image(logoPath, 50, 50, { width: 50 });
        doc.fontSize(20).font('Helvetica-Bold').text('Informe de Devoluciones', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text('Tienda Santa Julia', { align: 'center' });
        doc.text('Fecha de Informe: ' + new Date().toLocaleDateString(), { align: 'center' });
        doc.moveDown(2);

        // Detalles tabla 
        const columnaAncho = [60, 80, 60, 120, 120, 120];
        
        // Encabezados 
        doc.fontSize(10).font('Helvetica-Bold');
        
        const encabezados = ['ID', 'Fecha', 'Cantidad', 'Motivo', 'Producto', 'Cliente'];
        
        let xPos = 50; // Posición inicial en X
        let yPos = doc.y; // Guardar la posición inicial
        
        encabezados.forEach((header, index) => {
            doc.text(header, xPos, yPos, { width: columnaAncho[index], align: 'center' });
            xPos += columnaAncho[index]; // Incremento de posicion
        });

        doc.moveDown(0.5);
        
        // Línea separador
        doc.moveTo(50, doc.y).lineTo(600, doc.y).stroke();
        doc.moveDown(0.5);


        doc.fontSize(10).font('Helvetica');
        
        devoluciones.forEach(devolucion => {
            xPos = 50; // Reiniciar posición X para cada fila
            yPos = doc.y; // Fijar posición Y para la fila

            // Datos de la devolución
            const datos = [
                devolucion.IdDev.toString(),
                new Date(devolucion.Fecha).toLocaleDateString(),
                devolucion.Cantidad.toString(),
                devolucion.Motivo,
                devolucion.NombreProducto,
                devolucion.NombreCliente,
            ];

            datos.forEach((dato, index) => {
                doc.text(dato, xPos, yPos, {
                    width: columnaAncho[index],
                    align: index < 3 ? 'center' : 'left', // Alineado
                    ellipsis: true, // Evitar desborde de texto
                });
                xPos += columnaAncho[index]; 
            });

            // agregamos nueva pagina si es necesario
            if (doc.y > 700) {
                doc.addPage();
                yPos = doc.y; // Reiniciar en nueva pagina
            }

            doc.moveDown(0.5); // Espacio entre filas
        });

        // Línea de cierre de la tabla
        doc.moveTo(50, doc.y).lineTo(600, doc.y).stroke();

        // Fin pdf
        doc.end();
    });
};