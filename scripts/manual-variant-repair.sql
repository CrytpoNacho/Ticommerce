-- Script manual para reparar variantes específicas
-- Ejecutar después de analizar los datos específicos

-- Ejemplo de cómo reparar una variante específica:
-- 1. Crear la opción si no existe
-- INSERT INTO variant_options (name) VALUES ('color') ON CONFLICT (name) DO NOTHING;

-- 2. Crear el valor si no existe
-- INSERT INTO variant_values (option_id, value) 
-- SELECT id, 'azul' FROM variant_options WHERE name = 'color'
-- ON CONFLICT DO NOTHING;

-- 3. Relacionar la variante con el valor
-- INSERT INTO product_variant_values (variant_id, value_id)
-- SELECT 3, vv.id 
-- FROM variant_values vv 
-- JOIN variant_options vo ON vv.option_id = vo.id 
-- WHERE vo.name = 'color' AND vv.value = 'azul';

-- Para reparar todas las variantes automáticamente, necesitamos ver los SKUs específicos
SELECT 'VARIANTES PARA REPARAR MANUALMENTE' as section;
SELECT 
  pv.id as variant_id,
  pv.product_id,
  pv.sku,
  p.name as product_name,
  'Necesita atributos' as status
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
WHERE pvv.variant_id IS NULL
ORDER BY pv.product_id, pv.id;
