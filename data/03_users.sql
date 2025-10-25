-- ============================================
--  USUARIOS Y PERMISOS DEL SISTEMA FUNERARIA
-- ============================================

-- ============================================
-- USUARIO ADMINISTRADOR
-- ============================================
CREATE USER IF NOT EXISTS 'admin_funeraria'@'%' IDENTIFIED BY 'Admin123!';
GRANT ALL PRIVILEGES ON funerarias_db.* TO 'admin_funeraria'@'%' WITH GRANT OPTION;

-- ============================================
-- USUARIO FUNERARIA
-- ============================================
CREATE USER IF NOT EXISTS 'funeraria_user'@'%' IDENTIFIED BY 'Funeraria123!';

GRANT SELECT, UPDATE, DELETE ON funerarias_db.funerarias TO 'funeraria_user'@'%';
GRANT INSERT ON funerarias_db.usuarios TO 'funeraria_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.clientes TO 'funeraria_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.trabajadores TO 'funeraria_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.familiares TO 'funeraria_user'@'%';

-- ============================================
-- USUARIO CLIENTE
-- ============================================
CREATE USER IF NOT EXISTS 'cliente_user'@'%' IDENTIFIED BY 'Cliente123!';

GRANT SELECT, UPDATE ON funerarias_db.usuarios TO 'cliente_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.familiares TO 'cliente_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.recuerdos TO 'cliente_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.recuerdos_familiares TO 'cliente_user'@'%';

-- ============================================
-- USUARIO EMPLEADO
-- ============================================
CREATE USER IF NOT EXISTS 'empleado_user'@'%' IDENTIFIED BY 'Empleado123!';

GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.usuarios TO 'empleado_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.clientes TO 'empleado_user'@'%';
GRANT SELECT ON funerarias_db.familiares TO 'empleado_user'@'%';

-- ============================================
-- APLICAR CAMBIOS
-- ============================================
FLUSH PRIVILEGES;
