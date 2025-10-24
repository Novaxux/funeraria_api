/* ============================================
   TRIGGERS
   ============================================ */

/* Trigger 1: Validar que la funeraria existe antes de insertar cliente */
DELIMITER //
CREATE TRIGGER validar_funeraria_existe_cliente 
BEFORE INSERT ON clientes
FOR EACH ROW
BEGIN
    DECLARE funeraria_count INT;
    
    -- Verificar si la funeraria existe
    SELECT COUNT(*) INTO funeraria_count
    FROM funerarias
    WHERE id_funeraria = NEW.id_funeraria;
    
    -- Si no existe, lanzar error
    IF funeraria_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La funeraria especificada no existe';
    END IF;
END //
DELIMITER ;


/* Trigger 2: Validar que el cliente existe antes de insertar familiar */
DELIMITER //
CREATE TRIGGER validar_cliente_existe_familiar 
BEFORE INSERT ON familiares
FOR EACH ROW
BEGIN
    DECLARE cliente_count INT;
    
    -- Verificar si el cliente existe y está activo
    SELECT COUNT(*) INTO cliente_count
    FROM clientes
    WHERE id_cliente = NEW.id_cliente
    AND estatus = 1; -- Asumiendo 1 = activo
    
    -- Si no existe, lanzar error
    IF cliente_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente especificado no existe o está inactivo';
    END IF;
END //
DELIMITER ;

/* Trigger 3: Validar asignación cliente-usuario */
DELIMITER //
CREATE TRIGGER validar_asignacion_cliente_usuario 
BEFORE INSERT ON clientes_usuarios
FOR EACH ROW
BEGIN
    DECLARE cliente_count INT;
    DECLARE usuario_count INT;
    
    -- Verificar que el cliente existe y está activo
    SELECT COUNT(*) INTO cliente_count
    FROM clientes
    WHERE id_cliente = NEW.id_cliente
    AND estatus = 1; -- Columna 'estatus' en clientes
    
    -- Verificar que el usuario existe y está activo
    SELECT COUNT(*) INTO usuario_count
    FROM usuarios
    WHERE id = NEW.id_usuario
    AND status = 1; -- Columna 'status' en usuarios
    
    -- Validaciones
    IF cliente_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El cliente especificado no existe o está inactivo';
    END IF;
    
    IF usuario_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El usuario especificado no existe o está inactivo';
    END IF;
END //
DELIMITER ;

/* Trigger 4: Actualizar fecha de entrega al marcar recuerdo como entregado */
DELIMITER //
CREATE TRIGGER actualizar_fecha_entrega_recuerdo 
BEFORE UPDATE ON recuerdos
FOR EACH ROW
BEGIN
    -- Si se marca como entregado y no tenía fecha, asignar fecha actual
    IF NEW.entregado = 1 AND OLD.entregado = 0 THEN
        IF NEW.fecha_entrega IS NULL THEN
            SET NEW.fecha_entrega = CURRENT_TIMESTAMP;
        END IF;
    END IF;
    
    -- Si se desmarca como entregado, quitar fecha de entrega
    IF NEW.entregado = 0 AND OLD.entregado = 1 THEN
        SET NEW.fecha_entrega = NULL;
    END IF;
END //
DELIMITER ;

/* Trigger 5: Validar que el recuerdo y familiar existen antes de registrar envío */
DELIMITER //
CREATE TRIGGER validar_recuerdo_familiar_envio 
BEFORE INSERT ON recuerdos_enviados
FOR EACH ROW
BEGIN
    DECLARE recuerdo_count INT;
    DECLARE familiar_count INT;
    
    -- Verificar que el recuerdo existe
    SELECT COUNT(*) INTO recuerdo_count
    FROM recuerdos
    WHERE id_recuerdo = NEW.id_recuerdo;
    
    -- Verificar que el familiar existe
    SELECT COUNT(*) INTO familiar_count
    FROM familiares
    WHERE id_familiar = NEW.id_familiar;
    
    -- Validaciones
    IF recuerdo_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El recuerdo especificado no existe';
    END IF;
    
    IF familiar_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El familiar especificado no existe';
    END IF;
END //
DELIMITER ;

/* Trigger 6: Incrementar contador de intentos al actualizar envío */
DELIMITER //
CREATE TRIGGER incrementar_intentos_envio 
BEFORE UPDATE ON recuerdos_enviados
FOR EACH ROW
BEGIN
    -- Si el estatus cambia a 'Fallido' y no era 'Fallido' antes
    IF NEW.estatus_envio = 'Fallido' AND OLD.estatus_envio != 'Fallido' THEN
        -- Incrementar el contador de intentos
        SET NEW.intentos = OLD.intentos + 1;
    END IF;
END //
DELIMITER ;


/* Trigger 7: Validar edad del familiar (debe ser positiva) */
DELIMITER //
CREATE TRIGGER validar_edad_familiar 
BEFORE INSERT ON familiares
FOR EACH ROW
BEGIN
    IF NEW.edad IS NOT NULL AND NEW.edad < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La edad del familiar no puede ser negativa';
    END IF;
END //
DELIMITER ;

/* Trigger 8: Validar fecha de muerte del cliente */
DELIMITER //
CREATE TRIGGER validar_fecha_muerte_cliente 
BEFORE INSERT ON clientes
FOR EACH ROW
BEGIN
    -- Si tiene fecha de muerte, debe ser posterior a fecha de nacimiento
    IF NEW.fecha_muerte IS NOT NULL AND NEW.fecha_nacimiento IS NOT NULL THEN
        IF NEW.fecha_muerte < NEW.fecha_nacimiento THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La fecha de muerte no puede ser anterior a la fecha de nacimiento';
        END IF;
    END IF;
    
    -- Si tiene fecha de muerte, el estatus debe ser 0 (Fallecido)
    IF NEW.fecha_muerte IS NOT NULL THEN
        SET NEW.estatus = 0; -- Asumiendo 1=activo, 0=fallecido
    END IF;
END //
DELIMITER ;

/* Trigger 9: Validar fecha de muerte en actualización de cliente */
DELIMITER //
CREATE TRIGGER validar_fecha_muerte_cliente_update 
BEFORE UPDATE ON clientes
FOR EACH ROW
BEGIN
    -- Si tiene fecha de muerte, debe ser posterior a fecha de nacimiento
    IF NEW.fecha_muerte IS NOT NULL AND NEW.fecha_nacimiento IS NOT NULL THEN
        IF NEW.fecha_muerte < NEW.fecha_nacimiento THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La fecha de muerte no puede ser anterior a la fecha de nacimiento';
        END IF;
    END IF;
    
    -- Si se agrega fecha de muerte, cambiar estatus a 0 (Fallecido)
    IF NEW.fecha_muerte IS NOT NULL AND OLD.fecha_muerte IS NULL THEN
        SET NEW.estatus = 0; -- Asumiendo 1=activo, 0=fallecido
    END IF;
END //
DELIMITER ;

/* Trigger 10: Validar formato email*/
DELIMITER //
CREATE TRIGGER validar_email_funeraria
BEFORE INSERT ON funerarias
FOR EACH ROW
BEGIN
    IF NEW.correo_contacto IS NOT NULL AND NEW.correo_contacto NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El formato del email es inválido';
    END IF;
END //
DELIMITER ;
