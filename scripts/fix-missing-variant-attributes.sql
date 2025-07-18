-- Identificar variantes sin atributos
SELECT 'VARIANTES SIN ATRIBUTOS' as section;
SELECT 
  pv.id as variant_id,
  pv.product_id,
  pv.sku,
  pv.price,
  pv.stock_quantity,
  p.name as product_name
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
WHERE pvv.variant_id IS NULL
ORDER BY pv.product_id, pv.id;

-- Analizar los SKUs para extraer información de variantes
SELECT 'ANÁLISIS DE SKUs' as section;
SELECT 
  pv.id as variant_id,
  pv.product_id,
  pv.sku,
  -- Extraer tipo y valor del SKU (formato: productid-tipo-valor)
  CASE 
    WHEN pv.sku LIKE '%-%-%' THEN 
      split_part(split_part(pv.sku, '-', 2), '-', 1)
    ELSE 'unknown'
  END as extracted_type,
  CASE 
    WHEN pv.sku LIKE '%-%-%' THEN 
      substring(pv.sku from position('-' in substring(pv.sku from position('-' in pv.sku) + 1)) + position('-' in pv.sku) + 1)
    ELSE 'unknown'
  END as extracted_value
FROM product_variants pv
LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
WHERE pvv.variant_id IS NULL
ORDER BY pv.product_id, pv.id;
