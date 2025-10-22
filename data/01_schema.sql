CREATE TABLE `funerarias` (
  `id_funeraria` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `correo_contacto` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_funeraria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `clientes` (
  `id_cliente` INT(11) NOT NULL AUTO_INCREMENT,
  `id_funeraria` INT(11) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `genero` ENUM('Masculino','Femenino','Otro') NOT NULL,
  `fecha_muerte` DATE DEFAULT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `estatus` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_cliente`),
  KEY `id_funeraria` (`id_funeraria`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_funeraria`) REFERENCES `funerarias` (`id_funeraria`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `rol` ENUM('cliente','admin','trabajador','funeraria') NOT NULL,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `fecha_nacimiento` DATE DEFAULT NULL,
  `contrasena` VARCHAR(55) NOT NULL,
  `id_funeraria` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_funeraria` (`id_funeraria`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_funeraria`) REFERENCES `funerarias` (`id_funeraria`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `clientes_usuarios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` INT(11) NOT NULL,
  `id_usuario` INT(11) NOT NULL,
  `fecha_asignacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `status` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cliente_usuario` (`id_cliente`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `clientes_usuarios_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
  CONSTRAINT `clientes_usuarios_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `familiares` (
  `id_familiar` INT(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` INT(11) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `parentesco` ENUM('Madre','Padre','Hijo','Hija','Hermano','Hermana','Esposo','Esposa','Abuelo','Abuela','Tío','Tía','Sobrino','Sobrina','Nieto','Nieta','Primo','Prima','Amigo','Amiga','Otro') NOT NULL,
  `edad` INT(11) DEFAULT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_familiar`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `familiares_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `recuerdos` (
  `id_recuerdo` INT(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` INT(11) NOT NULL,
  `titulo` VARCHAR(100) NOT NULL,
  `texto` TEXT NOT NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `entregado` TINYINT(1) NOT NULL DEFAULT 0,
  `fecha_entrega` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id_recuerdo`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `recuerdos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `recuerdos_enviados` (
  `id_entrega` INT(11) NOT NULL AUTO_INCREMENT,
  `id_recuerdo` INT(11) NOT NULL,
  `id_familiar` INT(11) NOT NULL,
  `fecha_envio` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `metodo_envio` ENUM('Correo','SMS','WhatsApp') NOT NULL DEFAULT 'Correo',
  `estatus_envio` ENUM('Pendiente','Enviado','Fallido') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`id_entrega`),
  KEY `id_recuerdo` (`id_recuerdo`),
  KEY `id_familiar` (`id_familiar`),
  CONSTRAINT `recuerdos_enviados_ibfk_1` FOREIGN KEY (`id_recuerdo`) REFERENCES `recuerdos` (`id_recuerdo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recuerdos_enviados_ibfk_2` FOREIGN KEY (`id_familiar`) REFERENCES `familiares` (`id_familiar`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
