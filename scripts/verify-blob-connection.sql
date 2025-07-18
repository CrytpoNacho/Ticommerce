-- Verificar la conexión entre blob storage y base de datos
SELECT 
  pm.id as media_id,
  pm.product_id,
  pm.variant_id,
  pm.file_url,
  pm.file_name,
  pm.is_primary,
  pm.display_order,
  CASE 
    WHEN pm.variant_id IS NULL THEN 'Producto Principal'
    ELSE CONCAT('Variante ID: ', pm.variant_id)
  END as tipo_imagen,
  pv.sku as variant_sku,
  pv.attributes as variant_attributes
FROM product_media pm
LEFT JOIN product_variants pv ON pm.variant_id = pv.id
WHERE pm.product_id IN (36, 37, 38)
ORDER BY pm.product_id, pm.variant_id NULLS FIRST, pm.display_order;

-- Verificar que las URLs del blob coincidan con los archivos
SELECT 
  product_id,
  variant_id,
  file_url,
  CASE 
    WHEN file_url LIKE '%product-37-variant%' THEN '✅ Variante P37'
    WHEN file_url LIKE '%product-38-variant%' THEN '✅ Variante P38'
    WHEN file_url LIKE '%product-37-%' THEN '✅ Principal P37'
    WHEN file_url LIKE '%product-38-%' THEN '✅ Principal P38'
    ELSE '❌ Patrón no reconocido'
  END as blob_status
FROM product_media 
WHERE product_id IN (36, 37, 38)
ORDER BY product_id, variant_id;
