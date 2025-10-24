-- Procedimiento 1: Contar recuerdos por cliente (CORREGIDO)
DELIMITER //
DROP PROCEDURE IF EXISTS contar_recuerdos_por_cliente//
CREATE PROCEDURE contar_recuerdos_por_cliente(IN nombre_cliente VARCHAR(100))
BEGIN
    SELECT 
        u.nombre AS cliente, 
        COUNT(r.id_recuerdo) AS total_entregados,
        SUM(CASE WHEN r.entregado = 0 THEN 1 ELSE 0 END) AS total_pendientes
    FROM usuarios u
    INNER JOIN clientes c ON u.id = c.id_usuario
    LEFT JOIN recuerdos r ON c.id_cliente = r.id_cliente
    WHERE u.nombre LIKE CONCAT('%', nombre_cliente, '%')
    GROUP BY u.id, u.nombre;
END //
DELIMITER ;

-- Procedimiento 2: Actualizar estado de clientes
DELIMITER //
DROP PROCEDURE IF EXISTS actualizar_estado_clientes//
CREATE PROCEDURE actualizar_estado_clientes()
BEGIN
    -- Inactivar clientes fallecidos hace más de 1 año
    UPDATE clientes c
    INNER JOIN usuarios u ON c.id_usuario = u.id
    SET c.estado_cliente = 'inactivo',
        u.estado_usuario = 0
    WHERE c.estado_vivo = 0 
    AND c.fecha_muerte IS NOT NULL
    AND DATEDIFF(CURRENT_DATE, c.fecha_muerte) > 365
    AND c.estado_cliente = 'activo';
    
    SELECT ROW_COUNT() AS clientes_actualizados;
END //
DELIMITER ;

-- Procedimiento 3: Asignar rol si está vacío (INNECESARIO - el campo rol es NOT NULL)
-- Se reemplaza por procedimiento para cambiar rol
DELIMITER //
DROP PROCEDURE IF EXISTS cambiar_rol_usuario//
CREATE PROCEDURE cambiar_rol_usuario(
    IN p_id_usuario INT, 
    IN p_nuevo_rol ENUM('cliente','admin','trabajador','funeraria')
)
BEGIN
    DECLARE v_rol_actual ENUM('cliente','admin','trabajador','funeraria');
    
    SELECT rol INTO v_rol_actual FROM usuarios WHERE id = p_id_usuario;
    
    IF v_rol_actual IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    
    UPDATE usuarios 
    SET rol = p_nuevo_rol 
    WHERE id = p_id_usuario;
    
    SELECT CONCAT('Rol cambiado de ', v_rol_actual, ' a ', p_nuevo_rol) AS mensaje;
END //
DELIMITER ;

-- Procedimiento 4: Verificar familiares 
DELIMITER //
DROP PROCEDURE IF EXISTS verificar_familiares//
CREATE PROCEDURE verificar_familiares(IN nombre_cliente VARCHAR(100))
BEGIN
    SELECT 
        u.nombre AS cliente,
        COUNT(f.id_familiar) AS total_familiares,
        GROUP_CONCAT(f.nombre SEPARATOR ', ') AS nombres_familiares
    FROM usuarios u
    INNER JOIN clientes c ON u.id = c.id_usuario
    LEFT JOIN familiares f ON c.id_cliente = f.id_cliente
    WHERE u.nombre LIKE CONCAT('%', nombre_cliente, '%')
    GROUP BY u.id, u.nombre;
END //
DELIMITER ;

-- Procedimiento 5: Resumen por funeraria
DELIMITER //
DROP PROCEDURE IF EXISTS resumen_por_funeraria//
CREATE PROCEDURE resumen_por_funeraria(IN nombre_funeraria VARCHAR(100))
BEGIN
    SELECT 
        f.nombre AS funeraria,
        COUNT(DISTINCT CASE WHEN u.rol = 'trabajador' THEN u.id END) AS total_trabajadores,
        COUNT(DISTINCT CASE WHEN u.rol = 'admin' THEN u.id END) AS total_admins,
        COUNT(DISTINCT CASE WHEN u.rol = 'cliente' THEN u.id END) AS total_clientes,
        COUNT(DISTINCT r.id_recuerdo) AS total_recuerdos
    FROM funerarias f
    LEFT JOIN usuarios u ON f.id_funeraria = u.id_funeraria
    LEFT JOIN clientes c ON u.id = c.id_usuario
    LEFT JOIN recuerdos r ON c.id_cliente = r.id_cliente
    WHERE f.nombre LIKE CONCAT('%', nombre_funeraria, '%')
    GROUP BY f.id_funeraria, f.nombre;
END //
DELIMITER ;

-- ============================================================================
-- PROCEDIMIENTOS ADICIONALES NECESARIOS
-- ============================================================================

-- Procedimiento 6: Registrar nuevo recuerdo
DELIMITER //
DROP PROCEDURE IF EXISTS registrar_recuerdo//
CREATE PROCEDURE registrar_recuerdo(
    IN p_id_cliente INT,
    IN p_titulo VARCHAR(100),
    IN p_texto TEXT
)
BEGIN
    DECLARE v_existe INT;
    
    SELECT COUNT(*) INTO v_existe 
    FROM clientes 
    WHERE id_cliente = p_id_cliente;
    
    IF v_existe = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cliente no existe';
    END IF;
    
    INSERT INTO recuerdos (id_cliente, titulo, texto)
    VALUES (p_id_cliente, p_titulo, p_texto);
    
    SELECT LAST_INSERT_ID() AS id_recuerdo_creado;
END //
DELIMITER ;

-- Procedimiento 7: Marcar recuerdo como entregado
DELIMITER //
DROP PROCEDURE IF EXISTS marcar_recuerdo_entregado//
CREATE PROCEDURE marcar_recuerdo_entregado(IN p_id_recuerdo INT)
BEGIN
    UPDATE recuerdos 
    SET entregado = 1, 
        fecha_entrega = CURRENT_TIMESTAMP
    WHERE id_recuerdo = p_id_recuerdo 
    AND entregado = 0;
    
    IF ROW_COUNT() > 0 THEN
        SELECT 'Recuerdo marcado como entregado' AS mensaje;
    ELSE
        SELECT 'Recuerdo no encontrado o ya estaba entregado' AS mensaje;
    END IF;
END //
DELIMITER ;

-- Procedimiento 8: Enviar recuerdo a familiar
DELIMITER //
DROP PROCEDURE IF EXISTS enviar_recuerdo_familiar//
CREATE PROCEDURE enviar_recuerdo_familiar(
    IN p_id_recuerdo INT,
    IN p_id_familiar INT,
    IN p_metodo ENUM('Correo','SMS','WhatsApp')
)
BEGIN
    DECLARE v_id_cliente_recuerdo INT;
    DECLARE v_id_cliente_familiar INT;
    
    -- Verificar que el recuerdo existe
    SELECT id_cliente INTO v_id_cliente_recuerdo 
    FROM recuerdos 
    WHERE id_recuerdo = p_id_recuerdo;
    
    IF v_id_cliente_recuerdo IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Recuerdo no existe';
    END IF;
    
    -- Verificar que el familiar pertenece al mismo cliente
    SELECT id_cliente INTO v_id_cliente_familiar 
    FROM familiares 
    WHERE id_familiar = p_id_familiar;
    
    IF v_id_cliente_familiar IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Familiar no existe';
    END IF;
    
    IF v_id_cliente_recuerdo != v_id_cliente_familiar THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El familiar no pertenece al cliente del recuerdo';
    END IF;
    
    -- Registrar el envío
    INSERT INTO recuerdos_familiares (id_recuerdo, id_familiar, metodo_envio, estatus_envio)
    VALUES (p_id_recuerdo, p_id_familiar, p_metodo, 'Enviado');
    
    SELECT LAST_INSERT_ID() AS id_entrega;
END //
DELIMITER ;

-- Procedimiento 9: Obtener recuerdos de un cliente
DELIMITER //
DROP PROCEDURE IF EXISTS obtener_recuerdos_cliente//
CREATE PROCEDURE obtener_recuerdos_cliente(IN p_id_cliente INT)
BEGIN
    SELECT 
        r.id_recuerdo,
        r.titulo,
        r.texto,
        r.fecha_creacion,
        r.entregado,
        r.fecha_entrega,
        COUNT(rf.id_entrega) AS veces_enviado
    FROM recuerdos r
    LEFT JOIN recuerdos_familiares rf ON r.id_recuerdo = rf.id_recuerdo
    WHERE r.id_cliente = p_id_cliente
    GROUP BY r.id_recuerdo
    ORDER BY r.fecha_creacion DESC;
END //
DELIMITER ;
