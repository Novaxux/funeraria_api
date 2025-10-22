-- ============================================
-- TABLA: clientes
-- ============================================
CREATE TABLE clientes (
    id_cliente INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_funeraria INT(11) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    genero ENUM('Masculino','Femenino','Otro'),
    estatus ENUM('Activo','Fallecido') DEFAULT 'Activo',
    fecha_muerte DATE,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    CONSTRAINT fk_cliente_funeraria FOREIGN KEY (id_funeraria)
        REFERENCES funerarias(id_funeraria)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- TABLA: familiares
-- ============================================
CREATE TABLE familiares (
    id_familiar INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT(11) NOT NULL,
    id_funeraria INT(11) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20),
    correo_contacto VARCHAR(100),
    parentesco ENUM('Madre','Padre','Hijo','Hija','Hermano','Hermana',
                    'Esposo','Esposa','Abuelo','Abuela','Tío','Tía',
                    'Sobrino','Sobrina','Nieto','Nieta','Primo','Prima',
                    'Amigo','Amiga','Otro') NOT NULL,
    edad INT(11),
    CONSTRAINT fk_familiar_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_familiar_funeraria FOREIGN KEY (id_funeraria)
        REFERENCES funerarias(id_funeraria)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- TABLA: recuerdos
-- ============================================
CREATE TABLE recuerdos (
    id_recuerdo INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT(11) NOT NULL,
    titulo VARCHAR(100),
    texto TEXT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    entregado TINYINT(1) DEFAULT 0,
    fecha_entrega DATETIME,
    CONSTRAINT fk_recuerdo_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- TABLA: entregas
-- ============================================
CREATE TABLE entregas (
    id_entrega INT(11) AUTO_INCREMENT PRIMARY KEY,
    id_recuerdo INT(11) NOT NULL,
    id_familiar INT(11) NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_envio ENUM('Correo','SMS','WhatsApp') NOT NULL,
    estatus_envio ENUM('Pendiente','Enviado','Fallido') DEFAULT 'Pendiente',
    correo VARCHAR(100),
    CONSTRAINT fk_entrega_recuerdo FOREIGN KEY (id_recuerdo)
        REFERENCES recuerdos(id_recuerdo)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_entrega_familiar FOREIGN KEY (id_familiar)
        REFERENCES familiares(id_familiar)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 