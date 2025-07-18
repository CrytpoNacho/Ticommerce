-- Verificar el estado actual del usuario ID 1 después de la corrección

-- 1. Información completa del usuario ID 1
SELECT 
    'USUARIO ID 1' as info,
    id,
    name,
    email,
    role,
    created_at,
    is_verified
FROM users 
WHERE id = 1;

-- 2. Verificar registro en sellers
SELECT 
    'REGISTRO EN SELLERS' as info,
    user_id,
    seller_type,
    fe_active,
    profile_picture_url
FROM sellers
WHERE user_id = 1;

-- 3. Productos del usuario ID 1
SELECT 
    'PRODUCTOS DEL USUARIO' as info,
    COUNT(*) as total_productos,
    COUNT(CASE WHEN is_active = true THEN 1 END) as productos_activos,
    COUNT(CASE WHEN is_active = false THEN 1 END) as productos_inactivos
FROM products
WHERE seller_id = 1;

-- 4. Resumen final de consistencia
SELECT 
    'RESUMEN FINAL' as info,
    (SELECT COUNT(*) FROM users WHERE role = 'buyer') as buyers_in_users,
    (SELECT COUNT(*) FROM users WHERE role = 'seller') as sellers_in_users,
    (SELECT COUNT(*) FROM sellers) as records_in_sellers,
    CASE 
        WHEN (SELECT COUNT(*) FROM users WHERE role = 'seller') = (SELECT COUNT(*) FROM sellers) 
        THEN 'CONSISTENTE ✅'
        ELSE 'INCONSISTENTE ❌'
    END as estado_consistencia;

-- 5. Verificación específica del usuario ID 1
SELECT 
    'VERIFICACIÓN USUARIO 1' as info,
    u.role as role_en_users,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'SÍ'
        ELSE 'NO'
    END as tiene_registro_seller,
    CASE 
        WHEN u.role = 'seller' AND s.user_id IS NOT NULL THEN 'CORRECTO ✅'
        WHEN u.role = 'buyer' AND s.user_id IS NULL THEN 'CORRECTO ✅'
        ELSE 'INCONSISTENTE ❌'
    END as estado_usuario_1
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.id = 1;
