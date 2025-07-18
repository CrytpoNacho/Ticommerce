-- Insertar marcas iniciales
INSERT INTO brands (name, slug, description, image_url, website_url, is_active) VALUES
('Elegance', 'elegance', 'Elegance es una marca de lujo especializada en relojes y accesorios de alta gama. Cada pieza es creada con materiales de primera calidad y atención meticulosa al detalle. Nuestros diseñadores trabajan incansablemente para crear piezas que no solo son funcionales, sino también obras de arte que perduran en el tiempo.', '/placeholder-jfdo5.png', 'https://elegance-luxury.com', true),

('Royal', 'royal', 'Royal representa la excelencia en joyería y accesorios personales. Con más de 50 años de experiencia, nuestras piezas son símbolo de distinción y elegancia atemporal. Cada joya Royal es una inversión en belleza y calidad que se transmite de generación en generación.', '/placeholder-mrerb.png', 'https://royal-jewelry.com', true),

('Lumina', 'lumina', 'Lumina ilumina tu estilo con accesorios modernos y minimalistas. Diseños contemporáneos que complementan cualquier outfit con sofisticación y elegancia. Nuestra filosofía se basa en la simplicidad refinada y la funcionalidad estética.', '/placeholder-jvvlc.png', 'https://lumina-style.com', true),

('Prestige', 'prestige', 'Prestige es sinónimo de exclusividad. Nuestros productos son fabricados en ediciones limitadas, garantizando que cada cliente posea algo verdaderamente único y especial. La marca representa el pináculo del lujo y la distinción personal.', '/placeholder-14v2i.png', 'https://prestige-exclusive.com', true),

('Aurum', 'aurum', 'Aurum trabaja exclusivamente con oro y metales preciosos para crear piezas que perduran generaciones. Tradición orfebre combinada con diseños contemporáneos. Cada pieza Aurum es una declaración de riqueza y buen gusto.', '/placeholder-jfdo5.png', 'https://aurum-gold.com', true),

('Stellar', 'stellar', 'Stellar se inspira en las estrellas para crear accesorios que brillan con luz propia. Cada pieza es una obra de arte que captura la esencia del cosmos. Diseños únicos que reflejan la magnificencia del universo.', '/placeholder-mrerb.png', 'https://stellar-cosmic.com', true),

('Velvet', 'velvet', 'Velvet ofrece productos de lujo con texturas suaves y acabados impecables. Especializada en artículos de cuero y telas premium. La marca representa la sofisticación táctil y visual en cada uno de sus productos.', '/placeholder-jvvlc.png', 'https://velvet-luxury.com', true),

('Chronos', 'chronos', 'Chronos domina el arte de la relojería desde 1892. Nuestros relojes combinan la precisión suiza con diseños elegantes que trascienden las modas pasajeras. Cada reloj Chronos es una pieza de ingeniería y arte horológico.', '/placeholder-dykq3.png', 'https://chronos-watches.com', true),

('Opulence', 'opulence', 'Opulence crea experiencias sensoriales a través de fragancias y productos para el hogar. Aromas sofisticados que transforman cualquier espacio en un santuario de lujo y bienestar.', '/placeholder-jfdo5.png', 'https://opulence-scents.com', true),

('Ethereal', 'ethereal', 'Ethereal diseña prendas y accesorios con un toque etéreo y delicado. Materiales ligeros y translúcidos que evocan elegancia y sofisticación. La marca captura la esencia de lo sublime y lo refinado.', '/placeholder-mrerb.png', 'https://ethereal-fashion.com', true),

('Noir', 'noir', 'Noir se especializa en accesorios de color negro intenso. Elegancia minimalista para quienes aprecian la sobriedad y el refinamiento en cada detalle. La marca representa la sofisticación en su forma más pura.', '/placeholder-jvvlc.png', 'https://noir-minimal.com', true),

('Mirage', 'mirage', 'Mirage crea ilusiones visuales a través de sus diseños innovadores. Productos que sorprenden y cautivan desde cualquier ángulo que se observen. La marca juega con la percepción y la realidad para crear experiencias únicas.', '/placeholder-iwbdr.png', 'https://mirage-illusion.com', true)

ON CONFLICT (slug) DO NOTHING;
