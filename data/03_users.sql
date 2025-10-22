-- Usuario administrador: acceso total
CREATE USER 'admin_funeraria'@'%' IDENTIFIED BY 'Admin123!';
GRANT ALL PRIVILEGES ON funerarias_db.* TO 'admin_funeraria'@'%' WITH GRANT OPTION;

-- Usuario funeraria: CRUD completo sobre clientes
CREATE USER 'funeraria_user'@'%' IDENTIFIED BY 'Funeraria123!';
GRANT SELECT, INSERT, UPDATE, DELETE ON funerarias_db.clientes TO 'funeraria_user'@'%';
GRANT SELECT ON funerarias_db.funerarias TO 'funeraria_user'@'%';

-- Usuario cliente: acceso limitado a su información y recuerdos
CREATE USER 'cliente_user'@'%' IDENTIFIED BY 'Cliente123!';
GRANT SELECT, INSERT, UPDATE ON funerarias_db.usuarios TO 'cliente_user'@'%';
GRANT SELECT, INSERT, UPDATE ON funerarias_db.familiares TO 'cliente_user'@'%';
GRANT SELECT, INSERT, UPDATE ON funerarias_db.recuerdos TO 'cliente_user'@'%';
GRANT SELECT ON funerarias_db.recuerdos_enviados TO 'cliente_user'@'%';

-- Usuario empleado: puede actualizar estado de clientes
CREATE USER 'empleado_user'@'%' IDENTIFIED BY 'Empleado123!';
GRANT SELECT, UPDATE ON funerarias_db.clientes TO 'empleado_user'@'%';
GRANT SELECT ON funerarias_db.funerarias TO 'empleado_user'@'%';

FULSH PRIVILEGES;