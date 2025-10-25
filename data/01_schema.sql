CREATE TABLE `funerarias` (
  `id_funeraria` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(20) NOT NULL,
  `correo_contacto` VARCHAR(100) NOT NULL,
  `estado_funeraria` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_funeraria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `usuarios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `genero` ENUM('Masculino','Femenino','Otro') NOT NULL,
  `rol` ENUM('cliente','admin','trabajador','funeraria') NOT NULL,
  `correo` VARCHAR(100) NOT NULL UNIQUE,
  `telefono` VARCHAR(20) NOT NULL,
  `estado_usuario` TINYINT(1) NOT NULL DEFAULT 1,
  `contrasena` VARCHAR(55) NOT NULL,
  `id_funeraria` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_funeraria` (`id_funeraria`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_funeraria`) REFERENCES `funerarias` (`id_funeraria`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `clientes` (
  `id_cliente` INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` INT(11) NOT NULL UNIQUE,
  `fecha_muerte` DATE DEFAULT NULL,
  `estado_vivo` TINYINT(1) NOT NULL DEFAULT 1,
  `fecha_asignacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `estado_cliente` ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id_cliente`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `trabajadores` (
  `id_trabajador` INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` INT(11) NOT NULL UNIQUE,
  `puesto` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_trabajador`),
  CONSTRAINT `trabajadores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `admins` (
  `id_admin` INT(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` INT(11) NOT NULL UNIQUE,
  PRIMARY KEY (`id_admin`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  CONSTRAINT `fk_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE

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
  CONSTRAINT `recuerdos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `recuerdos_familiares` (
  `id_entrega` INT(11) NOT NULL AUTO_INCREMENT,
  `id_recuerdo` INT(11) NOT NULL,
  `id_familiar` INT(11) NOT NULL,
  `fecha_envio` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `metodo_envio` ENUM('Correo','SMS','WhatsApp') NOT NULL DEFAULT 'Correo',
  `estatus_envio` ENUM('Pendiente','Enviado','Fallido') NOT NULL DEFAULT 'Pendiente',
  `intentos` INT(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_entrega`),
  CONSTRAINT `recuerdos_enviados_ibfk_1` FOREIGN KEY (`id_recuerdo`) REFERENCES `recuerdos` (`id_recuerdo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recuerdos_enviados_ibfk_2` FOREIGN KEY (`id_familiar`) REFERENCES `familiares` (`id_familiar`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
