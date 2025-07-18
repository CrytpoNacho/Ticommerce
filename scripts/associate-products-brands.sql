-- Asociar productos existentes con marcas basándose en categorías y nombres
UPDATE products SET brand_id = (
    CASE 
        WHEN LOWER(name) LIKE '%reloj%' OR category = 'relojes' THEN 
            (SELECT id FROM brands WHERE slug = 'chronos' LIMIT 1)
        WHEN LOWER(name) LIKE '%collar%' OR LOWER(name) LIKE '%anillo%' OR LOWER(name) LIKE '%pulsera%' OR category = 'joyeria' THEN 
            (SELECT id FROM brands WHERE slug = 'royal' LIMIT 1)
        WHEN LOWER(name) LIKE '%bolso%' OR LOWER(name) LIKE '%billetera%' OR LOWER(name) LIKE '%cartera%' THEN 
            (SELECT id FROM brands WHERE slug = 'velvet' LIMIT 1)
        WHEN LOWER(name) LIKE '%perfume%' OR LOWER(name) LIKE '%vela%' OR category = 'belleza' THEN 
            (SELECT id FROM brands WHERE slug = 'opulence' LIMIT 1)
        WHEN LOWER(name) LIKE '%smartphone%' OR LOWER(name) LIKE '%auriculares%' OR category = 'tecnologia' THEN 
            (SELECT id FROM brands WHERE slug = 'stellar' LIMIT 1)
        WHEN LOWER(name) LIKE '%vestido%' OR LOWER(name) LIKE '%bufanda%' OR category = 'moda' THEN 
            (SELECT id FROM brands WHERE slug = 'ethereal' LIMIT 1)
        WHEN LOWER(name) LIKE '%set%' OR LOWER(name) LIKE '%copas%' OR LOWER(name) LIKE '%maceta%' OR category IN ('hogar', 'decoracion') THEN 
            (SELECT id FROM brands WHERE slug = 'lumina' LIMIT 1)
        WHEN LOWER(name) LIKE '%escultura%' OR LOWER(name) LIKE '%cerámica%' OR category = 'arte' THEN 
            (SELECT id FROM brands WHERE slug = 'mirage' LIMIT 1)
        WHEN LOWER(name) LIKE '%vino%' OR category = 'bebidas' THEN 
            (SELECT id FROM brands WHERE slug = 'prestige' LIMIT 1)
        ELSE 
            (SELECT id FROM brands WHERE slug = 'elegance' LIMIT 1)
    END
)
WHERE brand_id IS NULL;
