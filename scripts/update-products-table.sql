-- Agregar campos faltantes a la tabla products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS currency character varying DEFAULT 'CRC',
ADD COLUMN IF NOT EXISTS has_variants boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS brand_type character varying,
ADD COLUMN IF NOT EXISTS custom_brand_name character varying;

-- Actualizar productos existentes para que tengan valores por defecto
UPDATE public.products 
SET currency = 'CRC', has_variants = false 
WHERE currency IS NULL OR has_variants IS NULL;

-- Verificar la estructura actualizada
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
