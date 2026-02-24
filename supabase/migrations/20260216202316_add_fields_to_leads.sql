/*
  # Добавяне на нови полета към leads таблица

  1. Промени
    - Добавя `uses_booking_software` (boolean) - Използва ли софтуер за записване
    - Добавя `preferred_contact_method` (text) - Предпочитан начин за контакт (Телефон/Имейл)
  
  2. Бележки
    - Полетата са nullable за съвместимост със съществуващи записи
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'uses_booking_software'
  ) THEN
    ALTER TABLE leads ADD COLUMN uses_booking_software boolean;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'preferred_contact_method'
  ) THEN
    ALTER TABLE leads ADD COLUMN preferred_contact_method text;
  END IF;
END $$;