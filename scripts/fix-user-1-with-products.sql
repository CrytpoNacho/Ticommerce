-- Script para corregir el usuario ID 1 manejando los productos

-- PASO 1: Verificar estado actual
SELECT 
    'ESTADO ACTUAL' as status,
    u.id,
    u.name,
    u.email,
    u.role as db_role,
    s.seller_type,
    COUNT(p.id) as total_products
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
LEFT JOIN products p ON s.user_id = p.seller_id
WHERE u.id = 1
GROUP BY u.id, u.name, u.email, u.role, s.seller_type;

-- OPCIÓN 1: Cambiar el rol del usuario a 'seller' (si tiene productos legítimos)
-- UPDATE users SET role = 'seller' WHERE id = 1;

-- OPCIÓN 2: Reasignar productos a otro vendedor (si los productos no son legítimos)
-- Primero necesitamos ver qué otros vendedores existen
SELECT 
    'OTROS VENDEDORES DISPONIBLES' as info,
    u.id,
    u.name,
    u.email,
    s.seller_type
FROM users u
JOIN sellers s ON u.id = s.user_id
WHERE u.id != 1 AND u.role = 'seller';

-- OPCIÓN 3: Eliminar productos y luego el registro de seller
-- CUIDADO: Esto eliminará permanentemente los productos
-- DELETE FROM products WHERE seller_id = 1;
-- DELETE FROM sellers WHERE user_id = 1;

-- Por ahora, solo mostramos las opciones sin ejecutar nada
SELECT 'OPCIONES DISPONIBLES:' as info,
       '1. Cambiar usuario a seller (si los productos son legítimos)' as opcion1,
       '2. Reasignar productos a otro vendedor' as opcion2,
       '3. Eliminar productos y registro de seller' as opcion3;
