-- SOLUCIÓN CORRECTA: Convertir usuario ID 1 a BUYER
-- Reasignando sus productos a otro vendedor

-- PASO 0: Verificar estado actual
SELECT 'ESTADO ACTUAL' as info, id, name, email, role FROM users WHERE id = 1;
SELECT 'PRODUCTOS ACTUALES' as info, COUNT(*) as total FROM products WHERE seller_id = 1;

-- PASO 1: Identificar un vendedor válido para transferir los productos
SELECT 'VENDEDOR DESTINO' as info, id, name, email, role 
FROM users 
WHERE role = 'seller' AND id != 1
LIMIT 1;

-- PASO 2: Transferir los productos a otro vendedor (usamos ID 8 como ejemplo, ajustar si es necesario)
UPDATE products 
SET seller_id = 8 -- Ajustar este ID al vendedor destino identificado arriba
WHERE seller_id = 1;

-- PASO 3: Verificar que no quedan productos asociados al usuario ID 1
SELECT 'PRODUCTOS DESPUÉS DE TRANSFERENCIA' as info, COUNT(*) as total FROM products WHERE seller_id = 1;

-- PASO 4: Eliminar el registro de la tabla sellers
DELETE FROM sellers WHERE user_id = 1;

-- PASO 5: Asegurar que el rol en users es 'buyer'
UPDATE users SET role = 'buyer' WHERE id = 1;

-- PASO 6: Verificar estado final
SELECT 'ESTADO FINAL' as info, id, name, email, role FROM users WHERE id = 1;
SELECT 'VERIFICACIÓN SELLERS' as info, COUNT(*) as registros FROM sellers WHERE user_id = 1;

-- PASO 7: Verificar consistencia general
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
