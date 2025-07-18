-- Script para investigar qué productos tiene el usuario ID 1

-- PASO 1: Ver información completa del usuario ID 1
SELECT 
    'INFORMACIÓN DEL USUARIO' as info,
    u.id,
    u.name,
    u.email,
    u.role as db_role,
    u.created_at
FROM users u
WHERE u.id = 1;

-- PASO 2: Ver registro en sellers
SELECT 
    'REGISTRO EN SELLERS' as info,
    s.user_id,
    s.seller_type,
    s.profile_picture_url,
    s.fe_active
FROM sellers s
WHERE s.user_id = 1;

-- PASO 3: Ver productos asociados
SELECT 
    'PRODUCTOS DEL USUARIO' as info,
    p.id as product_id,
    p.name as product_name,
    p.price,
    p.is_active,
    p.stock_quantity,
    p.created_at
FROM products p
WHERE p.seller_id = 1;

-- PASO 4: Contar productos
SELECT 
    'RESUMEN PRODUCTOS' as info,
    COUNT(*) as total_products,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_products,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_products
FROM products
WHERE seller_id = 1;
