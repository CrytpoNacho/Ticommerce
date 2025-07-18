-- Script final para corregir el problema del usuario ID 1

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
    END as current_type,
    s.legal_name
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.id = 1;

-- PASO 2: Mostrar qué vamos a eliminar
SELECT 
    'REGISTRO A ELIMINAR' as info,
    user_id,
    legal_name,
    brand_name,
    created_at
FROM sellers 
WHERE user_id = 1;

-- PASO 3: Eliminar el registro incorrecto de sellers para el usuario ID 1
DELETE FROM sellers WHERE user_id = 1;

-- PASO 4: Verificar que se corrigió
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

-- PASO 5: Verificar que no afectamos otros usuarios
SELECT 
    'VERIFICACIÓN FINAL' as status,
    COUNT(*) as total_sellers_remaining
FROM sellers;
