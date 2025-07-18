-- Crear los valores de variantes que faltan

-- Valores para color
INSERT INTO variant_values (option_id, value)
SELECT 
  vo.id,
  UNNEST(ARRAY['rojo', 'verde', 'azul']) as value
FROM variant_options vo 
WHERE vo.name = 'color'
  AND NOT EXISTS (
    SELECT 1 FROM variant_values vv 
    WHERE vv.option_id = vo.id 
    AND vv.value = UNNEST(ARRAY['rojo', 'verde', 'azul'])
  );

-- Valores para talla
INSERT INTO variant_values (option_id, value)
SELECT 
  vo.id,
  UNNEST(ARRAY['42-us', '40-us', '38']) as value
FROM variant_options vo 
WHERE vo.name = 'talla'
  AND NOT EXISTS (
    SELECT 1 FROM variant_values vv 
    WHERE vv.option_id = vo.id 
    AND vv.value = UNNEST(ARRAY['42-us', '40-us', '38'])
  );

-- Verificar valores creados
SELECT 'VALORES DE VARIANTES CREADOS' as section;
SELECT 
  vo.name as option_name,
  vv.id as value_id,
  vv.value
FROM variant_options vo
JOIN variant_values vv ON vo.id = vv.option_id
ORDER BY vo.name, vv.value;
