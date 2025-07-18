-- Verificar la estructura actual de variantes
SELECT 'Verificando product_variants' as step;
SELECT COUNT(*) as total_variants FROM product_variants;

SELECT 'Verificando variant_options' as step;
SELECT * FROM variant_options;

SELECT 'Verificando variant_values' as step;
SELECT COUNT(*) as total_values FROM variant_values;

SELECT 'Verificando product_variant_values' as step;
SELECT COUNT(*) as total_relations FROM product_variant_values;

-- Verificar productos con variantes
SELECT 'Productos con variantes habilitadas' as step;
SELECT id, name, has_variants FROM products WHERE has_variants = true;

-- Verificar variantes existentes
SELECT 'Variantes existentes' as step;
SELECT 
  pv.id,
  pv.product_id,
  pv.sku,
  pv.price,
  pv.stock_quantity,
  p.name as product_name
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
ORDER BY pv.product_id, pv.id;

-- Verificar relaciones de variantes (corregido)
SELECT 'Relaciones de variantes' as step;
SELECT 
  pvv.variant_id,
  pvv.value_id,
  vv.value,
  vo.name as option_name
FROM product_variant_values pvv
JOIN variant_values vv ON pvv.value_id = vv.id
JOIN variant_options vo ON vv.option_id = vo.id
ORDER BY pvv.variant_id;
