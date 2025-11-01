-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-08-2025 a las 23:14:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `puntoventa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bancos`
--

CREATE TABLE `bancos` (
  `IdBanco` bigint(20) NOT NULL,
  `Nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `bancos`
--

INSERT INTO `bancos` (`IdBanco`, `Nombre`) VALUES
(2, 'BAM'),
(5, 'ningunos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `IdCategoria` bigint(20) NOT NULL,
  `Nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`IdCategoria`, `Nombre`) VALUES
(1, 'Panes'),
(2, 'Cereales'),
(3, 'Bebidas energeticas'),
(4, 'Gaseosas'),
(5, 'Especies'),
(6, 'Dulces'),
(7, 'Galletas'),
(8, 'Golosinas'),
(9, 'Jugos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `IdCliente` bigint(20) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Direccion` varchar(255) DEFAULT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `Sexo` varchar(10) DEFAULT NULL,
  `NIT` varchar(50) DEFAULT NULL,
  `CUI` varchar(50) DEFAULT NULL,
  `SeguroMedico` varchar(255) DEFAULT NULL,
  `NumeroPoliza` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`IdCliente`, `Nombre`, `Direccion`, `Telefono`, `Email`, `Sexo`, `NIT`, `CUI`, `SeguroMedico`, `NumeroPoliza`) VALUES
(1, 'Ana Elizabeth Garcia Estrada', '12-1, Zona 2, Salcajá, Quetzaltenango', '88917122', 'elizaGarcia21@gmail.com', 'M', '887171-2', '718720701', 'yy-1', '12'),
(2, 'Juan Carlos Morales Norato', '8-2, Zona 1, Totonicapan', '81919191', 'JuancaM2@gmail.com', 'H', '8181-1', '171067617101', 'yy-2', '13'),
(3, 'Maria Gutierrez Vasquez', '21-2, Zona 4, Quetzaltenango', '71717188', 'MGutierrez43@gmail.com', 'M', '1711218-9', '1718711110401', 'yy-3', '14'),
(4, 'Joaquin Fernando Hernandez Fernandez', '7-23, Zona 1, Totonicapan', '81909001', 'JHernandez988@gmail.com', 'H', '1897892-1', '182871680801', 'yy-4', '15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalleventas`
--

CREATE TABLE `detalleventas` (
  `IdDetVent` bigint(20) NOT NULL,
  `IdVenta` bigint(20) NOT NULL,
  `IdProd` bigint(20) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `detalleventas`
--

INSERT INTO `detalleventas` (`IdDetVent`, `IdVenta`, `IdProd`, `Cantidad`) VALUES
(1, 1, 2, 3),
(2, 2, 3, 2),
(3, 3, 3, 10),
(4, 4, 1, 50),
(5, 5, 1, 1),
(6, 5, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devoluciones`
--

CREATE TABLE `devoluciones` (
  `IdDev` bigint(20) NOT NULL,
  `IdVenta` bigint(20) NOT NULL,
  `IdProd` bigint(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Fecha` datetime DEFAULT current_timestamp(),
  `Motivo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `devoluciones`
--

INSERT INTO `devoluciones` (`IdDev`, `IdVenta`, `IdProd`, `Cantidad`, `Fecha`, `Motivo`) VALUES
(1, 1, 2, 1, '2024-10-25 00:00:00', 'Envoltura dañada'),
(2, 2, 3, 1, '2024-10-25 00:00:00', 'Envase dañado'),
(5, 1, 3, 1, '2024-10-26 00:00:00', 'Envases dañados');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `kardex`
--

CREATE TABLE `kardex` (
  `Id` bigint(20) NOT NULL,
  `IdProd` bigint(20) NOT NULL,
  `CantidadInicial` int(11) NOT NULL,
  `CantidadVendida` int(11) DEFAULT 0,
  `CantidadRecibida` int(11) DEFAULT 0,
  `CantidadExistente` int(11) NOT NULL,
  `IdUsuario` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `kardex`
--

INSERT INTO `kardex` (`Id`, `IdProd`, `CantidadInicial`, `CantidadVendida`, `CantidadRecibida`, `CantidadExistente`, `IdUsuario`) VALUES
(1, 1, 20000, 200, 100, 19900, 1),
(2, 1, 19900, 100, 150, 19950, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `IdPago` bigint(20) NOT NULL,
  `IdVenta` bigint(20) NOT NULL,
  `Fecha` datetime DEFAULT current_timestamp(),
  `FormaPago` varchar(50) NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `SaldoPendiente` decimal(10,2) NOT NULL,
  `IdBanco` bigint(20) DEFAULT NULL,
  `NumeroReferencia` varchar(255) DEFAULT NULL,
  `IdUsuario` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`IdPago`, `IdVenta`, `Fecha`, `FormaPago`, `Monto`, `SaldoPendiente`, `IdBanco`, `NumeroReferencia`, `IdUsuario`) VALUES
(1, 3, '2024-10-26 00:55:00', 'Efectivo', 100.00, 98.11, 5, '140', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `IdProd` bigint(20) NOT NULL,
  `CodigoProducto` varchar(50) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Impuestos` decimal(5,2) NOT NULL,
  `NumeroSerie` varchar(255) DEFAULT NULL,
  `Stock` int(11) NOT NULL,
  `IdCategoria` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`IdProd`, `CodigoProducto`, `Nombre`, `Descripcion`, `Precio`, `Impuestos`, `NumeroSerie`, `Stock`, `IdCategoria`) VALUES
(1, '1', 'Raptor ligth', 'Botella 12 onz, Sabor chocolate', 12.00, 0.90, '123', 20175, 3),
(2, '2', 'Pinguinos fresa', 'Bolsa 2 unidades, marinella fresa', 18.00, 0.60, '1234', 5198, 1),
(3, '3', 'Cocal cola', 'Jumbo 3 litros', 21.00, 0.50, '12345', 11980, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tempdetalle`
--

CREATE TABLE `tempdetalle` (
  `iddetalle` int(11) NOT NULL,
  `idProd` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `Precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `IdUsuario` bigint(20) NOT NULL,
  `NombreUsuario` varchar(255) NOT NULL,
  `Contrasena` varchar(255) NOT NULL,
  `Rol` varchar(50) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Apellido` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Telefono` varchar(50) DEFAULT NULL,
  `FechaRegistro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`IdUsuario`, `NombreUsuario`, `Contrasena`, `Rol`, `Nombre`, `Apellido`, `Email`, `Telefono`, `FechaRegistro`) VALUES
(1, 'danny', '$2y$10$HU3kZOYTdd2muLV3TGq9GewY4AGVuT8NXThyfPngZECEGHPGc1mnS', 'administrador', 'Wilmer Admidael', 'Batz Chaclan', 'wil33@gmail.com', '88776152', '2024-09-04 22:03:28'),
(6, 'WILMER ', '$2a$10$YkNHgxIwaEP4w57WaUfphO7tLbhFy2aVNKqpt1urvhvBpy9Oy0vzm', 'Administrador', 'wilmer', 'batz', 'sanet@gmail.com', '12345678', '2025-07-26 15:23:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `IdVenta` bigint(20) NOT NULL,
  `IdCliente` bigint(20) NOT NULL,
  `Fecha` datetime DEFAULT current_timestamp(),
  `FormaPago` varchar(50) DEFAULT NULL,
  `NumeroFactura` varchar(255) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `Anticipo` decimal(10,2) DEFAULT NULL,
  `Descuento` decimal(5,2) DEFAULT NULL,
  `CuentaCorriente` bit(1) DEFAULT b'0',
  `NumeroSerie` varchar(255) DEFAULT NULL,
  `IdUsuario` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`IdVenta`, `IdCliente`, `Fecha`, `FormaPago`, `NumeroFactura`, `Total`, `Anticipo`, `Descuento`, `CuentaCorriente`, `NumeroSerie`, `IdUsuario`) VALUES
(1, 1, '2024-10-25 09:45:55', 'Efectivo', '20241025-001', 53.52, 0.00, 0.48, b'0', NULL, 1),
(2, 4, '2024-10-25 09:50:02', 'Tarjeta', '20241025-002', 41.67, 0.00, 0.33, b'0', NULL, 1),
(3, 3, '2024-10-25 18:55:24', 'Credito', '20241025-003', 198.11, 10.00, 1.89, b'0', NULL, 1),
(4, 4, '2024-10-25 19:30:45', 'Efectivo', '20241025-004', 600.00, 0.00, 0.00, b'0', NULL, 1),
(5, 1, '2025-08-25 14:34:02', 'Efectivo', '20250825-005', 24.00, 0.00, 0.00, b'0', NULL, 6);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bancos`
--
ALTER TABLE `bancos`
  ADD PRIMARY KEY (`IdBanco`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`IdCategoria`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`IdCliente`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indices de la tabla `detalleventas`
--
ALTER TABLE `detalleventas`
  ADD PRIMARY KEY (`IdDetVent`),
  ADD KEY `FK_DetalleVentas_Ventas` (`IdVenta`),
  ADD KEY `FK_DetalleVentas_Productos` (`IdProd`);

--
-- Indices de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD PRIMARY KEY (`IdDev`),
  ADD KEY `FK_Devoluciones_Ventas` (`IdVenta`),
  ADD KEY `FK_DetalleDevoluciones_Productos` (`IdProd`);

--
-- Indices de la tabla `kardex`
--
ALTER TABLE `kardex`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_Kardex_Productos` (`IdProd`),
  ADD KEY `FK_Kardex_Usuarios` (`IdUsuario`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`IdPago`),
  ADD KEY `FK_Pagos_Ventas` (`IdVenta`),
  ADD KEY `FK_Pagos_Bancos` (`IdBanco`),
  ADD KEY `FK_Pagos_Usuarios` (`IdUsuario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`IdProd`),
  ADD UNIQUE KEY `CodigoProducto` (`CodigoProducto`),
  ADD KEY `FK_Productos_Categorias` (`IdCategoria`);

--
-- Indices de la tabla `tempdetalle`
--
ALTER TABLE `tempdetalle`
  ADD PRIMARY KEY (`iddetalle`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`IdUsuario`),
  ADD UNIQUE KEY `NombreUsuario` (`NombreUsuario`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`IdVenta`),
  ADD KEY `FK_Ventas_Clientes` (`IdCliente`),
  ADD KEY `FK_Ventas_Usuarios` (`IdUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bancos`
--
ALTER TABLE `bancos`
  MODIFY `IdBanco` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `IdCategoria` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `IdCliente` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `detalleventas`
--
ALTER TABLE `detalleventas`
  MODIFY `IdDetVent` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  MODIFY `IdDev` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `kardex`
--
ALTER TABLE `kardex`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `IdPago` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `IdProd` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tempdetalle`
--
ALTER TABLE `tempdetalle`
  MODIFY `iddetalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `IdUsuario` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `IdVenta` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalleventas`
--
ALTER TABLE `detalleventas`
  ADD CONSTRAINT `FK_DetalleVentas_Productos` FOREIGN KEY (`IdProd`) REFERENCES `productos` (`IdProd`),
  ADD CONSTRAINT `FK_DetalleVentas_Ventas` FOREIGN KEY (`IdVenta`) REFERENCES `ventas` (`IdVenta`);

--
-- Filtros para la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD CONSTRAINT `FK_DetalleDevoluciones_Productos` FOREIGN KEY (`IdProd`) REFERENCES `productos` (`IdProd`),
  ADD CONSTRAINT `FK_Devoluciones_Ventas` FOREIGN KEY (`IdVenta`) REFERENCES `ventas` (`IdVenta`);

--
-- Filtros para la tabla `kardex`
--
ALTER TABLE `kardex`
  ADD CONSTRAINT `FK_Kardex_Productos` FOREIGN KEY (`IdProd`) REFERENCES `productos` (`IdProd`),
  ADD CONSTRAINT `FK_Kardex_Usuarios` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `FK_Pagos_Bancos` FOREIGN KEY (`IdBanco`) REFERENCES `bancos` (`IdBanco`),
  ADD CONSTRAINT `FK_Pagos_Usuarios` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`),
  ADD CONSTRAINT `FK_Pagos_Ventas` FOREIGN KEY (`IdVenta`) REFERENCES `ventas` (`IdVenta`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `FK_Productos_Categorias` FOREIGN KEY (`IdCategoria`) REFERENCES `categorias` (`IdCategoria`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `FK_Ventas_Clientes` FOREIGN KEY (`IdCliente`) REFERENCES `clientes` (`IdCliente`),
  ADD CONSTRAINT `FK_Ventas_Usuarios` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`IdUsuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
