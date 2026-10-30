-- Integración con el CRM: estado comercial del lead y marca de prueba.
ALTER TABLE leads ADD COLUMN es_prueba BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN estado TEXT NOT NULL DEFAULT 'nuevo';      -- nuevo, contactado, cita, visita, venta, perdido
ALTER TABLE leads ADD COLUMN estado_en TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN estado_motivo TEXT;                        -- p. ej. motivo de pérdida
ALTER TABLE leads ADD COLUMN valor_venta NUMERIC(12,2);                 -- monto cuando estado = venta
ALTER TABLE leads ADD COLUMN asesor TEXT;                               -- asesor asignado en el CRM
ALTER TABLE leads ADD COLUMN crm_error TEXT;
ALTER TABLE leads ADD COLUMN crm_intentos INTEGER NOT NULL DEFAULT 0;

-- Leads creados durante la verificación del 27 oct 2026
UPDATE leads SET es_prueba = TRUE
WHERE nombre ILIKE 'PRUEBA%' OR utm_source = 'prueba' OR correo LIKE '%@ejemplo.com';

CREATE INDEX leads_estado_idx ON leads (estado);
