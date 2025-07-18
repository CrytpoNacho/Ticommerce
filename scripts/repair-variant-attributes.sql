-- Script para reparar atributos de variantes basándose en SKUs
-- IMPORTANTE: Ejecutar paso a paso y verificar cada resultado

-- Paso 1: Crear opciones de variantes que faltan
INSERT INTO variant_options (name)
SELECT DISTINCT 
  CASE 
    WHEN sku LIKE '%color%' OR sku LIKE '%colour%' THEN 'color'
    WHEN sku LIKE '%talla%' OR sku LIKE '%size%' THEN 'talla'
    WHEN sku LIKE '%tamaño%' OR sku LIKE '%tamano%' THEN 'tamaño'
    WHEN sku LIKE '%material%' THEN 'material'
    WHEN sku LIKE '%modelo%' OR sku LIKE '%model%' THEN 'modelo'
    WHEN sku LIKE '%capacidad%' THEN 'capacidad'
    WHEN sku LIKE '%sabor%' OR sku LIKE '%flavor%' THEN 'sabor'
    ELSE 'tipo'
  END as option_name
FROM product_variants pv
LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
WHERE pvv.variant_id IS NULL
  AND CASE 
    WHEN sku LIKE '%color%' OR sku LIKE '%colour%' THEN 'color'
    WHEN sku LIKE '%talla%' OR sku LIKE '%size%' THEN 'talla'
    WHEN sku LIKE '%tamaño%' OR sku LIKE '%tamano%' THEN 'tamaño'
    WHEN sku LIKE '%material%' THEN 'material'
    WHEN sku LIKE '%modelo%' OR sku LIKE '%model%' THEN 'modelo'
    WHEN sku LIKE '%capacidad%' THEN 'capacidad'
    WHEN sku LIKE '%sabor%' OR sku LIKE '%flavor%' THEN 'sabor'
    ELSE 'tipo'
  END NOT IN (SELECT name FROM variant_options);

-- Paso 2: Verificar opciones creadas
SELECT 'OPCIONES DESPUÉS DE REPARACIÓN' as section;
SELECT * FROM variant_options ORDER BY id;
