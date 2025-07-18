-- Insertar categorías iniciales
INSERT INTO categories (name, slug, description, created_at) VALUES
('Relojes', 'relojes', 'Relojes de lujo y elegantes para toda ocasión', NOW()),
('Accesorios', 'accesorios', 'Accesorios de moda y lujo para complementar tu estilo', NOW()),
('Decoración', 'decoracion', 'Artículos decorativos y para el hogar de alta calidad', NOW()),
('Moda', 'moda', 'Prendas de vestir y moda de diseñador', NOW()),
('Tecnología', 'tecnologia', 'Dispositivos tecnológicos premium y de última generación', NOW()),
('Servicios', 'servicios', 'Servicios exclusivos y personalizados', NOW()),
('Joyería', 'joyeria', 'Joyas finas y piedras preciosas', NOW()),
('Belleza', 'belleza', 'Productos de belleza y cuidado personal de lujo', NOW()),
('Hogar', 'hogar', 'Artículos para el hogar y decoración interior', NOW()),
('Cocina', 'cocina', 'Utensilios y accesorios de cocina gourmet', NOW()),
('Deportes', 'deportes', 'Equipamiento deportivo y actividades de lujo', NOW()),
('Arte', 'arte', 'Obras de arte y piezas coleccionables exclusivas', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Actualizar productos existentes para usar las categorías correctas
UPDATE products SET category = 'relojes' WHERE category = 'relojes';
UPDATE products SET category = 'accesorios' WHERE category = 'accesorios';
UPDATE products SET category = 'decoracion' WHERE category = 'decoracion';
UPDATE products SET category = 'moda' WHERE category = 'moda';
UPDATE products SET category = 'tecnologia' WHERE category = 'tecnologia';
UPDATE products SET category = 'belleza' WHERE category = 'belleza';
