-- Crear tabla para archivos multimedia de productos
CREATE TABLE IF NOT EXISTS public.product_media (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id INTEGER REFERENCES public.product_variants(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_type VARCHAR(50), -- 'image', 'gif', 'video'
  file_size INTEGER, -- en bytes
  mime_type VARCHAR(100),
  is_primary BOOLEAN DEFAULT false, -- imagen principal del producto/variante
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON public.product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_variant_id ON public.product_media(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_media_primary ON public.product_media(is_primary);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_product_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_media_updated_at
  BEFORE UPDATE ON public.product_media
  FOR EACH ROW
  EXECUTE FUNCTION update_product_media_updated_at();

-- Verificar estructura
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'product_media'
ORDER BY ordinal_position;
