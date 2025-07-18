-- CUIDADO: Este script limpia datos. Ejecutar solo si es necesario.

-- 1. Eliminar relaciones huérfanas
DELETE FROM product_variant_values 
WHERE variant_id NOT IN (SELECT id FROM product_variants);

DELETE FROM product_variant_values 
WHERE value_id NOT IN (SELECT id FROM variant_values);

-- 2. Eliminar valores huérfanos
DELETE FROM variant_values 
WHERE option_id NOT IN (SELECT id FROM variant_options);

-- 3. Eliminar variantes de productos que no existen
DELETE FROM product_variants 
WHERE product_id NOT IN (SELECT id FROM products);

-- 4. Eliminar archivos multimedia huérfanos de variantes
DELETE FROM product_media 
WHERE variant_id IS NOT NULL 
AND variant_id NOT IN (SELECT id FROM product_variants);

-- 5. Verificar integridad después de la limpieza
SELECT 'DESPUÉS DE LIMPIEZA' as status;
SELECT 
  (SELECT COUNT(*) FROM product_variants) as variantes,
  (SELECT COUNT(*) FROM variant_options) as opciones,
  (SELECT COUNT(*) FROM variant_values) as valores,
  (SELECT COUNT(*) FROM product_variant_values) as relaciones,
  (SELECT COUNT(*) FROM product_media WHERE variant_id IS NOT NULL) as archivos_variantes;
