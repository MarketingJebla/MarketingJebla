-- Leads del sitio Chevrolet Jebla Ciudad Victoria.
-- Fuente de verdad: el CRM leerá de aquí. Google Sheets es solo una copia.
CREATE TABLE leads (
  id               BIGSERIAL PRIMARY KEY,
  folio            TEXT NOT NULL UNIQUE,          -- JV-XXXXXX (también es el event_id de Meta/GA4)
  creado_en        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Contacto
  nombre           TEXT NOT NULL,
  telefono         TEXT NOT NULL,                 -- 10 dígitos, sin +52
  correo           TEXT,

  -- Interés y calificación
  interes          TEXT,                          -- cotizacion, prueba, financiamiento, seminuevos, servicio
  modelo           TEXT,
  version          TEXT,
  color            TEXT,
  tiempo           TEXT,                          -- cuándo piensa estrenar
  enganche         TEXT,
  puntos           INTEGER,
  calidad          TEXT,                          -- caliente, tibio, frío
  plan             TEXT,                          -- plan de la calculadora de enganche

  -- Origen
  origen           TEXT,                          -- formulario que lo generó (modelo-onix, contacto, …)
  pagina           TEXT,
  referrer         TEXT,
  utm_source       TEXT,
  utm_medium       TEXT,
  utm_campaign     TEXT,
  utm_content      TEXT,
  utm_term         TEXT,
  gclid            TEXT,
  fbclid           TEXT,
  fbp              TEXT,                          -- cookie _fbp (para API de Conversiones de Meta)
  fbc              TEXT,                          -- cookie _fbc
  user_agent       TEXT,

  -- Campos extra de formularios específicos (auto a cuenta, servicio, etc.)
  extra            JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Estado de sincronización
  sheet_sync_en    TIMESTAMPTZ,
  sheet_error      TEXT,
  sheet_intentos   INTEGER NOT NULL DEFAULT 0,
  crm_sync_en      TIMESTAMPTZ,
  crm_id           TEXT
);

CREATE INDEX leads_creado_en_idx ON leads (creado_en DESC);
CREATE INDEX leads_sheet_pendiente_idx ON leads (creado_en) WHERE sheet_sync_en IS NULL;
CREATE INDEX leads_crm_pendiente_idx ON leads (creado_en) WHERE crm_sync_en IS NULL;
