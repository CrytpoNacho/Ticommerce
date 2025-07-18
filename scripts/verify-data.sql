-- Script para verificar que los datos se insertaron correctamente

-- Verificar usuarios y vendedores
SELECT 
    u.name,
    u.email,
    u.role,
    s.seller_type,
    s.landing_description
FROM users u
LEFT JOIN sellers s ON u.id = s.user_id
ORDER BY u.role, u.name;

-- Verificar productos por categoría
SELECT 
    category,
    COUNT(*) as total_products,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products 
WHERE is_active = true
GROUP BY category
ORDER BY total_products DESC;

-- Verificar productos con sus vendedores
SELECT 
    p.name as product_name,
    p.price,
    p.category,
    u.name as seller_name,
    p.stock_quantity,
    p.is_promoted
FROM products p
JOIN sellers s ON p.seller_id = s.user_id
JOIN users u ON s.user_id = u.id
ORDER BY p.category, p.price DESC;

-- Verificar reseñas
SELECT 
    p.name as product_name,
    pr.rating,
    pr.comment,
    u.name as reviewer_name
FROM product_reviews pr
JOIN products p ON pr.product_id = p.id
JOIN users u ON pr.user_id = u.id
ORDER BY pr.created_at DESC;

-- Verificar estadísticas generales
SELECT 
    'Total Users' as metric,
    COUNT(*) as value
FROM users
UNION ALL
SELECT 
    'Total Sellers' as metric,
    COUNT(*) as value
FROM sellers
UNION ALL
SELECT 
    'Total Products' as metric,
    COUNT(*) as value
FROM products
UNION ALL
SELECT 
    'Active Products' as metric,
    COUNT(*) as value
FROM products WHERE is_active = true
UNION ALL
SELECT 
    'Promoted Products' as metric,
    COUNT(*) as value
FROM products WHERE is_promoted = true;
