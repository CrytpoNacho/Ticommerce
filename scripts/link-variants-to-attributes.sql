-- Vincular las variantes existentes con sus atributos

-- Vincular variantes de color
INSERT INTO product_variant_values (variant_id, value_id)
SELECT 
  pv.id as variant_id,
  vv.id as value_id
FROM product_variants pv
JOIN variant_values vv ON (
  CASE 
    WHEN pv.sku LIKE '%-color-rojo' THEN vv.value = 'rojo'
    WHEN pv.sku LIKE '%-color-verde' THEN vv.value = 'verde'  
    WHEN pv.sku LIKE '%-color-azul' THEN vv.value = 'azul'
    ELSE false
  END
)
JOIN variant_options vo ON vv.option_id = vo.id AND vo.name = 'color'
WHERE pv.id IN (3, 4, 5, 6, 7, 8)  -- IDs de variantes de color
  AND NOT EXISTS (
    SELECT 1 FROM product_variant_values pvv 
    WHERE pvv.variant_id = pv.id
  );

-- Vincular variantes de talla
INSERT INTO product_variant_values (variant_id, value_id)
SELECT 
  pv.id as variant_id,
  vv.id as value_id
FROM product_variants pv
JOIN variant_values vv ON (
  CASE 
    WHEN pv.sku LIKE '%-talla-42-us' THEN vv.value = '42-us'
    WHEN pv.sku LIKE '%-talla-40-us' THEN vv.value = '40-us'
    WHEN pv.sku LIKE '%-talla-38' THEN vv.value = '38'
    ELSE false
  END
)
JOIN variant_options vo ON vv.option_id = vo.id AND vo.name = 'talla'
WHERE pv.id IN (9, 10, 11)  -- IDs de variantes de talla
  AND NOT EXISTS (
    SELECT 1 FROM product_variant_values pvv 
    WHERE pvv.variant_id = pv.id
  );

-- Verificar vinculaciones creadas
SELECT 'VINCULACIONES CREADAS' as section;
SELECT 
  pv.id as variant_id,
  pv.product_id,
  pv.sku,
  vo.name as attribute_type,
  vv.value as attribute_value
FROM product_variants pv
JOIN product_variant_values pvv ON pv.id = pvv.variant_id
JOIN variant_values vv ON pvv.value_id = vv.id
JOIN variant_options vo ON vv.option_id = vo.id
WHERE pv.id IN (3, 4, 5, 6, 7, 8, 9, 10, 11)
ORDER BY pv.product_id, pv.id;
