-- Script para debuggear el problema de usuarios
-- Verificar usuarios con emails similares

-- 1. Buscar todos los usuarios con emails que contengan "nacho"
SELECT 
    id,
    name,
    email,
    created_at,
    updated_at
FROM users 
WHERE email ILIKE '%nacho%'
ORDER BY id;

-- 2. Verificar qué usuarios están en la tabla sellers
SELECT 
    s.id as seller_id,
    s.user_id,
    s.legal_name,
    s.brand_name,
    u.name as user_name,
    u.email as user_email
FROM sellers s
JOIN users u ON s.user_id = u.id
WHERE u.email ILIKE '%nacho%'
ORDER BY s.user_id;

-- 3. Verificar si hay duplicados o inconsistencias
SELECT 
    u.id,
    u.name,
    u.email,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as user_type,
    s.legal_name,
    s.brand_name
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.email ILIKE '%nacho%'
ORDER BY u.id;

-- 4. Verificar si hay problemas con los hashes de contraseña
SELECT 
    id,
    name,
    email,
    LENGTH(password_hash) as hash_length,
    LEFT(password_hash, 10) as hash_preview
FROM users 
WHERE email ILIKE '%nacho%'
ORDER BY id;

-- 5. Buscar posibles emails duplicados o muy similares
SELECT 
    email,
    COUNT(*) as count
FROM users 
GROUP BY email
HAVING COUNT(*) > 1;
