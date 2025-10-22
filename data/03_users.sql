-- Crear usuario de aplicación (permisos mínimos)
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'app_password';
GRANT SELECT ON `kitchy`.`recipes` TO 'app_user'@'%';
GRANT SELECT ON `kitchy`.`recipe_ingredients` TO 'app_user'@'%';
GRANT SELECT ON `kitchy`.`ingredients` TO 'app_user'@'%';
GRANT SELECT ON `kitchy`.`units` TO 'app_user'@'%';
GRANT SELECT ON `kitchy`.`categories` TO 'app_user'@'%';
GRANT SELECT ON `kitchy`.`countries` TO 'app_user'@'%'; 
GRANT SELECT, INSERT, UPDATE ON `kitchy`.`favorites` TO 'app_user'@'%';
GRANT SELECT, INSERT, UPDATE ON `kitchy`.`likes` TO 'app_user'@'%';
GRANT SELECT, INSERT, UPDATE ON `kitchy`.`users` TO 'app_user'@'%';


-- Crear usuario admin (permisos amplios pero seguros)
CREATE USER IF NOT EXISTS 'admin_user'@'%' IDENTIFIED BY 'admin_password';

-- Otorgar permisos amplios excepto DROP, CREATE USER, SUPER y SHUTDOWN
GRANT SELECT, INSERT, UPDATE, DELETE,
      CREATE, ALTER, INDEX, REFERENCES,
      CREATE TEMPORARY TABLES, LOCK TABLES,
      EXECUTE, SHOW VIEW, CREATE VIEW, EVENT, TRIGGER
ON `kitchy`.* TO 'admin_user'@'%';

FLUSH PRIVILEGES;