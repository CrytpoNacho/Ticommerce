-- Solución definitiva: Cambiar el rol del usuario ID 1 a 'seller'
-- Ya que tiene 12 productos activos, claramente es un vendedor

-- PASO 1: Verificar estado antes del cambio
SELECT 
    'ANTES DEL CAMBIO' as status,
    u.id,
    u.name,
    u.email,
    u.role as current_role,
    COUNT(p.id) as total_products
FROM users u
LEFT JOIN products p ON u.id = p.seller_id
WHERE u.id = 1
GROUP BY u.id, u.name, u.email, u.role;

-- PASO 2: Cambiar el rol del usuario a 'seller'
UPDATE users 
SET role = 'seller' 
WHERE id = 1;

-- PASO 3: Verificar estado después del cambio
SELECT 
    'DESPUÉS DEL CAMBIO' as status,
    u.id,
    u.name,
    u.email,
    u.role as new_role,
    COUNT(p.id) as total_products
FROM users u
LEFT JOIN products p ON u.id = p.seller_id
WHERE u.id = 1
GROUP BY u.id, u.name, u.email, u.role;

-- PASO 4: Verificar que ya no hay inconsistencias
SELECT 
    'VERIFICACIÓN FINAL' as info,
    (SELECT COUNT(*) FROM users WHERE role = 'buyer') as buyers_in_users,
    (SELECT COUNT(*) FROM users WHERE role = 'seller') as sellers_in_users,
    (SELECT COUNT(*) FROM sellers) as records_in_sellers;

-- PASO 5: Confirmar que el problema está resuelto
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM users WHERE role = 'seller') = (SELECT COUNT(*) FROM sellers)
        THEN '✅ PROBLEMA RESUELTO - No hay inconsistencias'
        ELSE '❌ AÚN HAY INCONSISTENCIAS'
    END as resultado;
