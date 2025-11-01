const db = require('../database/db');
const { promisify } = require('util');
const queryAsync = promisify(db.query).bind(db);

exports.getDashboard = async (req, res) => {
    try {
        const ventasHoy = await queryAsync(`
            SELECT COUNT(*) as total, COALESCE(SUM(Total), 0) as monto
            FROM ventas
            WHERE DATE(Fecha) = CURDATE()
        `);

        const ventasMes = await queryAsync(`
            SELECT COUNT(*) as total, COALESCE(SUM(Total), 0) as monto
            FROM ventas
            WHERE MONTH(Fecha) = MONTH(CURDATE()) AND YEAR(Fecha) = YEAR(CURDATE())
        `);

        const stockBajo = await queryAsync(`
            SELECT COUNT(*) as total
            FROM productos
            WHERE Stock < 10
        `);

        const totalClientes = await queryAsync(`
            SELECT COUNT(*) as total FROM clientes
        `);

        const ultimasVentas = await queryAsync(`
            SELECT v.IdVenta, v.Fecha, v.Total, c.Nombre as ClienteNombre, v.FormaPago
            FROM ventas v
            LEFT JOIN clientes c ON v.IdCliente = c.IdCliente
            ORDER BY v.Fecha DESC
            LIMIT 5
        `);

        const topProductos = await queryAsync(`
            SELECT p.Nombre, SUM(dv.Cantidad) as TotalVendido
            FROM detalleventas dv
            JOIN productos p ON dv.IdProd = p.IdProd
            GROUP BY dv.IdProd
            ORDER BY TotalVendido DESC
            LIMIT 5
        `);

        const ventasPorFormaPago = await queryAsync(`
            SELECT FormaPago, COUNT(*) as cantidad, SUM(Total) as monto
            FROM ventas
            WHERE MONTH(Fecha) = MONTH(CURDATE()) AND YEAR(Fecha) = YEAR(CURDATE())
            GROUP BY FormaPago
        `);

        const ventasUltimos7Dias = await queryAsync(`
            SELECT DATE(Fecha) as fecha, COUNT(*) as cantidad, SUM(Total) as monto
            FROM ventas
            WHERE Fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(Fecha)
            ORDER BY fecha ASC
        `);

        res.render('dashboard', {
            title: 'Dashboard',
            ventasHoy: ventasHoy[0],
            ventasMes: ventasMes[0],
            stockBajo: stockBajo[0].total,
            totalClientes: totalClientes[0].total,
            ultimasVentas,
            topProductos,
            ventasPorFormaPago,
            ventasUltimos7Dias
        });

    } catch (error) {
        console.error('Error al cargar dashboard:', error);
        res.status(500).render('partials/error', {
            layout: 'layout',
            message: 'Error al cargar el dashboard',
            error
        });
    }
};