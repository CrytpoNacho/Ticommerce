-- Script para corregir datos inconsistentes
-- SOLO EJECUTAR DESPUÉS DE REVISAR LOS RESULTADOS DEL DEBUG

-- Verificar el estado actual antes de hacer cambios
SELECT 
    u.id,
    u.name,
    u.email,
    CASE 
        WHEN s.user_id IS NOT NULL THEN 'seller'
        ELSE 'buyer'
    END as current_type
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
WHERE u.email IN ('nacho@gmail.com', 'nachito@gmail.com')
ORDER BY u.id;

-- Si necesitamos eliminar registros duplicados o inconsistentes:
-- (DESCOMENTAR SOLO SI ES NECESARIO)

-- DELETE FROM sellers WHERE user_id = 1; -- Solo si el usuario 1 NO debería ser seller
-- DELETE FROM users WHERE id = X AND email = 'email_duplicado'; -- Solo para duplicados

-- Verificar el resultado después de los cambios
-- SELECT 
--     u.id,
--     u.name,
--     u.email,
--     CASE 
--         WHEN s.user_id IS NOT NULL THEN 'seller'
--         ELSE 'buyer'
--     END as new_type
-- FROM users u
-- LEFT JOIN sellers s ON u.id = s.user_id
-- WHERE u.email IN ('nacho@gmail.com', 'nachito@gmail.com')
-- ORDER BY u.id;
