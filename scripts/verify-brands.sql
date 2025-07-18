-- Verificar que las marcas se crearon correctamente
SELECT id, name, slug, is_active, 
       CASE WHEN LENGTH(description) > 50 
            THEN SUBSTRING(description FROM 1 FOR 50) || '...' 
            ELSE description 
       END as description_preview
FROM brands 
ORDER BY name;

-- Verificar cuántos productos hay por marca
SELECT 
    b.name as brand_name,
    COUNT(p.id) as product_count,
    AVG(p.price) as avg_price
FROM brands b
LEFT JOIN products p ON b.id = p.brand_id AND p.is_active = true
GROUP BY b.id, b.name
ORDER BY product_count DESC;

-- Verificar productos con sus marcas
SELECT 
    p.name as product_name,
    p.price,
    p.category,
    b.name as brand_name
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
ORDER BY b.name, p.name;

-- Estadísticas generales
SELECT 
    'Total Brands' as metric,
    COUNT(*) as value
FROM brands
UNION ALL
SELECT 
    'Active Brands' as metric,
    COUNT(*) as value
FROM brands WHERE is_active = true
UNION ALL
SELECT 
    'Products with Brand' as metric,
    COUNT(*) as value
FROM products WHERE brand_id IS NOT NULL
UNION ALL
SELECT 
    'Products without Brand' as metric,
    COUNT(*) as value
FROM products WHERE brand_id IS NULL;
