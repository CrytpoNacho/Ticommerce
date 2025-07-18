-- Investigar el usuario ID 1 con la estructura REAL de la base de datos

-- 1. Ver información del usuario ID 1
SELECT 
    id,
    name,
    email,
    role,
    created_at,
    is_verified
FROM users 
WHERE id = 1;

-- 2. Verificar si el usuario ID 1 tiene registro en sellers (estructura real)
SELECT 
    user_id,
    seller_type,
    profile_picture_url,
    landing_description,
    fe_active
FROM sellers
WHERE user_id = 1;

-- 3. Ver todos los vendedores registrados
SELECT 
    s.user_id,
    s.seller_type,
    s.fe_active,
    u.name as user_name,
    u.email as user_email,
    u.role as user_role
FROM sellers s
JOIN users u ON s.user_id = u.id
ORDER BY s.user_id;

-- 4. Verificar inconsistencias en todos los usuarios
SELECT 
    u.id,
    u.name,
    u.email,
    u.role as db_role,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as determined_type,
    s.seller_type
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
ORDER BY u.id
LIMIT 10;

-- 5. Resumen de consistencia
SELECT 
    'RESUMEN' as info,
    (SELECT COUNT(*) FROM users WHERE role = 'buyer') as buyers_in_users,
    (SELECT COUNT(*) FROM users WHERE role = 'seller') as sellers_in_users,
    (SELECT COUNT(*) FROM sellers) as records_in_sellers;
