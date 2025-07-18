-- Crear un vendedor de ejemplo (necesitamos uno para asociar productos)
INSERT INTO users (id, name, email, password_hash, role, is_verified, created_at) VALUES
(1, 'Tienda Demo', 'tienda@luxcr.com', '$2a$10$example.hash.here', 'seller', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Crear el perfil de vendedor
INSERT INTO sellers (user_id, seller_type, profile_picture_url) VALUES
(1, 'premium', '/placeholder.svg?height=300&width=300')
ON CONFLICT (user_id) DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO products (seller_id, name, description, price, category, is_active, is_promoted, stock_quantity, created_at) VALUES
(1, 'Reloj Elegante Dorado', 'Un elegante reloj de oro con detalles en negro. Perfecto para ocasiones especiales o para uso diario.', 75000.00, 'relojes', true, false, 10, NOW()),
(1, 'Bolso de Cuero Premium', 'Bolso de cuero genuino hecho a mano con acabados de lujo.', 45000.00, 'accesorios', true, false, 15, NOW()),
(1, 'Vela Aromática Artesanal', 'Vela aromática hecha con ceras naturales y fragancias premium.', 12000.00, 'decoracion', true, false, 30, NOW()),
(1, 'Collar de Plata Elegante', 'Collar de plata 925 con diseño minimalista y elegante.', 35000.00, 'accesorios', true, false, 8, NOW()),
(1, 'Set de Té de Porcelana', 'Elegante set de té de porcelana fina con detalles dorados.', 28000.00, 'decoracion', true, false, 5, NOW()),
(1, 'Billetera de Cuero Italiana', 'Billetera de cuero italiano genuino con múltiples compartimentos y acabado premium.', 18500.00, 'accesorios', true, false, 20, NOW()),
(1, 'Pulsera de Oro Rosa', 'Elegante pulsera de oro rosa de 18k con diseño contemporáneo y acabado pulido.', 65000.00, 'accesorios', true, false, 7, NOW()),
(1, 'Perfume de Lujo Francés', 'Fragancia exclusiva creada por perfumistas franceses con notas florales y amaderas.', 42000.00, 'belleza', true, false, 12, NOW()),
(1, 'Smartphone Premium', 'Último modelo de smartphone con características premium y diseño elegante.', 95000.00, 'tecnologia', true, false, 6, NOW()),
(1, 'Vestido de Noche Elegante', 'Vestido de noche confeccionado con telas premium y diseño exclusivo.', 58000.00, 'moda', true, false, 4, NOW()),
(1, 'Anillo de Diamante', 'Anillo de compromiso con diamante certificado y montura de oro blanco.', 120000.00, 'accesorios', true, false, 3, NOW()),
(1, 'Reloj Deportivo Inteligente', 'Reloj inteligente con funciones deportivas y diseño resistente al agua.', 85000.00, 'tecnologia', true, false, 9, NOW());
