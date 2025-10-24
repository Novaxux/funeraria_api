-- ============================================
--  USUARIOS Y PERMISOS DEL SISTEMA FUNERARIA
-- ============================================

-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS funerarias_db;
USE funerarias_db;

-- ============================================
-- USUARIO ADMINISTRADOR
-- ============================================
CREATE USER IF NOT EXISTS 'admin_funeraria'@'%' IDENTIFIED BY 'Admin123!';
GRANT ALL PRIVILEGES ON funerarias_db.* TO 'admin_funeraria'@'%' WITH GRANT OPTION;


-- ============================================
-- USUARIO FUNERARIA
-- ============================================
CREATE USER IF NOT EXISTS 'funeraria_user'@'%' IDENTIFIED BY 'Funeraria123!';

-- FUNERARIAS: puede leer, actualizar y eliminar solo su registro (lógica en API)
GRANT SELECT, UPDATE, DELETE ON funerarias_db.funerarias TO 'funeraria_user'@'%';

-- USUARIOS: puede crear (insert), pero no leer ni eliminar
GRANT INSERT ON funerarias_db.usuarios TO 'funeraria_user'@'%';

-- CLIENTES: CRUD completo
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.clientes TO 'funeraria_user'@'%';

-- TRABAJADORES: CRUD completo
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.trabajadores TO 'funeraria_user'@'%';

-- ADMINS: sin acceso
REVOKE ALL PRIVILEGES ON funerarias_db.admins FROM 'funeraria_user'@'%';

-- FAMILIARES: CRUD completo (solo de sus clientes, lógica en API)
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.familiares TO 'funeraria_user'@'%';

-- RECUERDOS y RECUERDOS_FAMILIARES: sin acceso
REVOKE ALL PRIVILEGES ON funerarias_db.recuerdos FROM 'funeraria_user'@'%';
REVOKE ALL PRIVILEGES ON funerarias_db.recuerdos_familiares FROM 'funeraria_user'@'%';


-- ============================================
-- USUARIO CLIENTE
-- ============================================
CREATE USER IF NOT EXISTS 'cliente_user'@'%' IDENTIFIED BY 'Cliente123!';

-- FUNERARIAS: sin acceso
REVOKE ALL PRIVILEGES ON funerarias_db.funerarias FROM 'cliente_user'@'%';

-- USUARIOS: puede leer y actualizar solo sus datos (controlado por API)
GRANT SELECT, UPDATE ON funerarias_db.usuarios TO 'cliente_user'@'%';

-- CLIENTES, TRABAJADORES, ADMINS: sin acceso
REVOKE ALL PRIVILEGES ON funerarias_db.clientes FROM 'cliente_user'@'%';
REVOKE ALL PRIVILEGES ON funerarias_db.trabajadores FROM 'cliente_user'@'%';
REVOKE ALL PRIVILEGES ON funerarias_db.admins FROM 'cliente_user'@'%';

-- FAMILIARES: CRUD completo
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.familiares TO 'cliente_user'@'%';

-- RECUERDOS y RECUERDOS_FAMILIARES: acceso total
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.recuerdos TO 'cliente_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.recuerdos_familiares TO 'cliente_user'@'%';


-- ============================================
-- USUARIO EMPLEADO
-- ============================================
CREATE USER IF NOT EXISTS 'empleado_user'@'%' IDENTIFIED BY 'Empleado123!';

-- FUNERARIAS: sin acceso
REVOKE ALL PRIVILEGES ON funerarias_db.funerarias FROM 'empleado_user'@'%';

-- USUARIOS: CRUD parcial (crear, actualizar, eliminar lógico — manejado por API)
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.usuarios TO 'empleado_user'@'%';

-- CLIENTES: CRUD completo
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.clientes TO 'empleado_user'@'%';

-- TRABAJADORES: sin acceso
REVOKE ALL PRIVILEGES ON funerarias_db.trabajadores FROM 'empleado_user'@'%';

-- ADMINS: sin acceso
REVOKE ALL PRIVILEGES ON funerarias_db.admins FROM 'empleado_user'@'%';

-- FAMILIARES: solo lectura (los de su funeraria)
GRANT SELECT ON funerarias_db.familiares TO 'empleado_user'@'%';

-- RECUERDOS y RECUERDOS_FAMILIARES: sin acceso
REVOKE ALL PRIVILEGES ON funerarias_db.recuerdos FROM 'empleado_user'@'%';
REVOKE ALL PRIVILEGES ON funerarias_db.recuerdos_familiares FROM 'empleado_user'@'%';


-- ============================================
-- APLICAR CAMBIOS
-- ============================================
FLUSH PRIVILEGES;
