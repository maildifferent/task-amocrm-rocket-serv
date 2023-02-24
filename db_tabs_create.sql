
CREATE TABLE amo_lead(
  id INTEGER PRIMARY KEY,
  name TEXT,
  price INTEGER,
  responsible_user_id INTEGER,
  status_id INTEGER,
  pipeline_id INTEGER,
  created_at INTEGER
);

CREATE TABLE entity_link(
  entity_id INTEGER,
  entity_type TEXT, -- 'contacts'
  to_entity_id INTEGER,
  to_entity_type TEXT, -- 'leads'
  PRIMARY KEY (entity_id, entity_type, to_entity_id, to_entity_type)
);

CREATE TABLE amo_contact(
  id INTEGER PRIMARY KEY,
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  responsible_user_id INTEGER,
  updated_at INTEGER
);

CREATE TABLE contact_custom_field(
  zz_contact_id INTEGER,
  zz_field_code1 TEXT,
  zz_field_code2 TEXT,
  field_name TEXT,
  zz_values TEXT[],
  PRIMARY KEY (zz_contact_id, zz_field_code1, zz_field_code2)
);

CREATE TABLE pipeline_status(
  id INTEGER PRIMARY KEY,
  name TEXT,
  pipeline_id INTEGER,
  color TEXT
);

CREATE TABLE responsible_user(
  id INTEGER PRIMARY KEY,
  name TEXT
);
