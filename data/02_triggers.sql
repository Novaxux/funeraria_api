/* ============================================
   TRIGGERS
   ============================================ */

/* Trigger 1: Validar que la funeraria existe antes de insertar cliente */
DELIMITER //
CREATE TRIGGER validar_funeraria_existe_cliente 
BEFORE INSERT ON Clientes
FOR EACH ROW
BEGIN
    DECLARE funeraria_count INT;
    
    -- Verificar si la funeraria existe y no está eliminada
    SELECT COUNT(*) INTO funeraria_count
    FROM Funerarias
    WHERE id_funeraria = NEW.id_funeraria
    AND deleted_at IS NULL;
    
    -- Si no existe, lanzar error
    IF funeraria_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La funeraria especificada no existe o está inactiva';
    END IF;
END //
DELIMITER ;

/* Trigger 2: Validar que el cliente existe antes de insertar familiar */
DELIMITER //
CREATE TRIGGER validar_cliente_existe_familiar 
BEFORE INSERT ON Familiares
FOR EACH ROW
BEGIN
    DECLARE cliente_count INT;
    
    -- Verificar si el cliente existe y no está eliminado
    SELECT COUNT(*) INTO cliente_count
    FROM Clientes
    WHERE id_cliente = NEW.id_cliente
    AND deleted_at IS NULL;
    
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
BEFORE INSERT ON Clientes_usuarios
FOR EACH ROW
BEGIN
    DECLARE cliente_count INT;
    DECLARE usuario_count INT;
    
    -- Verificar que el cliente existe
    SELECT COUNT(*) INTO cliente_count
    FROM Clientes
    WHERE id_cliente = NEW.id_cliente
    AND deleted_at IS NULL;
    
    -- Verificar que el usuario existe
    SELECT COUNT(*) INTO usuario_count
    FROM Usuarios
    WHERE id = NEW.id_usuario
    AND deleted_at IS NULL;
    
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
BEFORE UPDATE ON Recuerdos
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
BEFORE INSERT ON Recuerdos_enviados
FOR EACH ROW
BEGIN
    DECLARE recuerdo_count INT;
    DECLARE familiar_count INT;
    
    -- Verificar que el recuerdo existe
    SELECT COUNT(*) INTO recuerdo_count
    FROM Recuerdos
    WHERE id_recuerdo = NEW.id_recuerdo;
    
    -- Verificar que el familiar existe
    SELECT COUNT(*) INTO familiar_count
    FROM Familiares
    WHERE id_familiar = NEW.id_familiar
    AND deleted_at IS NULL;
    
    -- Validaciones
    IF recuerdo_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El recuerdo especificado no existe';
    END IF;
    
    IF familiar_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El familiar especificado no existe o está inactivo';
    END IF;
END //
DELIMITER ;

/* Trigger 6: Incrementar contador de intentos al actualizar envío */
DELIMITER //
CREATE TRIGGER incrementar_intentos_envio 
BEFORE UPDATE ON Recuerdos_enviados
FOR EACH ROW
BEGIN
    -- Si el estatus cambia a Fallido, incrementar intentos
    IF NEW.estatus_envio = 'Fallido' AND OLD.estatus_envio != 'Fallido' THEN
        SET NEW.intentos = OLD.intentos + 1;
    END IF;
END //
DELIMITER ;

/* Trigger 7: Validar edad del familiar (debe ser positiva) */
DELIMITER //
CREATE TRIGGER validar_edad_familiar 
BEFORE INSERT ON Familiares
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
BEFORE INSERT ON Clientes
FOR EACH ROW
BEGIN
    -- Si tiene fecha de muerte, debe ser posterior a fecha de nacimiento
    IF NEW.fecha_muerte IS NOT NULL AND NEW.fecha_nacimiento IS NOT NULL THEN
        IF NEW.fecha_muerte < NEW.fecha_nacimiento THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La fecha de muerte no puede ser anterior a la fecha de nacimiento';
        END IF;
    END IF;
    
    -- Si tiene fecha de muerte, el estatus debe ser Fallecido
    IF NEW.fecha_muerte IS NOT NULL THEN
        SET NEW.estatus = 'Fallecido';
    END IF;
END //
DELIMITER ;

/* Trigger 9: Validar fecha de muerte en actualización de cliente */
DELIMITER //
CREATE TRIGGER validar_fecha_muerte_cliente_update 
BEFORE UPDATE ON Clientes
FOR EACH ROW
BEGIN
    -- Si tiene fecha de muerte, debe ser posterior a fecha de nacimiento
    IF NEW.fecha_muerte IS NOT NULL AND NEW.fecha_nacimiento IS NOT NULL THEN
        IF NEW.fecha_muerte < NEW.fecha_nacimiento THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'La fecha de muerte no puede ser anterior a la fecha de nacimiento';
        END IF;
    END IF;
    
    -- Si se agrega fecha de muerte, cambiar estatus a Fallecido
    IF NEW.fecha_muerte IS NOT NULL AND OLD.fecha_muerte IS NULL THEN
        SET NEW.estatus = 'Fallecido';
    END IF;
END //
DELIMITER ;

/* Trigger 10: Validar formato email*/
DELIMITER //
CREATE TRIGGER validar_email_funeraria
BEFORE INSERT ON Funeraria
FOR EACH ROW
BEGIN
	IF NEW.correo_contacto IS NOT NULL AND NEW.correo_contacto NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El formato del email es inválido';
    END IF;
END //
DELIMITER ;

/* Trigger 11: Sólo un contacto principal por entidad */
DELIMITER //
CREATE TRIGGER validar_solo_un_contacto_principal_insert
BEFORE INSERT ON Contactos
FOR EACH ROW
BEGIN
    DECLARE contacto_principal_count INT;
    
    -- Solo validar si el nuevo contacto se marca como principal
    IF NEW.principal = 1 THEN
        -- Verificar si ya existe otro contacto principal para esa entidad y tipo
        SELECT COUNT(*) INTO contacto_principal_count
        FROM Contactos
        WHERE entidad_tipo = NEW.entidad_tipo
        AND entidad_id = NEW.entidad_id
        AND principal = 1;
        
        -- Si ya existe uno principal, lanzar error
        IF contacto_principal_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ya existe un contacto principal para esta entidad. Cambie el contacto principal existente primero';
        END IF;
    END IF;
END //
DELIMITER ;

/* Trigger 12: Validar contacto principal en UPDATE */
DELIMITER //
CREATE TRIGGER validar_solo_un_contacto_principal_update
BEFORE UPDATE ON Contactos
FOR EACH ROW
BEGIN
    DECLARE contacto_principal_count INT;
    
    -- Solo validar si se está marcando como principal
    IF NEW.principal = 1 AND OLD.principal = 0 THEN
        -- Verificar si ya existe otro contacto principal
        SELECT COUNT(*) INTO contacto_principal_count
        FROM Contactos
        WHERE entidad_tipo = NEW.entidad_tipo
        AND entidad_id = NEW.entidad_id
        AND principal = 1
        AND id_contacto != NEW.id_contacto; -- Excluir el registro actual
        
        -- Si ya existe uno principal, lanzar error
        IF contacto_principal_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ya existe un contacto principal para esta entidad. Cambie el contacto principal existente primero';
        END IF;
    END IF;
END //
DELIMITER ;

