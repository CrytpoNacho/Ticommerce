-- Script para corregir el problema del usuario ID 1 (estructura real)

-- PASO 1: Verificar estado actual
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
    s.seller_type
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.id = 1;

-- PASO 2: Mostrar qué vamos a eliminar
SELECT 
    'REGISTRO A ELIMINAR' as info,
    user_id,
    seller_type,
    fe_active
FROM sellers 
WHERE user_id = 1;

-- PASO 3: Eliminar el registro incorrecto de sellers
DELETE FROM sellers WHERE user_id = 1;

-- PASO 4: Verificar corrección
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

-- PASO 5: Contar vendedores restantes
SELECT 
    'VERIFICACIÓN FINAL' as status,
    COUNT(*) as total_sellers_remaining
FROM sellers;
