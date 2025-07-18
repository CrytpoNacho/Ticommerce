-- Verificar que todas las tablas necesarias existan
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'products', 
    'brands', 
    'categories', 
    'sellers', 
    'users',
    'product_variants',
    'variant_options',
    'variant_values',
    'product_variant_values',
    'product_media'
  )
ORDER BY table_name;

-- Verificar estructura de tabla products
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Verificar estructura de tabla brands
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'brands'
ORDER BY ordinal_position;

-- Verificar estructura de tabla categories
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'categories'
ORDER BY ordinal_position;
