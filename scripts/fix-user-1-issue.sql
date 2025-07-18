-- Script para corregir el problema del usuario ID 1

-- PASO 1: Verificar el estado actual
SELECT 
    'ANTES DE CORRECCIÓN' as status,
    u.id,
    u.name,
    u.email,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as current_type,
    s.legal_name
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.id = 1;

-- PASO 2: Eliminar el registro incorrecto de sellers para el usuario ID 1
-- (Solo si el usuario ID 1 NO debería ser vendedor)
DELETE FROM sellers WHERE user_id = 1;

-- PASO 3: Verificar que se corrigió
SELECT 
    'DESPUÉS DE CORRECCIÓN' as status,
    u.id,
    u.name,
    u.email,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as new_type,
    s.legal_name
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.id = 1;

-- PASO 4: Verificar que no afectamos otros usuarios
SELECT 
    'VERIFICACIÓN GENERAL' as status,
    COUNT(*) as total_sellers
FROM sellers;
