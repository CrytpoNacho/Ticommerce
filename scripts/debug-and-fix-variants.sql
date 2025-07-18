-- 1. Verificar productos con variantes
SELECT 'PRODUCTOS CON VARIANTES' as section;
SELECT id, name, has_variants, created_at 
FROM products 
WHERE has_variants = true 
ORDER BY id;

-- 2. Verificar variantes existentes
SELECT 'VARIANTES EXISTENTES' as section;
SELECT 
  pv.id as variant_id,
  pv.product_id,
  pv.sku,
  pv.price,
  pv.stock_quantity,
  p.name as product_name
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
ORDER BY pv.product_id, pv.id;

-- 3. Verificar opciones de variantes
SELECT 'OPCIONES DE VARIANTES' as section;
SELECT * FROM variant_options ORDER BY id;

-- 4. Verificar valores de variantes
SELECT 'VALORES DE VARIANTES' as section;
SELECT 
  vv.id,
  vv.value,
  vo.name as option_name
FROM variant_values vv
JOIN variant_options vo ON vv.option_id = vo.id
ORDER BY vo.name, vv.value;

-- 5. Verificar relaciones variante-valor
SELECT 'RELACIONES VARIANTE-VALOR' as section;
SELECT 
  pvv.variant_id,
  pvv.value_id,
  vv.value,
  vo.name as option_name,
  pv.sku
FROM product_variant_values pvv
JOIN variant_values vv ON pvv.value_id = vv.id
JOIN variant_options vo ON vv.option_id = vo.id
JOIN product_variants pv ON pvv.variant_id = pv.id
ORDER BY pvv.variant_id;

-- 6. Verificar archivos multimedia de variantes
SELECT 'ARCHIVOS DE VARIANTES' as section;
SELECT 
  pm.id,
  pm.product_id,
  pm.variant_id,
  pm.file_name,
  pm.is_primary,
  pv.sku
FROM product_media pm
JOIN product_variants pv ON pm.variant_id = pv.id
WHERE pm.variant_id IS NOT NULL
ORDER BY pm.product_id, pm.variant_id;

-- 7. Contar totales
SELECT 'RESUMEN' as section;
SELECT 
  (SELECT COUNT(*) FROM products WHERE has_variants = true) as productos_con_variantes,
  (SELECT COUNT(*) FROM product_variants) as total_variantes,
  (SELECT COUNT(*) FROM variant_options) as total_opciones,
  (SELECT COUNT(*) FROM variant_values) as total_valores,
  (SELECT COUNT(*) FROM product_variant_values) as total_relaciones,
  (SELECT COUNT(*) FROM product_media WHERE variant_id IS NOT NULL) as archivos_variantes;
