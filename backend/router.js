const express = require('express');
const router = express.Router();

// IMPORTANDO CONTROLADORES
const clientes = require('./controllers/clientes');
const CatProd = require('./controllers/CatProd');
const Bancos = require('./controllers/Bancos');
const Productos = require('./controllers/Productos');
const Usuarios = require('./controllers/Usuarios');
const Devoluciones = require('./controllers/Devoluciones');
const InformeDevoluciones = require('./controllers/InformeDevoluciones');
const ventas = require('./controllers/ventas');
const kardex = require('./controllers/Kardex');
const Pago = require('./controllers/Pago');
const isAuthenticated = require('./middleware/auth');
const dashboard = require('./controllers/dashboard');

// RUTA DE PRUEBA
router.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente', timestamp: new Date().toISOString() });
});

// RUTA DASHBOARD
//router.get('/dashboard', isAuthenticated, dashboard.miDashboard);
router.get('/dashboard', isAuthenticated, dashboard.getDashboard);


// ================== CLIENTES ==================
router.get('/verCliente', isAuthenticated, clientes.listCliente);
router.get('/createCliente', isAuthenticated, clientes.createCliente);
router.post('/saveCliente', isAuthenticated, clientes.saveCliente);
router.get('/editCliente/:id', isAuthenticated, clientes.editCliente);
router.post('/updateCliente', isAuthenticated, clientes.updateCliente);
router.post('/deleteCliente/:id', isAuthenticated, clientes.deleteCliente);

// ================== CATEGORIAS PRODUCTOS ==================
router.get('/verCatProd', isAuthenticated, CatProd.listCatProd);
router.get('/createCatProd', isAuthenticated, CatProd.createCatProd);
router.post('/createCatProd', isAuthenticated, CatProd.saveCatProd);
router.get('/editCatProd/:id', isAuthenticated, CatProd.editCatProd);
router.post('/updateCatProd', isAuthenticated, CatProd.updateCatProd);
router.post('/deleteCatProd/:id', isAuthenticated, CatProd.deleteCatProd);

// ================== BANCOS ==================
router.get('/verBanco', isAuthenticated, Bancos.listBanco);
router.get('/createBanco', isAuthenticated, Bancos.createBanco);
router.post('/createBanco', isAuthenticated, Bancos.saveBanco);
router.get('/editBanco/:id', isAuthenticated, Bancos.editBanco);
router.post('/updateBanco', isAuthenticated, Bancos.updateBanco);
router.post('/deleteBanco/:id', isAuthenticated, Bancos.deleteBanco);

// ================== PRODUCTOS ==================
router.get('/verProducto', isAuthenticated, Productos.listProducto);
router.get('/createProducto', isAuthenticated, Productos.createProducto);
router.post('/createProducto', isAuthenticated, Productos.saveProducto);
router.get('/editProducto/:id', isAuthenticated, Productos.editProducto);
router.post('/updateProducto', isAuthenticated, Productos.updateProducto);
router.post('/deleteProducto/:id', isAuthenticated, Productos.deleteProducto);

// ================== USUARIOS ==================
router.get('/verUsuario', isAuthenticated, Usuarios.listUsuarios);
router.get('/createUsuario', isAuthenticated, Usuarios.createUsuario);
router.post('/saveUsuario', isAuthenticated, Usuarios.saveUsuario);
router.get('/editUsuario/:id', isAuthenticated, Usuarios.editUsuario);
router.post('/updateUsuario', isAuthenticated, Usuarios.updateUsuario);
router.post('/deleteUsuario/:id', isAuthenticated, Usuarios.deleteUsuario);

// LOGIN
router.get('/login', Usuarios.loginUsuario);
router.post('/authUsuario', Usuarios.authUsuario);
router.get('/logout', Usuarios.logoutUsuario);

// ================== DEVOLUCIONES ==================
router.get('/verDevolucion', isAuthenticated, Devoluciones.listDevolucion);
router.get('/createDevolucion', isAuthenticated, Devoluciones.createDevolucion);
router.post('/createDevolucion', isAuthenticated, Devoluciones.saveDevolucion);
router.get('/editDevolucion/:id', isAuthenticated, Devoluciones.editDevolucion);
router.post('/updateDevolucion', isAuthenticated, Devoluciones.updateDevolucion);
router.post('/deleteDevolucion/:id', isAuthenticated, Devoluciones.deleteDevolucion);

// ================== INFORMES DEVOLUCIONES ==================
router.get('/verInformes', isAuthenticated, (req, res) => {
    res.render('verInformes', { user: req.session.user });
});
router.get('/generarInformeDevoluciones', isAuthenticated, InformeDevoluciones.generarInformeDevoluciones);

// ================== VENTAS ==================
router.get('/verVenta', isAuthenticated, ventas.mostrarVentas);
router.get('/createVenta', isAuthenticated, ventas.mostrarFormularioVenta);
router.post('/agregarPT', isAuthenticated, ventas.agregarPT);
router.post('/guardarVenta', isAuthenticated, ventas.guardarVenta);
router.get('/generarFactura/:IdVenta', isAuthenticated, ventas.generarFactura);
//router.get('/verFactura/:IdVenta', isAuthenticated, ventas.verFactura);


// ================== KARDEX ==================
router.get('/verKardex', isAuthenticated, kardex.listKardex);
router.get('/createKardex', isAuthenticated, kardex.createKardex);
router.post('/createKardex', isAuthenticated, kardex.saveKardex);
router.get('/editKardex/:id', isAuthenticated, kardex.editKardex);
router.post('/updateKardex/:id', isAuthenticated, kardex.updateKardex);
router.post('/deleteKardex/:id', isAuthenticated, kardex.deleteKardex);
router.get('/crearKardex', isAuthenticated, kardex.mostrarFormularioKardex);

// ================== PAGOS ==================
router.get('/verPago', isAuthenticated, Pago.listPago);
router.get('/createPago', isAuthenticated, Pago.createPago);
router.post('/createPago', isAuthenticated, Pago.savePago);
router.get('/editPago/:id', isAuthenticated, Pago.editPago);
router.post('/updatePago', isAuthenticated, Pago.updatePago);
router.post('/deletePago/:id', isAuthenticated, Pago.deletePago);


module.exports = router;