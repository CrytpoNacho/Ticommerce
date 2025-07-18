-- Investigar el usuario ID 1 específicamente (VERSIÓN FINAL CORREGIDA)

-- 1. Ver toda la información del usuario ID 1
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM users 
WHERE id = 1;

-- 2. Verificar si el usuario ID 1 tiene registro en sellers
SELECT 
    user_id,
    legal_name,
    brand_name,
    identification,
    phone,
    created_at as seller_created_at
FROM sellers
WHERE user_id = 1;

-- 3. Ver todos los registros de sellers para entender el patrón
SELECT 
    s.user_id,
    s.legal_name,
    s.brand_name,
    u.name as user_name,
    u.email as user_email,
    u.role as user_role
FROM sellers s
JOIN users u ON s.user_id = u.id
ORDER BY s.user_id;

-- 4. Verificar si hay inconsistencias en otros usuarios
SELECT 
    u.id,
    u.name,
    u.email,
    u.role as db_role,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as determined_type,
    s.legal_name
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
ORDER BY u.id
LIMIT 10;

-- 5. Contar totales para verificar consistencia
SELECT 
    'RESUMEN' as info,
    (SELECT COUNT(*) FROM users WHERE role = 'buyer') as buyers_in_users,
    (SELECT COUNT(*) FROM users WHERE role = 'seller') as sellers_in_users,
    (SELECT COUNT(*) FROM sellers) as records_in_sellers;
