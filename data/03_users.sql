-- ============================================
-- CREACIÓN DE USUARIOS
-- ============================================
CREATE USER 'admin_funeraria'@'%' IDENTIFIED BY 'Admin123!';
CREATE USER 'funeraria_user'@'%' IDENTIFIED BY 'Funeraria123!';
CREATE USER 'empleado_user'@'%' IDENTIFIED BY 'Empleado123!';
CREATE USER 'cliente_user'@'%' IDENTIFIED BY 'Cliente123!';

-- ============================================
-- ASIGNACIÓN DE PRIVILEGIOS
-- ============================================

-- ADMIN: acceso total a todo (tablas, funciones, vistas, procedimientos)
GRANT ALL PRIVILEGES ON funeraria_db.* TO 'admin_funeraria'@'%';

-- FUNERARIA: acceso CRUD completo a clientes, familiares, recuerdos y entregas
GRANT SELECT, INSERT, UPDATE, DELETE ON funeraria_db.clientes TO 'funeraria_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funeraria_db.familiares TO 'funeraria_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funeraria_db.recuerdos TO 'funeraria_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funeraria_db.entregas TO 'funeraria_user'@'%';

-- EMPLEADO: solo puede leer y actualizar el estado del cliente
GRANT SELECT, UPDATE (estatus) ON funeraria_db.clientes TO 'empleado_user'@'%';

-- CLIENTE: puede leer e insertar/actualizar sus propios datos familiares y recuerdos
GRANT SELECT, INSERT, UPDATE ON funeraria_db.familiares TO 'cliente_user'@'%';
GRANT SELECT, INSERT, UPDATE ON funeraria_db.recuerdos TO 'cliente_user'@'%';

-- ============================================
-- APLICAR CAMBIOS
-- ============================================
FLUSH PRIVILEGES;
