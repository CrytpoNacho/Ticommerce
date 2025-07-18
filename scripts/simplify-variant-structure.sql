-- Agregar columnas para almacenar atributos directamente en product_variants
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';

-- Migrar datos existentes de la estructura compleja a la simple
UPDATE product_variants 
SET attributes = (
  SELECT jsonb_object_agg(vo.name, vv.value)
  FROM product_variant_values pvv
  JOIN variant_values vv ON pvv.value_id = vv.id
  JOIN variant_options vo ON vv.option_id = vo.id
  WHERE pvv.variant_id = product_variants.id
)
WHERE id IN (
  SELECT DISTINCT variant_id 
  FROM product_variant_values
);

-- Verificar la migración
SELECT 
  id,
  product_id,
  sku,
  price,
  stock_quantity,
  attributes
FROM product_variants 
WHERE product_id IN (36, 37, 38)
ORDER BY product_id, id;
