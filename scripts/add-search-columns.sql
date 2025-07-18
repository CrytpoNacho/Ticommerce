-- Agregar columnas necesarias para búsqueda avanzada
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS condition VARCHAR(20) DEFAULT 'new',
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS brand_id INTEGER REFERENCES brands(id);

-- Crear índices para mejorar performance de búsqueda
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('spanish', name));
CREATE INDEX IF NOT EXISTS idx_products_description_search ON products USING gin(to_tsvector('spanish', description));
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Actualizar productos existentes con datos de ejemplo
UPDATE products SET 
  condition = CASE 
    WHEN random() < 0.7 THEN 'new'
    WHEN random() < 0.9 THEN 'used'
    ELSE 'refurbished'
  END,
  rating = ROUND((random() * 2 + 3)::numeric, 1), -- Rating entre 3.0 y 5.0
  image_url = '/placeholder.svg?height=300&width=300&text=' || encode(name::bytea, 'base64')
WHERE condition IS NULL OR rating = 0;
