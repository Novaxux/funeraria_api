-- Vista 1: Cantidad de recuerdos enviados por cliente
-- PROBLEMA: El GROUP BY falta, el COUNT no funcionará correctamente
CREATE OR REPLACE VIEW clientes_recuerdos AS
SELECT 
    u.nombre AS cliente, 
    COUNT(r.id_recuerdo) AS cantidad_recuerdos
FROM recuerdos r 
INNER JOIN clientes c ON r.id_cliente = c.id_cliente 
INNER JOIN usuarios u ON c.id_usuario = u.id
WHERE r.entregado = 1
GROUP BY u.nombre, c.id_cliente
ORDER BY cantidad_recuerdos DESC;

-- Vista 2: Relación de clientes con sus recuerdos
CREATE OR REPLACE VIEW cliente_recuerdos_enviados AS
SELECT 
    r.titulo, 
    r.fecha_creacion, 
    r.fecha_entrega, 
    u.nombre AS cliente,
    CASE 
        WHEN r.entregado = 1 THEN 'Entregado' 
        ELSE 'No entregado' 
    END AS confirmacion_envio
FROM recuerdos r 
INNER JOIN clientes c ON r.id_cliente = c.id_cliente
INNER JOIN usuarios u ON c.id_usuario = u.id
ORDER BY r.titulo;


-- Vista 3: Usuarios con su rol 
CREATE OR REPLACE VIEW rol_usuario AS
SELECT u.nombre AS nombre_usuario, u.rol 
FROM usuarios u;

-- Vista 4: Clientes, familiares y parentesco
CREATE OR REPLACE VIEW familiares_clientes AS
SELECT 
    u.nombre AS nombre_cliente,
    u.correo AS correo_cliente,
    u.telefono AS telefono_cliente,
    f.nombre AS nombre_familiar,
    f.correo AS correo_familiar,
    f.telefono AS telefono_familiar,
    f.parentesco AS parentesco_con_usuario
FROM clientes c
INNER JOIN usuarios u ON c.id_usuario = u.id
INNER JOIN familiares f ON c.id_cliente = f.id_cliente;

-- Vista 5: Funerarias con usuarios y clientes
CREATE OR REPLACE VIEW funeraria_usuario_cliente AS
SELECT 
    f.nombre AS funeraria,
    u.nombre AS usuario,
    u.rol AS tipo_usuario,
    c.id_cliente,
    uc.nombre AS nombre_cliente,
    c.estado_cliente
FROM funerarias f
LEFT JOIN usuarios u ON f.id_funeraria = u.id_funeraria
LEFT JOIN clientes c ON u.id = c.id_usuario AND u.rol = 'cliente'
LEFT JOIN usuarios uc ON c.id_usuario = uc.id;

-- ============================================================================
-- VISTAS ADICIONALES ÚTILES
-- ============================================================================

-- Vista 6: Recuerdos pendientes de envío
CREATE OR REPLACE VIEW recuerdos_pendientes AS
SELECT 
    u.nombre AS cliente,
    r.titulo,
    r.fecha_creacion,
    DATEDIFF(CURRENT_DATE, r.fecha_creacion) AS dias_sin_entregar
FROM recuerdos r
INNER JOIN clientes c ON r.id_cliente = c.id_cliente
INNER JOIN usuarios u ON c.id_usuario = u.id
WHERE r.entregado = 0
ORDER BY dias_sin_entregar DESC;

-- Vista 7: Resumen de recuerdos por familiar
CREATE OR REPLACE VIEW recuerdos_por_familiar AS
SELECT 
    f.nombre AS nombre_familiar,
    f.parentesco,
    u.nombre AS cliente,
    COUNT(rf.id_entrega) AS total_recuerdos_recibidos,
    SUM(CASE WHEN rf.estatus_envio = 'Enviado' THEN 1 ELSE 0 END) AS enviados,
    SUM(CASE WHEN rf.estatus_envio = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes,
    SUM(CASE WHEN rf.estatus_envio = 'Fallido' THEN 1 ELSE 0 END) AS fallidos
FROM familiares f
INNER JOIN clientes c ON f.id_cliente = c.id_cliente
INNER JOIN usuarios u ON c.id_usuario = u.id
LEFT JOIN recuerdos_familiares rf ON f.id_familiar = rf.id_familiar
GROUP BY f.id_familiar, f.nombre, f.parentesco, u.nombre;

-- Vista 8: Estadísticas por funeraria
CREATE OR REPLACE VIEW estadisticas_funeraria AS
SELECT 
    f.nombre AS funeraria,
    COUNT(DISTINCT CASE WHEN u.rol = 'trabajador' THEN u.id END) AS total_trabajadores,
    COUNT(DISTINCT CASE WHEN u.rol = 'admin' THEN u.id END) AS total_admins,
    COUNT(DISTINCT CASE WHEN u.rol = 'cliente' THEN u.id END) AS total_clientes,
    f.estado_funeraria
FROM funerarias f
LEFT JOIN usuarios u ON f.id_funeraria = u.id_funeraria
GROUP BY f.id_funeraria, f.nombre, f.estado_funeraria;
