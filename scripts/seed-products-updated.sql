-- Insertar productos de ejemplo basados en el esquema existente
INSERT INTO products (seller_id, name, description, price, category, is_active, is_promoted, stock_quantity, created_at) 
SELECT 
    s.user_id,
    product_data.name,
    product_data.description,
    product_data.price,
    product_data.category,
    product_data.is_active,
    product_data.is_promoted,
    product_data.stock_quantity,
    NOW()
FROM sellers s
CROSS JOIN (
    VALUES 
    ('Reloj Elegante Dorado', 'Un elegante reloj de oro con detalles en negro. Perfecto para ocasiones especiales o para uso diario. Mecanismo suizo de alta precisión.', 75000.00, 'relojes', true, false, 10),
    ('Bolso de Cuero Premium', 'Bolso de cuero genuino hecho a mano con acabados de lujo. Diseño atemporal que combina funcionalidad y elegancia.', 45000.00, 'accesorios', true, false, 15),
    ('Vela Aromática Artesanal', 'Vela aromática hecha con ceras naturales y fragancias premium. Aroma relajante que transforma cualquier espacio.', 12000.00, 'decoracion', true, false, 30),
    ('Collar de Plata Elegante', 'Collar de plata 925 con diseño minimalista y elegante. Perfecto para uso diario o ocasiones especiales.', 35000.00, 'joyeria', true, false, 8),
    ('Set de Té de Porcelana', 'Elegante set de té de porcelana fina con detalles dorados. Incluye tetera, tazas y platillos para 4 personas.', 28000.00, 'hogar', true, false, 5),
    ('Billetera de Cuero Italiana', 'Billetera de cuero italiano genuino con múltiples compartimentos y acabado premium. Diseño clásico y funcional.', 18500.00, 'accesorios', true, false, 20),
    ('Pulsera de Oro Rosa', 'Elegante pulsera de oro rosa de 18k con diseño contemporáneo y acabado pulido. Joya exclusiva y sofisticada.', 65000.00, 'joyeria', true, false, 7),
    ('Perfume de Lujo Francés', 'Fragancia exclusiva creada por perfumistas franceses con notas florales y amaderas. Aroma único y duradero.', 42000.00, 'belleza', true, false, 12),
    ('Smartphone Premium', 'Último modelo de smartphone con características premium y diseño elegante. Tecnología de vanguardia.', 95000.00, 'tecnologia', true, false, 6),
    ('Vestido de Noche Elegante', 'Vestido de noche confeccionado con telas premium y diseño exclusivo. Perfecto para eventos especiales.', 58000.00, 'moda', true, false, 4),
    ('Anillo de Diamante', 'Anillo de compromiso con diamante certificado y montura de oro blanco. Símbolo eterno de amor y compromiso.', 120000.00, 'joyeria', true, true, 3),
    ('Reloj Deportivo Inteligente', 'Reloj inteligente con funciones deportivas y diseño resistente al agua. Tecnología avanzada para el deporte.', 85000.00, 'tecnologia', true, false, 9),
    ('Cartera de Diseñador', 'Cartera de diseñador con materiales premium y acabados de lujo. Accesorio indispensable para el guardarropa moderno.', 32000.00, 'accesorios', true, false, 12),
    ('Vino Premium Reserva', 'Vino tinto de reserva especial con notas complejas y sabor excepcional. Ideal para ocasiones especiales.', 25000.00, 'bebidas', true, false, 8),
    ('Auriculares de Alta Fidelidad', 'Auriculares premium con calidad de sonido excepcional y diseño ergonómico. Experiencia auditiva superior.', 55000.00, 'tecnologia', true, false, 15)
) AS product_data(name, description, price, category, is_active, is_promoted, stock_quantity)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'tienda@luxcr.com' LIMIT 1);

-- Insertar algunos productos adicionales para otros vendedores
INSERT INTO products (seller_id, name, description, price, category, is_active, is_promoted, stock_quantity, created_at) 
SELECT 
    s.user_id,
    product_data.name,
    product_data.description,
    product_data.price,
    product_data.category,
    product_data.is_active,
    product_data.is_promoted,
    product_data.stock_quantity,
    NOW()
FROM sellers s
CROSS JOIN (
    VALUES 
    ('Escultura Artesanal', 'Escultura única hecha a mano por artesanos locales. Pieza de arte exclusiva para decoración.', 89000.00, 'arte', true, true, 1),
    ('Juego de Copas de Cristal', 'Juego de 6 copas de cristal tallado a mano. Elegancia y sofisticación para tu mesa.', 38000.00, 'hogar', true, false, 6),
    ('Bufanda de Seda Premium', 'Bufanda de seda natural con diseños exclusivos. Accesorio elegante para cualquier temporada.', 22000.00, 'moda', true, false, 10)
) AS product_data(name, description, price, category, is_active, is_promoted, stock_quantity)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'premium@luxcr.com' LIMIT 1);

INSERT INTO products (seller_id, name, description, price, category, is_active, is_promoted, stock_quantity, created_at) 
SELECT 
    s.user_id,
    product_data.name,
    product_data.description,
    product_data.price,
    product_data.category,
    product_data.is_active,
    product_data.is_promoted,
    product_data.stock_quantity,
    NOW()
FROM sellers s
CROSS JOIN (
    VALUES 
    ('Cerámica Artesanal', 'Piezas de cerámica hechas a mano con técnicas tradicionales. Arte funcional para tu hogar.', 15000.00, 'arte', true, false, 8),
    ('Jabón Natural Orgánico', 'Jabón artesanal hecho con ingredientes naturales y orgánicos. Cuidado suave para tu piel.', 3500.00, 'belleza', true, false, 25),
    ('Maceta de Barro Decorativa', 'Maceta artesanal de barro con diseños únicos. Perfecta para plantas y decoración.', 8000.00, 'decoracion', true, false, 15)
) AS product_data(name, description, price, category, is_active, is_promoted, stock_quantity)
WHERE s.user_id = (SELECT id FROM users WHERE email = 'artesano@luxcr.com' LIMIT 1);
