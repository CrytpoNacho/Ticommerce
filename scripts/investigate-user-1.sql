-- Investigar el usuario ID 1 específicamente

-- 1. Ver toda la información del usuario ID 1
SELECT 
    id,
    name,
    email,
    created_at,
    updated_at
FROM users 
WHERE id = 1;

-- 2. Verificar si el usuario ID 1 tiene registro en sellers
SELECT 
    s.id as seller_id,
    s.user_id,
    s.legal_name,
    s.brand_name,
    s.identification,
    s.phone,
    s.created_at as seller_created_at
FROM sellers s
WHERE s.user_id = 1;

-- 3. Ver todos los registros de sellers para entender el patrón
SELECT 
    s.id as seller_id,
    s.user_id,
    s.legal_name,
    s.brand_name,
    u.name as user_name,
    u.email as user_email
FROM sellers s
JOIN users u ON s.user_id = u.id
ORDER BY s.user_id;

-- 4. Verificar si hay inconsistencias en otros usuarios
SELECT 
    u.id,
    u.name,
    u.email,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as determined_type,
    s.legal_name
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
ORDER BY u.id
LIMIT 10;
