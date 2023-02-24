
-- Эти тестовые данные не актуальны.
-- Использовать их без обновления не получится.

-- INSERT INTO amo_lead 
--   (id, name, price, responsible_user_id, status_id, pipeline_id, created_at)
--   VALUES
--   (239529, 'Сделка 1', 0, 9219490, 54958050, 6428286, 1675937365),
--   (239530, 'Сделка 2', 1000, 9219490, 54958050, 6428286, 1675937365);

-- INSERT INTO entity_link
--   (entity_id, entity_type, to_entity_id, to_entity_type)
--   VALUES
--   (352919, 'contacts', 239529, 'leads'),
--   (352920, 'contacts', 239530, 'leads');

-- INSERT INTO amo_contact
--   (id, name, first_name, last_name, responsible_user_id, updated_at, zz_custom_field_ids)
--   VALUES
--   (352919, 'Петр Петров', 'Петр', 'Петров', 9219490, 1675937258, '{238199, 238201}'),
--   (352920, 'Иван Иванов', 'Иван', 'Иванов', 9219490, 1675937258, '{238199, 238201}');

-- INSERT INTO contact_custom_field
--   (field_id, field_name, zz_field_code1, zz_field_code2, zz_values)
--   VALUES
--   (238199, 'Телефон', 'PHONE', 'WORK', '{"+7 999 999 99 99"}'),
--   (238201, 'Email', 'EMAIL', 'WORK', '{"mail@mail.ru"}');

-- INSERT INTO pipeline_status
--   (id, name, pipeline_id, color)
--   VALUES
--   (54958046, 'Неразобранное', 6428286, '#c1c1c1'),
--   (54958050, 'Первичный контакт', 6428286, '#99ccff'),
--   (54958054, 'Переговоры', 6428286, '#ffff99');

-- INSERT INTO responsible_user
--   (id, name)
--   VALUES
--   (9219490, 'mmm wwww');
  