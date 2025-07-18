-- Script simplificado para corregir el problema del usuario ID 1

-- PASO 1: Verificar el estado actual
SELECT 
    'ANTES DE CORRECCIÓN' as status,
    u.id,
    u.name,
    u.email,
    u.role as db_role,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as current_type
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.id = 1;

-- PASO 2: Eliminar el registro incorrecto de sellers para el usuario ID 1
DELETE FROM sellers WHERE user_id = 1;

-- PASO 3: Verificar que se corrigió
SELECT 
    'DESPUÉS DE CORRECCIÓN' as status,
    u.id,
    u.name,
    u.email,
    u.role as db_role,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as new_type
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.id = 1;

-- PASO 4: Verificar que no afectamos otros usuarios
SELECT 
    'VERIFICACIÓN GENERAL' as status,
    COUNT(*) as total_sellers
FROM sellers;
