-- Insertar datos de ejemplo adicionales para testing

-- Insertar algunos usuarios compradores
INSERT INTO users (name, email, password_hash, role, created_at, is_verified) VALUES
('Juan Pérez', 'juan@example.com', '$2a$10$example.hash.here', 'buyer', NOW(), true),
('María González', 'maria@example.com', '$2a$10$example.hash.here', 'buyer', NOW(), true),
('Carlos Rodríguez', 'carlos@example.com', '$2a$10$example.hash.here', 'buyer', NOW(), true)
ON CONFLICT (email) DO NOTHING;

-- Insertar algunas reseñas de productos
INSERT INTO product_reviews (product_id, user_id, rating, comment, created_at)
SELECT 
    p.id,
    u.id,
    review_data.rating,
    review_data.comment,
    NOW() - INTERVAL '1 day' * review_data.days_ago
FROM products p
CROSS JOIN users u
CROSS JOIN (
    VALUES 
    (5, 'Excelente calidad, muy recomendado', 1),
    (4, 'Buen producto, llegó en perfectas condiciones', 3),
    (5, 'Superó mis expectativas, volveré a comprar', 5),
    (3, 'Producto decente, pero podría mejorar', 7),
    (4, 'Muy satisfecho con la compra', 10)
) AS review_data(rating, comment, days_ago)
WHERE u.role = 'buyer' 
AND p.id <= 5
LIMIT 15;

-- Insertar algunos elementos en wishlist
INSERT INTO wishlists (user_id, product_id, created_at)
SELECT 
    u.id,
    p.id,
    NOW() - INTERVAL '1 hour' * (RANDOM() * 24)
FROM users u
CROSS JOIN products p
WHERE u.role = 'buyer'
AND RANDOM() < 0.3  -- 30% de probabilidad de que un usuario tenga un producto en wishlist
LIMIT 20;

-- Insertar algunas vistas de productos
INSERT INTO product_views (product_id, user_id, viewed_at)
SELECT 
    p.id,
    u.id,
    NOW() - INTERVAL '1 hour' * (RANDOM() * 168)  -- Últimas 7 días
FROM products p
CROSS JOIN users u
WHERE u.role = 'buyer'
AND RANDOM() < 0.6  -- 60% de probabilidad de vista
LIMIT 100;

-- Insertar planes de promoción
INSERT INTO promotion_plans (name, price_per_day, duration_days, discount_percentage) VALUES
('Plan Básico', 500.00, 7, 5.0),
('Plan Premium', 1000.00, 14, 10.0),
('Plan VIP', 2000.00, 30, 15.0);

-- Insertar algunas órdenes de ejemplo
INSERT INTO orders (buyer_id, total, status, created_at)
SELECT 
    u.id,
    order_data.total,
    order_data.status,
    NOW() - INTERVAL '1 day' * order_data.days_ago
FROM users u
CROSS JOIN (
    VALUES 
    (75000.00, 'completed', 2),
    (45000.00, 'shipped', 1),
    (120000.00, 'processing', 0),
    (28000.00, 'completed', 5),
    (85000.00, 'completed', 3)
) AS order_data(total, status, days_ago)
WHERE u.role = 'buyer'
LIMIT 10;
