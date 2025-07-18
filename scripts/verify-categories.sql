-- Verificar que las categorías se crearon correctamente
SELECT id, name, slug, description FROM categories ORDER BY name;

-- Verificar cuántos productos hay en cada categoría
SELECT 
    c.name as category_name, 
    COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON LOWER(p.category) = c.slug
GROUP BY c.name
ORDER BY product_count DESC;
