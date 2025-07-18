-- Verificar variantes y sus atributos
SELECT 
  pv.id as variant_id,
  pv.product_id,
  pv.sku,
  pv.price,
  pv.stock_quantity,
  pv.is_active,
  vo.name as attribute_name,
  vv.value as attribute_value
FROM product_variants pv
LEFT JOIN product_variant_values pvv ON pv.id = pvv.variant_id
LEFT JOIN variant_values vv ON pvv.variant_value_id = vv.id
LEFT JOIN variant_options vo ON vv.variant_option_id = vo.id
WHERE pv.product_id IN (36, 37, 38)
ORDER BY pv.product_id, pv.id;

-- Verificar estructura de tablas de variantes
SELECT * FROM variant_options;
SELECT * FROM variant_values WHERE variant_option_id IN (SELECT id FROM variant_options);
SELECT * FROM product_variant_values WHERE variant_id IN (SELECT id FROM product_variants WHERE product_id IN (36, 37, 38));
