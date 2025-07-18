-- Insertar categorías iniciales basadas en el esquema existente
-- Nota: Como no hay tabla de categorías separada, usaremos los valores directamente en productos

-- Primero, vamos a insertar algunos usuarios y vendedores de ejemplo para poder crear productos

-- Insertar usuario vendedor de ejemplo
INSERT INTO users (name, email, password_hash, role, created_at, is_verified) VALUES
('Tienda Demo', 'tienda@luxcr.com', '$2a$10$example.hash.here', 'seller', NOW(), true),
('Vendedor Premium', 'premium@luxcr.com', '$2a$10$example.hash.here', 'seller', NOW(), true),
('Artesano Local', 'artesano@luxcr.com', '$2a$10$example.hash.here', 'seller', NOW(), true)
ON CONFLICT (email) DO NOTHING;

-- Insertar perfiles de vendedores
INSERT INTO sellers (user_id, seller_type, profile_picture_url, landing_description, fe_active) 
SELECT 
    u.id,
    'premium',
    '/placeholder.svg?height=300&width=300',
    CASE 
        WHEN u.name = 'Tienda Demo' THEN 'Tienda de productos de lujo y elegancia'
        WHEN u.name = 'Vendedor Premium' THEN 'Especialistas en productos premium y exclusivos'
        WHEN u.name = 'Artesano Local' THEN 'Productos artesanales hechos a mano con amor'
    END,
    true
FROM users u 
WHERE u.email IN ('tienda@luxcr.com', 'premium@luxcr.com', 'artesano@luxcr.com')
ON CONFLICT (user_id) DO NOTHING;
