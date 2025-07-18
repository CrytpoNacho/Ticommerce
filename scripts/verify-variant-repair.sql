-- Verificar que la reparación fue exitosa

-- Contar variantes con y sin atributos
SELECT 'RESUMEN DESPUÉS DE REPARACIÓN' as section;
SELECT 
  COUNT(*) as total_variantes,
  COUNT(pvv.variant_id) as variantes_con_atributos,
  COUNT(*) - COUNT(pvv.variant_id) as variantes_sin_atributos
FROM product_variants pv
LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id;

-- Ver todas las variantes con sus atributos
SELECT 'TODAS LAS VARIANTES CON ATRIBUTOS' as section;
SELECT 
  pv.id as variant_id,
  pv.product_id,
  pv.sku,
  pv.price,
  pv.stock_quantity,
  vo.name as attribute_type,
  vv.value as attribute_value
FROM product_variants pv
LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
LEFT JOIN variant_values vv ON pvv.value_id = vv.id
LEFT JOIN variant_options vo ON vv.option_id = vo.id
ORDER BY pv.product_id, pv.id;

-- Verificar productos con variantes
SELECT 'PRODUCTOS CON VARIANTES' as section;
SELECT 
  p.id,
  p.name,
  p.has_variants,
  COUNT(pv.id) as total_variants,
  COUNT(pvv.variant_id) as variants_with_attributes
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
WHERE p.has_variants = true
GROUP BY p.id, p.name, p.has_variants
ORDER BY p.id;
