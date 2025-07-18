-- Crear la tabla de categorías que falta
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Extraer categorías únicas de la tabla de productos e insertarlas en la tabla de categorías
INSERT INTO categories (name, slug, description)
SELECT DISTINCT 
    INITCAP(category) as name,  -- Convertir primera letra a mayúscula
    LOWER(category) as slug,
    CASE 
        WHEN LOWER(category) = 'relojes' THEN 'Relojes de lujo y elegantes para toda ocasión'
        WHEN LOWER(category) = 'accesorios' THEN 'Accesorios de moda y lujo para complementar tu estilo'
        WHEN LOWER(category) = 'decoracion' THEN 'Artículos decorativos y para el hogar de alta calidad'
        WHEN LOWER(category) = 'joyeria' THEN 'Joyas finas y piedras preciosas'
        WHEN LOWER(category) = 'hogar' THEN 'Artículos para el hogar y decoración interior'
        WHEN LOWER(category) = 'belleza' THEN 'Productos de belleza y cuidado personal de lujo'
        WHEN LOWER(category) = 'tecnologia' THEN 'Dispositivos tecnológicos premium y de última generación'
        WHEN LOWER(category) = 'moda' THEN 'Prendas de vestir y moda de diseñador'
        WHEN LOWER(category) = 'arte' THEN 'Obras de arte y piezas coleccionables exclusivas'
        WHEN LOWER(category) = 'bebidas' THEN 'Bebidas premium y coleccionables'
        ELSE 'Productos de lujo y alta calidad'
    END as description
FROM products
WHERE category IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

-- Insertar categorías adicionales que podrían no estar en productos
INSERT INTO categories (name, slug, description) VALUES
('Servicios', 'servicios', 'Servicios exclusivos y personalizados'),
('Cocina', 'cocina', 'Utensilios y accesorios de cocina gourmet'),
('Deportes', 'deportes', 'Equipamiento deportivo y actividades de lujo')
ON CONFLICT (slug) DO NOTHING;
