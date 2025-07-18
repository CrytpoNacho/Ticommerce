-- Reparar variantes específicas basándose en los datos que vimos

-- Primero, vamos a ver qué variantes necesitan reparación
WITH variant_analysis AS (
  SELECT 
    pv.id as variant_id,
    pv.product_id,
    pv.sku,
    -- Extraer información del SKU
    CASE 
      WHEN pv.sku ~ '\d+-[a-zA-Z]+-[a-zA-Z0-9]+' THEN
        split_part(pv.sku, '-', 2)
      ELSE 'unknown'
    END as variant_type,
    CASE 
      WHEN pv.sku ~ '\d+-[a-zA-Z]+-[a-zA-Z0-9]+' THEN
        split_part(pv.sku, '-', 3)
      ELSE 'unknown'
    END as variant_value
  FROM product_variants pv
  LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
  WHERE pvv.variant_id IS NULL
)
SELECT 'ANÁLISIS DE VARIANTES A REPARAR' as section;
SELECT * FROM variant_analysis;

-- Crear opciones que no existen
INSERT INTO variant_options (name)
SELECT DISTINCT variant_type
FROM (
  SELECT 
    CASE 
      WHEN pv.sku ~ '\d+-[a-zA-Z]+-[a-zA-Z0-9]+' THEN
        split_part(pv.sku, '-', 2)
      ELSE 'tipo'
    END as variant_type
  FROM product_variants pv
  LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
  WHERE pvv.variant_id IS NULL
) sub
WHERE variant_type NOT IN (SELECT name FROM variant_options)
  AND variant_type != 'unknown';

-- Mostrar opciones después de la inserción
SELECT 'OPCIONES DISPONIBLES' as section;
SELECT * FROM variant_options ORDER BY name;
