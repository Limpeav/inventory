
-- ==============================================================================
-- COMPREHENSIVE SEED DATA FOR SEWING MACHINE & GARMENT EQUIPMENT INVENTORY
-- ==============================================================================
BEGIN;

INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES ('70056b06-1483-450a-9bb8-41738eae071d', 'Buttonhole & Button Attach (ម៉ាស៊ីនជ្រៀកឡេវ & កាត់ឡេវ)', 'Industrial eyelet buttonholing, straight buttonholing and button sewing machines for apparel factories', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES ('f1ea60ab-3341-4124-8033-fab7a53cfef5', 'Pattern & Bar-tacking Machines (ម៉ាស៊ីនក្បាច់ & ជន្ទល់)', 'Computerized programmable pattern stitching and high-speed bar-tacking machines', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES ('87bedcba-aaa7-4b03-96dd-dca4840236f4', 'Cutting & Fabric Preparation (ម៉ាស៊ីនកាត់ក្រណាត់)', 'Straight knife fabric cutting machines, rotary disc shears, and end cutters', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES ('c1782007-934b-41a6-bb85-34a9143369f7', 'Pressing & Steam Equipment (អ៊ុត & ឆ្នាំងចំហាយទឹក)', 'Industrial gravity feed steam irons, steam boilers, vacuum tables, and fusing press machines', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES ('39bfb7b3-5b00-4a88-96a4-b7c1eff8c3c3', 'Motors & Servo Drives (ម៉ូទ័រសន្សំភ្លើង & ប្រអប់បញ្ជា)', 'Energy-saving brushless servo motors, synchronizers, and digital control boxes', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES ('b750c618-b89d-4516-9961-078e87b21429', 'Sewing Tables & Stands (តុ និងជើងម៉ាស៊ីនដេរ)', 'Heavy gauge steel stands, adjustable table tops with measuring scale, and pedal linkages', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '8442c6ac-e64e-48c9-ae54-69388e7d35a7',
  'Jack A4B Automatic Thread Trimmer Lockstitch',
  'SM-JK-A4B-N',
  'A4B',
  'JACK',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនដេរត្រង់ JACK A4B កាត់អំបោះស្វ័យប្រវត្តិ (ថ្មី)',
  'Smart computerized lockstitch with automatic thread trimming, auto presser foot lifter, and voice guide.',
  'f3e34515-f0fb-4eb0-b48f-49834e30e73a',
  340,
  440,
  4,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('d344c584-aa8c-4fd0-b93e-5a7ec849fe83', '8442c6ac-e64e-48c9-ae54-69388e7d35a7', 14, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 14;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '29b14fc5-eb59-403a-aa96-8fcdb37575a8',
  'Brother S-7200C Direct-Drive Lockstitch',
  'SM-BR-S7200-N',
  'S-7200C-403',
  'BROTHER',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនដេរត្រង់ Brother S-7200C កាត់អំបោះ (ថ្មី)',
  'Single needle direct drive lockstitch with electronic feeding system and thread trimmer.',
  'f3e34515-f0fb-4eb0-b48f-49834e30e73a',
  420,
  540,
  4,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('5ba825b3-f390-484e-9f7e-0a29fb2cef5a', '29b14fc5-eb59-403a-aa96-8fcdb37575a8', 2, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 2;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  'cfb635d6-02ac-4ec5-a707-b841aa0a4eb0',
  'Singer 191D High-Speed Industrial Lockstitch',
  'SM-SG-191D-N',
  '191D-30',
  'SINGER',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនដេរត្រង់ Singer 191D ល្បឿនលឿន (ថ្មី)',
  'Classic industrial lockstitch machine with stand and energy-saving servo motor.',
  'f3e34515-f0fb-4eb0-b48f-49834e30e73a',
  280,
  360,
  5,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('04053a0e-4edf-49b1-83d8-ad28d1891133', 'cfb635d6-02ac-4ec5-a707-b841aa0a4eb0', 11, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 11;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '86445838-1e43-4edc-a91b-8e4f5a065c40',
  'Juki DDL-5550 (Used Japan / មួយទឹក)',
  'SM-JK-5550-U',
  'DDL-5550',
  'JUKI',
  'USED',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនដេរត្រង់ Juki DDL-5550 (មួយទឹក ជប៉ុន)',
  'Authentic vintage Made in Japan single needle lockstitch machine. Fully tuned with 6 months warranty.',
  'f3e34515-f0fb-4eb0-b48f-49834e30e73a',
  140,
  220,
  3,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('4ca8fbc3-06ce-4b7b-9da1-153abd9ff0e3', '86445838-1e43-4edc-a91b-8e4f5a065c40', 5, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 5;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '1b319920-46a4-4427-ab37-082c070977bb',
  'Jack E4S 4-Thread Super Energy-Saving Overlock',
  'SM-JK-E4S-N',
  'E4S-4',
  'JACK',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនវ៉ៃរ៉ង Jack E4S ៤សរសៃ សន្សំភ្លើង (ថ្មី)',
  'Smart high-speed 4-thread overlock with integrated direct-drive motor, adjustable for light to heavy fabrics.',
  '34345e33-1a16-4464-b203-223c656a0a39',
  350,
  460,
  5,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('f7c9117f-7049-4d2b-890d-06d2caadfb9e', '1b319920-46a4-4427-ab37-082c070977bb', 18, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 18;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '18cd485f-b2bf-4a77-a9dd-bf5802b2ecf9',
  'Pegasus M900 5-Thread Heavy Duty Overlock',
  'SM-PG-M900-N',
  'M952-52-2X4',
  'PEGASUS',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនវ៉ៃរ៉ង Pegasus M900 ៥សរសៃ (ថ្មី)',
  'Oil-barrier safety stitch 5-thread overlock for shirts, trousers, and polo shirts.',
  '34345e33-1a16-4464-b203-223c656a0a39',
  580,
  720,
  3,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('63f07e8e-0d9c-4d92-8462-0047e9def3db', '18cd485f-b2bf-4a77-a9dd-bf5802b2ecf9', 7, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 7;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  'a3b04188-b97c-45ca-83ec-8564e5818072',
  'Siruba C007K Flatbed Interlock / Coverstitch',
  'SM-SR-C007-N',
  'C007K-W122-356',
  'SIRUBA',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនរ៉ង់កៅស៊ូ Siruba C007K ក្បាលរាប (ថ្មី)',
  '3-needle 5-thread flatbed interlock machine with top and bottom coverstitch for t-shirt hemming.',
  '44e72254-1161-4893-aff3-1a5c2d1ea336',
  680,
  850,
  3,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('c8ade073-31ab-4073-9498-3c45218ec904', 'a3b04188-b97c-45ca-83ec-8564e5818072', 6, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 6;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '8baf9c31-d058-4a5a-b0bf-5b6a4b7193ea',
  'Jack W4 Cylinder-Bed Interlock Machine',
  'SM-JK-W4-N',
  'W4-D-01GB',
  'JACK',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនរ៉ង់កៅស៊ូ Jack W4 ក្បាលមូល (ថ្មី)',
  'Direct drive cylinder bed interlock coverstitch machine for cuffs, collars, and sportswear.',
  '44e72254-1161-4893-aff3-1a5c2d1ea336',
  620,
  780,
  2,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('feb0cc6d-a2dd-4997-8d08-394a3e306b5c', '8baf9c31-d058-4a5a-b0bf-5b6a4b7193ea', 4, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 4;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  'f9b7dda6-059b-4641-becb-e4f1ef87f572',
  'Juki DNU-1541 Walking Foot Heavy Duty Lockstitch',
  'SM-JK-1541-N',
  'DNU-1541',
  'JUKI',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនដេរស្បែក ជើងទា Juki DNU-1541 (ថ្មី)',
  'Single needle unison-feed walking foot lockstitch machine with double capacity hook for thick leather and canvas.',
  'aad6adcf-be96-418f-93f2-3fa640339be4',
  950,
  1250,
  2,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('07d720f1-4813-468a-813b-ebd505b9ef8d', 'f9b7dda6-059b-4641-becb-e4f1ef87f572', 5, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 5;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '0ce48f7a-e773-48af-ab1c-cdb987c6cf78',
  'Juki DNU-1541 (Refurbished Japan / កែច្នៃ)',
  'SM-JK-1541-R',
  'DNU-1541',
  'JUKI',
  'REFURBISHED',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនដេរស្បែក Juki DNU-1541 (ជប៉ុន កែច្នៃឡើងវិញ)',
  'Original Japanese walking foot machine fully reconditioned with new bearings, hook, and servo motor.',
  'aad6adcf-be96-418f-93f2-3fa640339be4',
  480,
  680,
  2,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('f0dcc605-8e6e-4b27-baa4-4be9bc01ba02', '0ce48f7a-e773-48af-ab1c-cdb987c6cf78', 3, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 3;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '8b524e02-e4ce-485b-82ca-a36aa925b29c',
  'Typical GC6-7 Heavy Duty Walking Foot Machine',
  'SM-TY-GC67-N',
  'GC6-7',
  'TYPICAL',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនដេរជើងទា Typical GC6-7 សម្រាប់ខោខូវប៊យ (ថ្មី)',
  'Heavy material walking foot lockstitch for upholstery, bags, jeans, and car seats.',
  'aad6adcf-be96-418f-93f2-3fa640339be4',
  410,
  530,
  2,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('368ad99b-20e6-4c56-982b-b928c0ddb725', '8b524e02-e4ce-485b-82ca-a36aa925b29c', 5, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 5;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '3f5a3b40-06c6-4731-a378-72e7acee289b',
  'Jack JK-T1790 Electronic Buttonholing Machine',
  'SM-JK-1790-N',
  'JK-T1790GS',
  'JACK',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនជ្រៀកឡេវ Jack JK-T1790 អេឡិចត្រូនិច (ថ្មី)',
  'Computerized buttonhole sewing machine with 30 pre-programmed buttonhole patterns and LCD touch display.',
  '70056b06-1483-450a-9bb8-41738eae071d',
  1650,
  2150,
  1,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('5e0949ce-101b-4881-8dc6-2888020422c8', '3f5a3b40-06c6-4731-a378-72e7acee289b', 3, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 3;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '0a555a4e-885f-41ba-b961-6c671c694a12',
  'Juki LBH-781 Industrial Buttonholing (Used Japan / មួយទឹក)',
  'SM-JK-781-U',
  'LBH-781',
  'JUKI',
  'USED',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនជ្រៀកឡេវ Juki LBH-781 (មួយទឹក ជប៉ុន)',
  'Famous mechanical buttonholing machine imported from Japan. Renowned for durability and clean cutting.',
  '70056b06-1483-450a-9bb8-41738eae071d',
  750,
  1050,
  2,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('28294a4c-f38b-4635-9f7d-2df5aac22f49', '0a555a4e-885f-41ba-b961-6c671c694a12', 1, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 1;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  'c4d6b4b4-c699-46ec-b159-545152cd7944',
  'Juki LK-1900A Electronic Bar-Tacking Machine',
  'SM-JK-1900-N',
  'LK-1900A-HS',
  'JUKI',
  'NEW',
  'Set',
  'MACHINE',
  'ម៉ាស៊ីនជន្ទល់ Juki LK-1900A អេឡិចត្រូនិច (ថ្មី)',
  'High-speed electronic bar-tacker with 50 standard patterns for pocket corners, belt loops, and labels.',
  'f1ea60ab-3341-4124-8033-fab7a53cfef5',
  1850,
  2400,
  1,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('1982b5db-fd69-4fb3-bf5b-2240e991a2a1', 'c4d6b4b4-c699-46ec-b159-545152cd7944', 3, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 3;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '1151d26f-f436-4efa-a653-9e05969cd02d',
  'Eastman Blue Streak II 8-inch Cloth Cutting Machine',
  'EQ-EM-BS8-N',
  '629X 8"',
  'EASTMAN',
  'NEW',
  'Unit',
  'EQUIPMENT',
  'ម៉ាស៊ីនកាត់ក្រណាត់ Eastman Blue Streak II ៨អុីញ (ថ្មី)',
  'USA standard 8-inch vertical straight knife cutting machine for cutting high-ply fabric blocks.',
  '87bedcba-aaa7-4b03-96dd-dca4840236f4',
  520,
  680,
  2,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('c8d095d0-4262-44bf-bab4-e7da0daadd54', '1151d26f-f436-4efa-a653-9e05969cd02d', 6, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 6;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '67c30839-765b-490b-a611-ea8cf9764d87',
  'KM KS-EU 8-inch Vertical Cloth Cutting Machine',
  'EQ-KM-KSEU-N',
  'KS-EU 8"',
  'KM JAPAN',
  'NEW',
  'Unit',
  'EQUIPMENT',
  'ម៉ាស៊ីនកាត់ក្រណាត់ KM ៨អុីញ (ថ្មី)',
  'Heavy-duty industrial cloth cutting machine with automatic abrasive belt sharpener.',
  '87bedcba-aaa7-4b03-96dd-dca4840236f4',
  440,
  580,
  2,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('0b6b6abd-3bf0-4ccc-87af-445351255a0f', '67c30839-765b-490b-a611-ea8cf9764d87', 5, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 5;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '05df5ef1-ba01-4ca4-b85c-13d4edaacb01',
  'Lejiang YJ-65 Octagonal Mini Rotary Fabric Cutter',
  'EQ-LJ-YJ65-N',
  'YJ-65',
  'LEJIANG',
  'NEW',
  'Unit',
  'EQUIPMENT',
  'ម៉ាស៊ីនកាត់ក្រណាត់ដៃ Lejiang YJ-65 ខ្នាតតូច (ថ្មី)',
  'Handheld 65mm octagonal blade mini electric fabric shear for pattern cutting and sample making.',
  '87bedcba-aaa7-4b03-96dd-dca4840236f4',
  28,
  45,
  5,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('3ad28ecf-5853-4f8f-b295-3c3278c7ed80', '05df5ef1-ba01-4ca4-b85c-13d4edaacb01', 25, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 25;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  'e34d0459-cfcb-41a4-a099-68dd0fb791f7',
  'Silver Star ES-300 Gravity Feed Industrial Steam Iron Set',
  'EQ-SS-ES300-N',
  'ES-300',
  'SILVER STAR',
  'NEW',
  'Set',
  'EQUIPMENT',
  'ឆ្នាំងអ៊ុតចំហាយទឹក Silver Star ES-300 មួយឈុត (ថ្មី)',
  'Complete Korean gravity feed steam iron set with water reservoir tank, silicone iron rest, and hose.',
  'c1782007-934b-41a6-bb85-34a9143369f7',
  42,
  65,
  6,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('0ba93589-5ef8-41b8-a2a9-77d82a732426', 'e34d0459-cfcb-41a4-a099-68dd0fb791f7', 28, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 28;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '8b8198d8-e37a-4858-8bfe-980d29eaa68d',
  'Hashima HP-450 Compact Desktop Fusing Press',
  'EQ-HS-HP450-N',
  'HP-450MS',
  'HASHIMA',
  'NEW',
  'Unit',
  'EQUIPMENT',
  'ម៉ាស៊ីនអ៊ុតស្អិតកអាវ Hashima HP-450 (ថ្មី)',
  '450mm desktop continuous fusing press machine for shirt collars, cuffs, and front plackets.',
  'c1782007-934b-41a6-bb85-34a9143369f7',
  1100,
  1450,
  1,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('7653b5a4-55a8-497f-8285-0efcc9795e6c', '8b8198d8-e37a-4858-8bfe-980d29eaa68d', 2, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 2;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '6247a796-c0cb-4892-9928-259c41f90f06',
  'Jack Powermax 550W Energy-Saving Servo Motor',
  'SP-JK-SM550-N',
  'JK-513A 550W',
  'JACK',
  'NEW',
  'Set',
  'SPARE_PART',
  'ម៉ូទ័រសន្សំភ្លើង Jack 550W បំពាក់គ្រប់ម៉ាស៊ីន (ថ្មី)',
  '70% power-saving brushless servo motor with needle sync positioner and speed control display.',
  '39bfb7b3-5b00-4a88-96a4-b7c1eff8c3c3',
  65,
  95,
  10,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('1e6fb2b8-f039-42f6-90b6-298a438c14ed', '6247a796-c0cb-4892-9928-259c41f90f06', 32, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 32;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  'ef8ce3dd-69e1-4d75-95aa-9d529d510ca7',
  'Heavy-Duty Garment Table Top & Adjustable Steel Stand',
  'AC-TB-12060-N',
  'STD-120x60',
  'LOCAL MFG',
  'NEW',
  'Set',
  'EQUIPMENT',
  'តុ និងជើងម៉ាស៊ីនដេរដែកក្រាស់ មានបន្ទាត់ (ថ្មី)',
  '120x60cm laminated wooden table top with engraved metric/inch ruler and heavy gauge steel stand.',
  'b750c618-b89d-4516-9961-078e87b21429',
  35,
  55,
  10,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('92d92735-fa2a-48a6-8bca-49aaaf0cee08', 'ef8ce3dd-69e1-4d75-95aa-9d529d510ca7', 42, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 42;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '6baf79db-c552-4901-b4f9-e07465aefe95',
  'Organ DPx5 #18 Needles for Heavy Leather & Jeans (Box of 10)',
  'SP-OG-DPX5-18',
  'DPx5 #18',
  'ORGAN',
  'NEW',
  'Box',
  'SPARE_PART',
  'ម្ជុល Organ DPx5 លេខ១៨ សម្រាប់ដេរស្បែក (១០ដើម/ប្រអប់)',
  'Heavy-gauge reinforced industrial needles for walking foot machines, denim, and leather upholstery.',
  '2a8d98c1-a70b-486e-bf52-4396260c8c34',
  2.1,
  4,
  25,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('2da0f912-6d92-4826-afa4-8283a13f7153', '6baf79db-c552-4901-b4f9-e07465aefe95', 160, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 160;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '30707025-9bda-47d0-b416-ea81b70723f6',
  'Groz-Beckert DCx27 #11 Overlock Needles (Pack of 10)',
  'SP-GB-DC27-11',
  'DCx27 #11',
  'GROZ-BECKERT',
  'NEW',
  'Box',
  'SPARE_PART',
  'ម្ជុល Groz-Beckert DCx27 លេខ១១ សម្រាប់ម៉ាស៊ីនរ៉ង',
  'German precision overlock needles for high-speed edge hemming and delicate jersey knitwear.',
  '2a8d98c1-a70b-486e-bf52-4396260c8c34',
  2.5,
  4.8,
  30,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('06fbc29f-b018-42fd-b73f-8dd2004028ed', '30707025-9bda-47d0-b416-ea81b70723f6', 15, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 15;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  'd4555eaa-da57-41c2-a527-d1d1de57eb1b',
  'Siruba 747K Upper & Lower Carbide Knife Blades Set',
  'SP-SR-KNIFE-747',
  'KR23 / KR35',
  'SIRUBA',
  'NEW',
  'Pcs',
  'SPARE_PART',
  'ផ្លែកាំបិតលើក្រោម ម៉ាស៊ីនវ៉ៃរ៉ង Siruba 747K (១គូ)',
  'High-durability carbide steel knife cutter blade pair for Siruba and Jack overlock machines.',
  '2a8d98c1-a70b-486e-bf52-4396260c8c34',
  4.5,
  9,
  15,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('9db7bbfb-9350-44b6-a17b-6296fe3b0f34', 'd4555eaa-da57-41c2-a527-d1d1de57eb1b', 48, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 48;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  'fd9421c0-393c-40ae-9c94-d60634d8e191',
  'Industrial Steel Bobbins Box (Set of 25 Bobbins)',
  'SP-BB-STL25',
  'BB-25SET',
  'TOWA',
  'NEW',
  'Box',
  'SPARE_PART',
  'កូនប៊ូប៊ីនដែក ២៥គ្រាប់ ក្នុងប្រអប់ថ្លា',
  'Universal aluminium/steel bobbin set for standard lockstitch sewing machines with storage organizer case.',
  '2a8d98c1-a70b-486e-bf52-4396260c8c34',
  3.2,
  6.5,
  20,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('fc0e5b33-6a33-41dd-a51d-583b7e89bf93', 'fd9421c0-393c-40ae-9c94-d60634d8e191', 75, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 75;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '196e818a-4299-4446-bf35-f8c82a1306d5',
  'Singer Industrial Sewing Lubricant 5L Gallon',
  'AC-SG-OIL-5L',
  'White Oil 5L',
  'SINGER',
  'NEW',
  'Bottle',
  'CONSUMABLE',
  'ប្រេងម៉ាស៊ីនដេរ Singer សស្អាត កាន ៥លីត្រ',
  'Premium high-viscosity mineral sewing oil in economic 5-liter container for factory bulk maintenance.',
  'e54ac95b-64e9-46e6-9f49-a169aa23301d',
  9.8,
  16.5,
  10,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('b743e40b-1ab3-44c6-980f-5d76b051f4e9', '196e818a-4299-4446-bf35-f8c82a1306d5', 32, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 32;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '2133ff04-44d7-4ba7-be58-3a52aec9cb23',
  'LED Flexible Magnetic Gooseneck Sewing Lamp 30-LED',
  'AC-LT-MG30-N',
  'TD-30M',
  'SUN',
  'NEW',
  'Pcs',
  'ACCESSORY',
  'អំពូល LED ម៉ាញ៉េទិច ៣០គ្រាប់ សម្រាប់ម៉ាស៊ីនដេរ',
  'Super bright 30-LED energy saving lamp with strong magnetic base and 360-degree flexible gooseneck.',
  'e54ac95b-64e9-46e6-9f49-a169aa23301d',
  3.5,
  7,
  15,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('d222ac26-c2e4-4e41-9e75-5d4b51ac8e8b', '2133ff04-44d7-4ba7-be58-3a52aec9cb23', 70, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 70;
INSERT INTO products (id, name, barcode, model, brand, condition, package_unit, product_type, name_kh, description, category_id, cost, price, reorder_level, hidden, deleted, start_date, created_at, updated_at)
VALUES (
  '735146e2-4bd9-42e1-a67b-b959ca6fec77',
  'Industrial Presser Foot 16-Piece Assortment Kit',
  'AC-PF-KIT16',
  'PF-KIT16',
  'JUKI / UNIVERSAL',
  'NEW',
  'Set',
  'ACCESSORY',
  'ឈុតជើងទាញ ១៦មុខ សម្រាប់ម៉ាស៊ីនដេរត្រង់',
  'Zipper foot, rolled hemmer, piping foot, gathering foot, Teflon non-stick foot, and edge guide feet.',
  'e54ac95b-64e9-46e6-9f49-a169aa23301d',
  8.5,
  16,
  10,
  false, false, '2026-01-01', NOW(), NOW()
);
INSERT INTO stock_items (id, product_id, quantity, reserved_qty, updated_at)
VALUES ('a2afae7f-9743-4285-a4f8-f3b5ff56d7c4', '735146e2-4bd9-42e1-a67b-b959ca6fec77', 30, 0, NOW())
ON CONFLICT (product_id) DO UPDATE SET quantity = 30;
INSERT INTO suppliers (id, name, contact_name, telephone, phone, fax, address, email, website, country, description, created_at, updated_at)
VALUES (
  '46c3bc60-f640-49e1-8d22-fb43f5ab7c9b',
  'Siruba Industrial Equipment (Cambodia Branch)',
  'Lin Wei-Ming',
  '023882244',
  '012998833',
  '023882245',
  'No. 88, Russian Blvd, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
  'info@siruba-kh.com',
  'https://www.siruba.com',
  'Taiwan / Cambodia',
  'Official direct importer of Siruba industrial overlock and interlock sewing machinery.',
  NOW(), NOW()
);
INSERT INTO suppliers (id, name, contact_name, telephone, phone, fax, address, email, website, country, description, created_at, updated_at)
VALUES (
  'ced3b8a3-4e6d-4551-abd5-865699be74d2',
  'Brother Machinery Cambodia Co., Ltd.',
  'Kenji Tanaka / Tep Sreymom',
  '023991122',
  '098334455',
  '023991123',
  'Vattanac Capital Tower, Level 18, Preah Monivong Blvd, Phnom Penh',
  'sales@brother.com.kh',
  'https://www.brother.com.kh',
  'Japan / Cambodia',
  'Authorized distributor of Brother computerized sewing machines and garment printing equipment.',
  NOW(), NOW()
);
INSERT INTO suppliers (id, name, contact_name, telephone, phone, fax, address, email, website, country, description, created_at, updated_at)
VALUES (
  'cc5885cd-162e-409a-b709-5c5d3b2784a1',
  'Pegasus Sewing Machine PTE Ltd.',
  'David Ng (Regional Sales)',
  '+6567451122',
  '+6591234567',
  '+6567451133',
  '304 Orchard Road #05-12, Lucky Plaza, Singapore',
  'contact@pegasus.com.sg',
  'https://www.pegasus.co.jp',
  'Singapore',
  'High-speed chainstitch and chain-off safety stitch industrial machine supplier.',
  NOW(), NOW()
);
INSERT INTO suppliers (id, name, contact_name, telephone, phone, fax, address, email, website, country, description, created_at, updated_at)
VALUES (
  'd88ac515-ab19-4141-ad48-ac5947d1dfb2',
  'Guangzhou Textile Machinery & Spare Parts Wholesaler',
  'Liu Jianhua (Export Manager)',
  '+862088339900',
  '+8613800138000',
  '+862088339901',
  'Block C, International Garment Machinery Market, Haizhu District, Guangzhou',
  'export@gz-sewingparts.cn',
  'https://www.gz-sewingparts.cn',
  'China',
  'Wholesale distributor of industrial needles, rotary hooks, bobbins, motors, and presser feet.',
  NOW(), NOW()
);
INSERT INTO suppliers (id, name, contact_name, telephone, phone, fax, address, email, website, country, description, created_at, updated_at)
VALUES (
  '9dea16e4-ad53-4995-90b2-b3fc6d9bc8c7',
  'Silver Star Pressing Equipment Co.',
  'Park Sung-Hoon',
  '+82328114400',
  '+821098765432',
  '+82328114401',
  'B-702, Incheon Technopark, Namdong-gu, Incheon, Republic of Korea',
  'global@silverstar.co.kr',
  'https://www.silverstar.co.kr',
  'South Korea',
  'Leading manufacturer of industrial gravity steam irons, boilers, and garment finishing stations.',
  NOW(), NOW()
);
INSERT INTO suppliers (id, name, contact_name, telephone, phone, fax, address, email, website, country, description, created_at, updated_at)
VALUES (
  '74295fd5-99d2-4cea-abb2-20993334d469',
  'Phnom Penh Hardware & Industrial Lubricants Trading',
  'Chhay Mengleang',
  '023667788',
  '017882299',
  '023667789',
  'St. 271, Sangkat Boeng Tumpun, Khan Mean Chey, Phnom Penh',
  'pp.industrial.oils@gmail.com',
  '',
  'Cambodia',
  'Local distributor of sewing machine white mineral oils, table frames, belts, and work lights.',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  '476ad96b-de50-4879-9994-93f6a084f2c9',
  'CUST-003',
  'Manhattan SEZ Textile & Garment Hub',
  'រោងចក្រ មេនហាតធេន (តំបន់សេដ្ឋកិច្ចពិសេស)',
  '044710123',
  '044710124',
  'Manhattan Special Economic Zone, National Road 1, Bavet, Svay Rieng',
  'តំបន់សេដ្ឋកិច្ចពិសេសមេនហាតធេន ផ្លូវជាតិលេខ១ ក្រុងបាវិត ខេត្តស្វាយរៀង',
  'procurement@manhattan-sez.com',
  'Svay Rieng',
  50000,
  30,
  0,
  'Large export garment manufacturing plant specializing in woven shirts and jackets for European brands.',
  'K002-901234567',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  '1e8d5bdf-3ef1-4f74-838d-1e38cab2d802',
  'CUST-004',
  'Tai Seng Garment Factory',
  'រោងចក្រកាត់ដេរ តៃសេង បាវិត',
  '044715566',
  '044715567',
  'Tai Seng Special Economic Zone, Bavet City, Svay Rieng',
  'តំបន់សេដ្ឋកិច្ចពិសេសតៃសេង ក្រុងបាវិត ខេត្តស្វាយរៀង',
  'factory@taiseng-apparel.com',
  'Svay Rieng',
  30000,
  30,
  0,
  'Garment manufacturing complex producing sportswear, knitted jerseys, and hoodies.',
  'K003-881230012',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  'feb58a49-5d80-4ced-84c4-ae26ab4d81ce',
  'CUST-005',
  'Bright Garment Manufacturing Ltd.',
  'ក្រុមហ៊ុន ព្រាយហ្គាម៉ិន ខេមបូឌា',
  '023881144',
  '023881145',
  'Canadia Industrial Park, Veng Sreng Blvd, Sangkat Chaom Chau, Khan Pur Senchey, Phnom Penh',
  'សួនឧស្សាហកម្មកាណាឌីយ៉ា មហាវិថីវេងស្រេង សង្កាត់ចោមចៅ ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
  'purchasing@brightgarment.com.kh',
  'Phnom Penh',
  25000,
  15,
  0,
  'Medium apparel factory with 600 workers producing casual wear and uniform pants.',
  'K001-778899112',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  '674e63e3-3328-4cd9-8c5d-80003ab0d33f',
  'CUST-006',
  'Sabrina Garment Manufacturing',
  'ក្រុមហ៊ុន សាប្រ៊ីណា ហ្គាម៉ិន (កំពង់ស្ពឺ)',
  '025987111',
  '025987112',
  'National Road 4, Phum Samrong, Sangkat Roka Thum, Krong Chbar Mon, Kampong Speu',
  'ផ្លូវជាតិលេខ៤ ភូមិសំរោង សង្កាត់រកាធំ ក្រុងច្បារមន ខេត្តកំពង់ស្ពឺ',
  'contact@sabrina-kh.com',
  'Kampong Speu',
  40000,
  30,
  0,
  'Major sports apparel manufacturer operating over 1,200 industrial sewing workstations.',
  'K008-554433221',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  '086771a4-ae9a-4944-9c2f-c00cd51eeac7',
  'CUST-007',
  'Grand Twins International (Cambodia) Plc',
  'រោងចក្រ ហ្គ្រេនធ្វីន អ៊ិនធើណេសិនណល',
  '023890200',
  '023890201',
  'Phum Trapaing Por, Sangkat Chaom Chau, Khan Pur Senchey, Phnom Penh',
  'ភូមិត្រពាំងពោធិ៍ សង្កាត់ចោមចៅ ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ',
  'info@grandtwins.com.kh',
  'Phnom Penh',
  60000,
  45,
  0,
  'Publicly listed apparel manufacturing corporation supplying Nike and global athletic brands.',
  'K001-112233445',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  'a395c9c9-cf2d-41f9-b3c1-ec8f31f272bc',
  'CUST-008',
  'Sovannaphum High Fashion Boutique',
  'ហាងកាត់សម្លៀកបំពាក់ សុវណ្ណភូមិ',
  '012445588',
  '',
  'St. 315, Sangkat Boeng Kak 1, Khan Toul Kork, Phnom Penh',
  'ផ្លូវ ៣១៥ សង្កាត់បឹងកក់១ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
  'sovannaphum.fashion@gmail.com',
  'Phnom Penh',
  3000,
  7,
  0,
  'High-end custom evening gown, traditional Khmer wedding costume, and silk dress atelier.',
  '',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  'c3c6c355-ccd9-415d-a01b-016e625fe670',
  'CUST-009',
  'Siem Reap Traditional Silk & Dressmaker',
  'ហាងកាត់ដេរ សូត្រខ្មែរ សៀមរាប',
  '063965888',
  '',
  'Wat Bo Road, Sala Kamreuk, Krong Siem Reap',
  'ផ្លូវវត្តបូព៌ សង្កាត់សាលាកំរើក ក្រុងសៀមរាប ខេត្តសៀមរាប',
  'siemreap.silksewing@gmail.com',
  'Siem Reap',
  2000,
  0,
  0,
  'Artisan tailor shop crafting handwoven silk scarves, hol, and bespoke tourism fashion.',
  '',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  '6be1893c-643e-4fb7-a0b2-6a23fbd767e3',
  'CUST-010',
  'Battambang Modern Tailoring',
  'ហាងកាត់ដេរ ទំនើប បាត់ដំបង',
  '053952777',
  '',
  'Street 1, Sangkat Svay Pao, Krong Battambang',
  'ផ្លូវលេខ១ សង្កាត់ស្វាយប៉ោ ក្រុងបាត់ដំបង ខេត្តបាត់ដំបង',
  'btb.moderntailor@gmail.com',
  'Battambang',
  2500,
  7,
  0,
  'Men and women suit maker, custom alterations, and local school uniform maker.',
  '',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  '896672a8-9727-42d0-a412-3d44363da009',
  'CUST-011',
  'Sihanoukville Uniform & Workwear',
  'ហាងឯកសណ្ឋាន ព្រះសីហនុ',
  '034933999',
  '',
  'Ekareach Street, Sangkat 2, Krong Preah Sihanouk',
  'វិថីឯករាជ្យ សង្កាត់២ ក្រុងព្រះសីហនុ ខេត្តព្រះសីហនុ',
  'shv.uniforms@gmail.com',
  'Sihanoukville',
  5000,
  14,
  0,
  'Specializes in port worker coveralls, hotel staff uniforms, and security guard attire.',
  '',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  '6da29298-f3e5-41ae-9ee8-a8e31c34ea84',
  'CUST-012',
  'Toul Tompoung Custom Tailor',
  'ហាងកាត់ខោអាវ ទួលទំពូង',
  '098112233',
  '',
  'St. 155, Near Russian Market, Sangkat Toul Tompoung 1, Khan Chamkar Mon, Phnom Penh',
  'ផ្លូវ ១៥៥ ក្បែរផ្សារទួលទំពូង សង្កាត់ទួលទំពូង១ ខណ្ឌចំការមន រាជធានីភ្នំពេញ',
  'russianmarket.tailor@gmail.com',
  'Phnom Penh',
  1500,
  0,
  0,
  'Rapid turnaround custom jeans hemmer, linen shirt maker, and garment alterations.',
  '',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  'c9fb83c5-eca3-497c-be50-2754044ee331',
  'CUST-013',
  'Kampong Cham Apparel & Alterations',
  'សិប្បកម្មកាត់ដេរ កំពង់ចាម',
  '042941555',
  '',
  'Near Old Market, Krong Kampong Cham',
  'ក្បែរផ្សារធំ ក្រុងកំពង់ចាម ខេត្តកំពង់ចាម',
  'kpc.apparel@gmail.com',
  'Kampong Cham',
  1000,
  0,
  0,
  'Regional sewing cooperative producing curtains, bedsheets, and local garments.',
  '',
  NOW(), NOW()
);
INSERT INTO customers (id, customer_id, name, name_kh, phone, fax, address, address_kh, email, province, credit_limit, credit_days, status, description, vat, created_at, updated_at)
VALUES (
  '0460d73c-2022-4a17-b23a-91098be1e3d0',
  'CUST-014',
  'Walk-in Retail Customer (អតិថិជនទូទៅ)',
  'អតិថិជនទូទៅ (ទិញរាយ)',
  '012000000',
  '',
  'Showroom Counter POS, Phnom Penh',
  'តុលក់រាយ Showroom រាជធានីភ្នំពេញ',
  'walkin@store.local',
  'Phnom Penh',
  0,
  0,
  0,
  'Direct walk-in retail purchases for needles, sewing oil, scissors, and small parts.',
  '',
  NOW(), NOW()
);
INSERT INTO employees (id, name, gender, phone, address, start_date, picture_url, description, active, created_at, updated_at)
VALUES (
  '35f8a7da-e37f-4e73-9a0f-fd35d83aa067',
  'Sok Chenda (សុខ ចិន្តា)',
  'M',
  '012778899',
  'Sangkat Stung Meanchey, Khan Mean Chey, Phnom Penh',
  '2023-01-15',
  '',
  'Chief Technical Mechanic & Master Sewing Machine Tuner with 14 years garment factory experience.',
  true, NOW(), NOW()
);
INSERT INTO employees (id, name, gender, phone, address, start_date, picture_url, description, active, created_at, updated_at)
VALUES (
  '5b5c574a-57b4-48fe-98f3-66911a5999b6',
  'Heng Vicheka (ហេង វិច្ឆិកា)',
  'F',
  '098445566',
  'Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
  '2023-03-01',
  '',
  'Lead Warehouse & Inventory Controller. Oversees stock intake, reorder thresholds, and bin audits.',
  true, NOW(), NOW()
);
INSERT INTO employees (id, name, gender, phone, address, start_date, picture_url, description, active, created_at, updated_at)
VALUES (
  'd3c07a20-2810-440c-8536-6a461b834369',
  'Meas Sothea (មាស សុធា)',
  'M',
  '017332211',
  'Sangkat Chaom Chau, Khan Pur Senchey, Phnom Penh',
  '2023-06-10',
  '',
  'Senior Field Service Technician. Specializes in heavy-duty walking foot and overlock calibration.',
  true, NOW(), NOW()
);
INSERT INTO employees (id, name, gender, phone, address, start_date, picture_url, description, active, created_at, updated_at)
VALUES (
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  'Chan Sreyneang (ចាន់ ស្រីនាង)',
  'F',
  '089556677',
  'Sangkat Boeung Keng Kang 3, Khan BKK, Phnom Penh',
  '2023-08-01',
  '',
  'Senior Sales Executive & Garment Factory Key Accounts Manager.',
  true, NOW(), NOW()
);
INSERT INTO employees (id, name, gender, phone, address, start_date, picture_url, description, active, created_at, updated_at)
VALUES (
  '1e2f1155-b3bb-4397-851f-fa4cd7994f10',
  'Keo Rithy (កែវ រិទ្ធី)',
  'M',
  '070223344',
  'Sangkat Kakab, Khan Pur Senchey, Phnom Penh',
  '2024-02-15',
  '',
  'Logistics, Machine Delivery & On-Site Assembly Specialist.',
  true, NOW(), NOW()
);
INSERT INTO employees (id, name, gender, phone, address, start_date, picture_url, description, active, created_at, updated_at)
VALUES (
  'b66a9253-a14a-40dc-9c82-f618a27c1be9',
  'Ouk Sophea (អ៊ុក សុភា)',
  'F',
  '011889900',
  'Sangkat Toul Svay Prey, Khan Boeng Keng Kang, Phnom Penh',
  '2023-02-01',
  '',
  'Senior Billing Accountant & Cashier. Handles customer invoices, vendor disbursements, and banking.',
  true, NOW(), NOW()
);
INSERT INTO employees (id, name, gender, phone, address, start_date, picture_url, description, active, created_at, updated_at)
VALUES (
  '6cab446a-e7ab-42eb-a45b-c814a0976505',
  'Ly Kimhong (លី គីមហុង)',
  'M',
  '096443322',
  'Sangkat Dangkao, Khan Dangkao, Phnom Penh',
  '2024-05-10',
  '',
  'Junior Maintenance Mechanic. Assembles table stands, motors, and tests bobbin winders.',
  true, NOW(), NOW()
);
INSERT INTO employees (id, name, gender, phone, address, start_date, picture_url, description, active, created_at, updated_at)
VALUES (
  '17c5533a-9927-41db-a092-e4e4bc42b356',
  'Pen Bopha (ប៉ែន បុប្ផា)',
  'F',
  '078998877',
  'Sangkat Chroy Changvar, Khan Chroy Changvar, Phnom Penh',
  '2024-07-01',
  '',
  'Inventory Audit & Data Entry Clerk. Barcode scanning and customer order dispatch.',
  true, NOW(), NOW()
);
INSERT INTO expense_categories (exp_id, exp_name, exp_description)
VALUES (1, 'Facility Rent & Warehouse Lease (ថ្លៃជួលឃ្លាំង និងការិយាល័យ)', 'Warehouse facility and showroom lease payments')
ON CONFLICT (exp_id) DO NOTHING;
INSERT INTO expense_categories (exp_id, exp_name, exp_description)
VALUES (2, 'Electricity & Utilities (ថ្លៃអគ្គិសនី និងទឹកស្អាត)', 'Electricite du Cambodge (EDC) and municipal water supply bills')
ON CONFLICT (exp_id) DO NOTHING;
INSERT INTO expense_categories (exp_id, exp_name, exp_description)
VALUES (3, 'Technician & Staff Salaries (ប្រាក់ខែបុគ្គលិក និងជាង)', 'Monthly payroll for warehouse technicians, mechanics, and sales staff')
ON CONFLICT (exp_id) DO NOTHING;
INSERT INTO expense_categories (exp_id, exp_name, exp_description)
VALUES (4, 'Logistics, Fuel & Delivery (ថ្លៃដឹកជញ្ជូន សាំង និងដំឡើង)', 'Delivery truck fuel, expressway tolls, and machinery transport')
ON CONFLICT (exp_id) DO NOTHING;
INSERT INTO expense_categories (exp_id, exp_name, exp_description)
VALUES (5, 'Machine Maintenance, Tools & Testing (ថ្លៃថែទាំ ឧបករណ៍ជាង)', 'Air compressor maintenance, technician toolsets, test fabric, and calibration gear')
ON CONFLICT (exp_id) DO NOTHING;
INSERT INTO expense_categories (exp_id, exp_name, exp_description)
VALUES (6, 'Marketing, Showroom & Promotion (ការផ្សព្វផ្សាយ និងតាំងបង្ហាញ)', 'Digital advertising, trade fair displays, catalogs, and customer promotions')
ON CONFLICT (exp_id) DO NOTHING;
INSERT INTO expense_categories (exp_id, exp_name, exp_description)
VALUES (7, 'Telecommunications & High-Speed Internet (ថ្លៃទូរស័ព្ទ និងអ៊ីនធឺណិត)', 'Fiber optic internet, corporate mobile plans, and cloud backup subscriptions')
ON CONFLICT (exp_id) DO NOTHING;
INSERT INTO expense_categories (exp_id, exp_name, exp_description)
VALUES (8, 'Packaging, Pallets & Warehouse Supplies (សម្ភារៈវេចខ្ចប់ និងកេស)', 'Wooden pallets, plastic shrink wrap film, strapping tape, and shipping boxes')
ON CONFLICT (exp_id) DO NOTHING;
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '9e8545b2-33be-4da6-b8f3-c1b83915b949',
  '2026-07-05 10:00:00',
  1,
  1800,
  'EXP-2026-0701',
  'July Warehouse & Office Lease (Pur Senchey)',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  'df5a2dde-9f4b-4e41-9c7c-b898e6fb5781',
  '2026-07-10 14:30:00',
  2,
  465.5,
  'EXP-2026-0702',
  'EDC Electricity bill for main showroom & warehouse',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '5456ef24-eade-4b08-ba82-c3e227fa0871',
  '2026-07-28 16:00:00',
  4,
  140,
  'EXP-2026-0703',
  'Diesel fuel for delivery truck & toll fees (Bavet SEZ run)',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '04e7e002-0818-4c1f-9ea5-5e3b5d2aebfe',
  '2026-07-31 17:00:00',
  3,
  3200,
  'EXP-2026-0704',
  'July Staff & Technician Salaries Payroll',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '439fd404-937f-4284-aed6-502e35d94e0a',
  '2026-08-05 09:30:00',
  1,
  1800,
  'EXP-2026-0801',
  'August Warehouse Lease payment',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '1d5c0231-5a9c-4ff0-9bf0-2fc8aa99def7',
  '2026-08-11 11:15:00',
  2,
  480,
  'EXP-2026-0802',
  'EDC Electricity bill - August',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  'a103db18-e5df-4fbc-8aec-9a3b385b4837',
  '2026-08-15 15:45:00',
  5,
  260,
  'EXP-2026-0803',
  'Rotary air compressor service & pneumatic testing tools',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '54819614-bd88-4138-b94d-5200b67744ec',
  '2026-08-18 10:00:00',
  7,
  85,
  'EXP-2026-0804',
  'High-speed business fiber optic internet',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  'f7a85194-28d1-48ba-80de-ae74c7c44cab',
  '2026-08-22 14:00:00',
  8,
  165,
  'EXP-2026-0805',
  'Wooden pallets & heavy-duty stretch film wrap',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '5410e91e-06e9-423a-8674-0a4a0035d4b8',
  '2026-08-31 17:00:00',
  3,
  3200,
  'EXP-2026-0806',
  'August Staff & Technician Salaries Payroll',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '17a0689d-2815-4d6f-986c-09745121014f',
  '2026-09-05 09:00:00',
  1,
  1800,
  'EXP-2026-0901',
  'September Warehouse Lease payment',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '63678744-dc1b-4758-bb8c-4b63e4608668',
  '2026-09-08 13:20:00',
  6,
  350,
  'EXP-2026-0902',
  'Facebook digital ads & garment machinery catalog printing',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '293addd4-5c58-44e0-80be-c9ed548942fa',
  '2026-09-12 11:30:00',
  2,
  512.8,
  'EXP-2026-0903',
  'EDC Electricity bill - September',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  'fde88a8e-cf07-491c-bdb9-ad9fc764046b',
  '2026-09-16 16:10:00',
  4,
  185,
  'EXP-2026-0904',
  'Delivery truck fuel & National Road 4 tolls (Kampong Speu drops)',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '60102cdd-68b7-42a8-b1f8-6e470f5dc0b8',
  '2026-09-21 14:00:00',
  5,
  195,
  'EXP-2026-0905',
  'Technician multimeter, needle gauge sets & test fabric roll',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  'ee755174-2629-45c2-add1-35c8ef88df0f',
  '2026-09-25 15:30:00',
  7,
  85,
  'EXP-2026-0906',
  'September fiber optic internet bill',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '329c3d5a-63d7-45e0-b64d-9bbef19da614',
  '2026-09-28 11:00:00',
  8,
  140,
  'EXP-2026-0907',
  'Custom cardboard carton boxes for sewing accessories',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '2ffd603e-18b4-4703-86da-a326cde074af',
  '2026-09-30 17:00:00',
  3,
  3200,
  'EXP-2026-0908',
  'September Staff & Technician Salaries Payroll',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '3901af4b-cf96-4274-a841-95f08e13aa19',
  '2026-10-01 08:30:00',
  1,
  1800,
  'EXP-2026-1001',
  'October Warehouse & Showroom Lease',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  '0581833b-ae81-4019-88cb-8957347852ef',
  '2026-10-01 10:45:00',
  4,
  120,
  'EXP-2026-1002',
  'Delivery fuel allowance for today factory dispatches',
  'PAID',
  1, 1.0
);
INSERT INTO expenses (uuid, ex_date, ex_exp_id, ex_amount, ex_ref_no, ex_description, ex_status, ex_account_code, ex_exchange_rate)
VALUES (
  'e73bb72f-e584-41d6-bd9c-33453bdc928d',
  '2026-10-01 13:00:00',
  7,
  85,
  'EXP-2026-1003',
  'October fiber optic internet bill',
  'PAID',
  1, 1.0
);
INSERT INTO purchases (id, reference_code, purchase_date, delivery_date, actual_delivery_date, delivery_status, payment_due_date, supplier_id, user_id, exchange_rate, currency, discount, total_amount, status, note, purchase_uuid, created_at, updated_at)
VALUES (
  'dbd607e6-b62a-4b4c-9f2c-8286e420b601',
  'PO-2026-0715',
  '2026-07-15',
  '2026-07-15',
  '2026-07-15',
  'RECEIVED',
  '2026-07-15',
  '46c3bc60-f640-49e1-8d22-fb43f5ab7c9b',
  'b04b95c5-a1ec-44dc-99b3-470b724d403b',
  1.0, 'USD', 0,
  4436,
  'RECEIVED',
  'Initial Q3 Siruba consignment with factory spare knife blades.',
  'dbd607e6-b62a-4b4c-9f2c-8286e420b601',
  '2026-07-15 09:00:00', '2026-07-15 16:00:00'
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '5aeebf4b-5863-4725-8444-ac7a41dca4d9',
  'dbd607e6-b62a-4b4c-9f2c-8286e420b601',
  'dc4336dc-fd35-40fb-b3a2-d52e11da38cb',
  'Siruba 747K 4-Thread Overlock',
  5,
  5,
  5,
  460,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '0d0a6648-4af5-4e09-a98d-410dc8a9951b',
  'dbd607e6-b62a-4b4c-9f2c-8286e420b601',
  'a3b04188-b97c-45ca-83ec-8564e5818072',
  'Siruba C007K Flatbed Interlock / Coverstitch',
  3,
  3,
  3,
  670,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '84c69cf9-9fa3-4125-8491-7d51f2ad597f',
  'dbd607e6-b62a-4b4c-9f2c-8286e420b601',
  'd4555eaa-da57-41c2-a527-d1d1de57eb1b',
  'Siruba 747K Upper & Lower Carbide Knife Blades Set',
  30,
  30,
  30,
  4.2,
  0
);
INSERT INTO purchases (id, reference_code, purchase_date, delivery_date, actual_delivery_date, delivery_status, payment_due_date, supplier_id, user_id, exchange_rate, currency, discount, total_amount, status, note, purchase_uuid, created_at, updated_at)
VALUES (
  '4d8e31d3-85e2-4b36-8920-c88d5bf1bc93',
  'PO-2026-0802',
  '2026-08-02',
  '2026-08-02',
  '2026-08-02',
  'RECEIVED',
  '2026-08-02',
  'fcc6c1c6-2a5c-456f-986a-d1eb1f3dfc8d',
  'b04b95c5-a1ec-44dc-99b3-470b724d403b',
  1.0, 'USD', 0,
  10090,
  'RECEIVED',
  'Direct container shipment from Jack Taizhou factory. Complete set with servo motors.',
  '4d8e31d3-85e2-4b36-8920-c88d5bf1bc93',
  '2026-08-02 09:00:00', '2026-08-02 16:00:00'
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'c9a2d8a7-c6bd-45ae-955b-c1f5dc6b844c',
  '4d8e31d3-85e2-4b36-8920-c88d5bf1bc93',
  'f42fdb63-903a-45b9-bdd7-e4659f5ff750',
  'Jack F4 Direct-Drive Lockstitch',
  10,
  10,
  10,
  250,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '5e6e4bb9-516c-498e-9499-5f6ad7696b74',
  '4d8e31d3-85e2-4b36-8920-c88d5bf1bc93',
  '8442c6ac-e64e-48c9-ae54-69388e7d35a7',
  'Jack A4B Automatic Thread Trimmer Lockstitch',
  8,
  8,
  8,
  330,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'b18110d4-7007-44ff-a9b1-af9bb50254a4',
  '4d8e31d3-85e2-4b36-8920-c88d5bf1bc93',
  '1b319920-46a4-4427-ab37-082c070977bb',
  'Jack E4S 4-Thread Super Energy-Saving Overlock',
  10,
  10,
  10,
  340,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '533e3fb5-0a86-4635-b823-4d71d9b2c2e0',
  '4d8e31d3-85e2-4b36-8920-c88d5bf1bc93',
  '6247a796-c0cb-4892-9928-259c41f90f06',
  'Jack Powermax 550W Energy-Saving Servo Motor',
  25,
  25,
  25,
  62,
  0
);
INSERT INTO purchases (id, reference_code, purchase_date, delivery_date, actual_delivery_date, delivery_status, payment_due_date, supplier_id, user_id, exchange_rate, currency, discount, total_amount, status, note, purchase_uuid, created_at, updated_at)
VALUES (
  '08b66f87-e721-4226-a7b3-e79c67f1f3b0',
  'PO-2026-0818',
  '2026-08-18',
  '2026-08-18',
  '2026-08-18',
  'RECEIVED',
  '2026-08-18',
  'f2f24a6a-910c-4d52-9338-5969cad79f48',
  'b04b95c5-a1ec-44dc-99b3-470b724d403b',
  1.0, 'USD', 0,
  9320,
  'RECEIVED',
  'Authorized Juki heavy walking foot and automated bartacker consignment.',
  '08b66f87-e721-4226-a7b3-e79c67f1f3b0',
  '2026-08-18 09:00:00', '2026-08-18 16:00:00'
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '703c0a3e-32f0-43db-a257-84f02386a8fc',
  '08b66f87-e721-4226-a7b3-e79c67f1f3b0',
  '0a45cc74-e532-4bed-8bec-2f1375b0186e',
  'Juki DDL-8700 Industrial Lockstitch',
  8,
  8,
  8,
  370,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '23abae3b-b034-494e-8d4d-d0d13c6c2cc6',
  '08b66f87-e721-4226-a7b3-e79c67f1f3b0',
  'f9b7dda6-059b-4641-becb-e4f1ef87f572',
  'Juki DNU-1541 Walking Foot Heavy Duty Lockstitch',
  3,
  3,
  3,
  920,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '6985439a-c12a-45ab-b079-b9a68544976b',
  '08b66f87-e721-4226-a7b3-e79c67f1f3b0',
  'c4d6b4b4-c699-46ec-b159-545152cd7944',
  'Juki LK-1900A Electronic Bar-Tacking Machine',
  2,
  2,
  2,
  1800,
  0
);
INSERT INTO purchases (id, reference_code, purchase_date, delivery_date, actual_delivery_date, delivery_status, payment_due_date, supplier_id, user_id, exchange_rate, currency, discount, total_amount, status, note, purchase_uuid, created_at, updated_at)
VALUES (
  'f205414f-c832-4e64-844e-071beb1bb89a',
  'PO-2026-0902',
  '2026-09-02',
  '2026-09-02',
  '2026-09-02',
  'RECEIVED',
  '2026-09-02',
  'd88ac515-ab19-4141-ad48-ac5947d1dfb2',
  'b04b95c5-a1ec-44dc-99b3-470b724d403b',
  1.0, 'USD', 0,
  1129,
  'RECEIVED',
  'Wholesale air-freight spare parts and consumables replenishment from Guangzhou.',
  'f205414f-c832-4e64-844e-071beb1bb89a',
  '2026-09-02 09:00:00', '2026-09-02 16:00:00'
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'be3b9436-2d2a-4069-ad40-6b0ad69b06db',
  'f205414f-c832-4e64-844e-071beb1bb89a',
  'fa3a63bd-3956-4ba9-b669-ed9a05992d16',
  'Organ Sewing Machine Needles DBx1 #14',
  100,
  100,
  100,
  1.7,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '47673ed2-1bb3-4f26-a1e9-84bbcf3ee125',
  'f205414f-c832-4e64-844e-071beb1bb89a',
  '6baf79db-c552-4901-b4f9-e07465aefe95',
  'Organ DPx5 #18 Needles for Heavy Leather & Jeans (Box of 10)',
  120,
  120,
  120,
  2,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '66434903-5ec0-4c3e-8ebd-7bece1fa1c24',
  'f205414f-c832-4e64-844e-071beb1bb89a',
  '30707025-9bda-47d0-b416-ea81b70723f6',
  'Groz-Beckert DCx27 #11 Overlock Needles (Pack of 10)',
  80,
  80,
  80,
  2.3,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '5cf762e6-dac6-4411-ad1e-4356ef57e5d1',
  'f205414f-c832-4e64-844e-071beb1bb89a',
  '42998ae0-fe9b-4f13-9591-9e7095940086',
  'Industrial Rotary Hook Assembly KHS12-S',
  25,
  25,
  25,
  9,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '0f86fc89-b0aa-47da-97dc-17fc27ec3f7b',
  'f205414f-c832-4e64-844e-071beb1bb89a',
  'fd9421c0-393c-40ae-9c94-d60634d8e191',
  'Industrial Steel Bobbins Box (Set of 25 Bobbins)',
  50,
  50,
  50,
  3,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '1fb3a1f3-9534-4646-bf5c-1079ed4516af',
  'f205414f-c832-4e64-844e-071beb1bb89a',
  '2133ff04-44d7-4ba7-be58-3a52aec9cb23',
  'LED Flexible Magnetic Gooseneck Sewing Lamp 30-LED',
  50,
  50,
  50,
  3.2,
  0
);
INSERT INTO purchases (id, reference_code, purchase_date, delivery_date, actual_delivery_date, delivery_status, payment_due_date, supplier_id, user_id, exchange_rate, currency, discount, total_amount, status, note, purchase_uuid, created_at, updated_at)
VALUES (
  '2f52213d-16c3-4200-879e-9e684570ef2c',
  'PO-2026-0915',
  '2026-09-15',
  '2026-09-15',
  '2026-09-15',
  'RECEIVED',
  '2026-09-15',
  '9dea16e4-ad53-4995-90b2-b3fc6d9bc8c7',
  'b04b95c5-a1ec-44dc-99b3-470b724d403b',
  1.0, 'USD', 0,
  2900,
  'RECEIVED',
  'Pressing equipment and desktop fusing press import from Incheon, Korea.',
  '2f52213d-16c3-4200-879e-9e684570ef2c',
  '2026-09-15 09:00:00', '2026-09-15 16:00:00'
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'd6824264-19d2-417a-bfb1-50896f560853',
  '2f52213d-16c3-4200-879e-9e684570ef2c',
  'e34d0459-cfcb-41a4-a099-68dd0fb791f7',
  'Silver Star ES-300 Gravity Feed Industrial Steam Iron Set',
  20,
  20,
  20,
  40,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'b69056df-be3a-428c-a3ed-9bd29b5a9796',
  '2f52213d-16c3-4200-879e-9e684570ef2c',
  '8b8198d8-e37a-4858-8bfe-980d29eaa68d',
  'Hashima HP-450 Compact Desktop Fusing Press',
  2,
  2,
  2,
  1050,
  0
);
INSERT INTO purchases (id, reference_code, purchase_date, delivery_date, actual_delivery_date, delivery_status, payment_due_date, supplier_id, user_id, exchange_rate, currency, discount, total_amount, status, note, purchase_uuid, created_at, updated_at)
VALUES (
  'af089134-f40a-4a07-b395-50764a3de79a',
  'PO-2026-0925',
  '2026-09-25',
  '2026-09-25',
  '2026-09-25',
  'RECEIVED',
  '2026-09-25',
  '74295fd5-99d2-4cea-abb2-20993334d469',
  'b04b95c5-a1ec-44dc-99b3-470b724d403b',
  1.0, 'USD', 0,
  1249,
  'RECEIVED',
  'Local bulk sewing machine white mineral oil and heavy wooden table tops.',
  'af089134-f40a-4a07-b395-50764a3de79a',
  '2026-09-25 09:00:00', '2026-09-25 16:00:00'
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'f3095dc5-1961-4033-85ce-654476e3cca1',
  'af089134-f40a-4a07-b395-50764a3de79a',
  'c58cb55c-7ca2-422b-92d9-b914cb381322',
  'Singer Clear Sewing Machine Oil 1L',
  50,
  50,
  50,
  2.1,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'e328507d-0d74-40f7-9ae0-5d5ae2ec6ad6',
  'af089134-f40a-4a07-b395-50764a3de79a',
  '196e818a-4299-4446-bf35-f8c82a1306d5',
  'Singer Industrial Sewing Lubricant 5L Gallon',
  20,
  20,
  20,
  9.2,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'ab2e952b-e501-4635-bea2-a1179037b299',
  'af089134-f40a-4a07-b395-50764a3de79a',
  'ef8ce3dd-69e1-4d75-95aa-9d529d510ca7',
  'Heavy-Duty Garment Table Top & Adjustable Steel Stand',
  30,
  30,
  30,
  32,
  0
);
INSERT INTO purchases (id, reference_code, purchase_date, delivery_date, actual_delivery_date, delivery_status, payment_due_date, supplier_id, user_id, exchange_rate, currency, discount, total_amount, status, note, purchase_uuid, created_at, updated_at)
VALUES (
  '52d8a126-c8ee-4450-ad39-c2b745da20c2',
  'PO-2026-1001',
  '2026-10-01',
  '2026-10-01',
  '2026-10-01',
  'RECEIVED',
  '2026-10-01',
  'ced3b8a3-4e6d-4551-abd5-865699be74d2',
  'b04b95c5-a1ec-44dc-99b3-470b724d403b',
  1.0, 'USD', 0,
  3190,
  'RECEIVED',
  'October initial Brother stock order for boutique tailoring and domestic line.',
  '52d8a126-c8ee-4450-ad39-c2b745da20c2',
  '2026-10-01 09:00:00', '2026-10-01 16:00:00'
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  '1afe42ac-4bb2-4cc8-bd83-315b6fcf335f',
  '52d8a126-c8ee-4450-ad39-c2b745da20c2',
  '29b14fc5-eb59-403a-aa96-8fcdb37575a8',
  'Brother S-7200C Direct-Drive Lockstitch',
  4,
  4,
  4,
  410,
  0
);
INSERT INTO purchase_items (id, purchase_id, product_id, product_name, quantity, ordered_quantity, received_quantity, unit_cost, discount)
VALUES (
  'e9cff96e-97d5-449c-826f-1e3905e86e76',
  '52d8a126-c8ee-4450-ad39-c2b745da20c2',
  'e83fd365-572b-490c-a66e-71acfd92dc84',
  'Brother Innov-is A80 Domestic Computerized',
  5,
  5,
  5,
  310,
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '3852d4a5-c297-41c3-a58a-f546733abf90',
  'INV-2026-1001',
  '2026-10-01',
  '15c7bf2f-50a3-4407-b119-43880220b35f',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  2025,
  'COMPLETED',
  'Urgent factory line expansion: 6 Jack F4 complete sets with warranty.',
  '3852d4a5-c297-41c3-a58a-f546733abf90',
  true,
  '2026-10-01 09:15:00', '2026-10-01 09:15:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '38cfa147-ba9a-4501-8cef-3352e8ac3260',
  '3852d4a5-c297-41c3-a58a-f546733abf90',
  'f42fdb63-903a-45b9-bdd7-e4659f5ff750',
  'Jack F4 Direct-Drive Lockstitch',
  6,
  340,
  60,
  'SN-JKF4-88410',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'af312725-2375-4abf-9581-784cae0facb1',
  '3852d4a5-c297-41c3-a58a-f546733abf90',
  'c58cb55c-7ca2-422b-92d9-b914cb381322',
  'Singer Clear Sewing Machine Oil 1L',
  10,
  4.5,
  0,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '445882cd-e07e-45ea-8996-79b76d1f0c67',
  'INV-2026-1002',
  '2026-10-01',
  '476ad96b-de50-4879-9994-93f6a084f2c9',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  1945,
  'COMPLETED',
  'Overlock machine dispatch to Bavet SEZ plant with on-site technician installation.',
  '445882cd-e07e-45ea-8996-79b76d1f0c67',
  true,
  '2026-10-01 11:20:00', '2026-10-01 11:20:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '53ea111f-baad-4a2a-b3ab-ef9d688e514a',
  '445882cd-e07e-45ea-8996-79b76d1f0c67',
  '1b319920-46a4-4427-ab37-082c070977bb',
  'Jack E4S 4-Thread Super Energy-Saving Overlock',
  4,
  460,
  40,
  'SN-E4S-44012',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '269c8490-b36b-4d58-b426-09ae5f9ea4f8',
  '445882cd-e07e-45ea-8996-79b76d1f0c67',
  '6baf79db-c552-4901-b4f9-e07465aefe95',
  'Organ DPx5 #18 Needles for Heavy Leather & Jeans (Box of 10)',
  20,
  4,
  5,
  '',
  0
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'aa918c11-76a4-4f35-8084-b7ade58e8407',
  '445882cd-e07e-45ea-8996-79b76d1f0c67',
  '2133ff04-44d7-4ba7-be58-3a52aec9cb23',
  'LED Flexible Magnetic Gooseneck Sewing Lamp 30-LED',
  10,
  7,
  0,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'b9becd52-23be-40eb-bb77-1e67bf637c61',
  'INV-2026-1003',
  '2026-10-01',
  'a395c9c9-cf2d-41f9-b3c1-ec8f31f272bc',
  '35f8a7da-e37f-4e73-9a0f-fd35d83aa067',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  501,
  'COMPLETED',
  'Premium tailoring package for silk gowns: Jack A4B automated lockstitch and Silver Star iron.',
  'b9becd52-23be-40eb-bb77-1e67bf637c61',
  true,
  '2026-10-01 13:45:00', '2026-10-01 13:45:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '13028b43-18c6-4cd3-a81e-7c56c86439a5',
  'b9becd52-23be-40eb-bb77-1e67bf637c61',
  '8442c6ac-e64e-48c9-ae54-69388e7d35a7',
  'Jack A4B Automatic Thread Trimmer Lockstitch',
  1,
  440,
  20,
  'SN-A4B-99210',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '7e90f088-10f0-4f58-8f74-98e995477d05',
  'b9becd52-23be-40eb-bb77-1e67bf637c61',
  'e34d0459-cfcb-41a4-a099-68dd0fb791f7',
  'Silver Star ES-300 Gravity Feed Industrial Steam Iron Set',
  1,
  65,
  0,
  'SN-SS-30219',
  6
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '379c1029-3c4e-46e8-8518-808e82ec0504',
  'b9becd52-23be-40eb-bb77-1e67bf637c61',
  '735146e2-4bd9-42e1-a67b-b959ca6fec77',
  'Industrial Presser Foot 16-Piece Assortment Kit',
  1,
  16,
  0,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'a774de7d-ef8f-4319-8a6a-166533971e5c',
  'INV-2026-1004',
  '2026-10-01',
  '0460d73c-2022-4a17-b23a-91098be1e3d0',
  '17c5533a-9927-41db-a092-e4e4bc42b356',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  41,
  'COMPLETED',
  'Walk-in cash counter sale: needles, rotary hooks, and machine oil.',
  'a774de7d-ef8f-4319-8a6a-166533971e5c',
  true,
  '2026-10-01 15:10:00', '2026-10-01 15:10:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '64b9806b-9e47-4a4b-93c1-a1314ba1e259',
  'a774de7d-ef8f-4319-8a6a-166533971e5c',
  'fa3a63bd-3956-4ba9-b669-ed9a05992d16',
  'Organ Sewing Machine Needles DBx1 #14',
  4,
  3.5,
  0,
  '',
  0
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'c1cf91a8-55bb-4ed3-9715-234c27a3f420',
  'a774de7d-ef8f-4319-8a6a-166533971e5c',
  'c58cb55c-7ca2-422b-92d9-b914cb381322',
  'Singer Clear Sewing Machine Oil 1L',
  2,
  4.5,
  0,
  '',
  0
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'e4e4fade-7bc4-4bf1-a310-1c5281dcabbc',
  'a774de7d-ef8f-4319-8a6a-166533971e5c',
  '42998ae0-fe9b-4f13-9591-9e7095940086',
  'Industrial Rotary Hook Assembly KHS12-S',
  1,
  18,
  0,
  'SN-HK-8812',
  3
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'd64d2e68-1a26-4855-986a-44708c8b5b12',
  'INV-2026-0928',
  '2026-09-28',
  '674e63e3-3328-4cd9-8c5d-80003ab0d33f',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  3420,
  'COMPLETED',
  'Heavy walking foot leather & denim machines for workwear production line.',
  'd64d2e68-1a26-4855-986a-44708c8b5b12',
  true,
  '2026-09-28 10:30:00', '2026-09-28 10:30:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '0c1cdecc-2b8b-4589-b114-dfa1673bc966',
  'd64d2e68-1a26-4855-986a-44708c8b5b12',
  'f9b7dda6-059b-4641-becb-e4f1ef87f572',
  'Juki DNU-1541 Walking Foot Heavy Duty Lockstitch',
  2,
  1250,
  100,
  'SN-1541-1029',
  24
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '8facf8f6-0444-4de7-bc93-f6a61da0d9b5',
  'd64d2e68-1a26-4855-986a-44708c8b5b12',
  '8b524e02-e4ce-485b-82ca-a36aa925b29c',
  'Typical GC6-7 Heavy Duty Walking Foot Machine',
  2,
  530,
  40,
  'SN-GC67-4401',
  12
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '08066a8e-1128-46ad-86a4-1e6c0b17d523',
  'INV-2026-0926',
  '2026-09-26',
  'ce2b544e-3f7e-449d-be17-39df80c85691',
  '35f8a7da-e37f-4e73-9a0f-fd35d83aa067',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  1410,
  'COMPLETED',
  'Computerized lockstitch upgrade with table and servo motor.',
  '08066a8e-1128-46ad-86a4-1e6c0b17d523',
  true,
  '2026-09-26 14:20:00', '2026-09-26 14:20:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '4121aa07-2171-4e63-8407-d32ed70c256b',
  '08066a8e-1128-46ad-86a4-1e6c0b17d523',
  '8442c6ac-e64e-48c9-ae54-69388e7d35a7',
  'Jack A4B Automatic Thread Trimmer Lockstitch',
  2,
  440,
  30,
  'SN-A4B-33109',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'f5bcb7f0-ea3c-4e01-886f-499c70722732',
  '08066a8e-1128-46ad-86a4-1e6c0b17d523',
  'dc4336dc-fd35-40fb-b3a2-d52e11da38cb',
  'Siruba 747K 4-Thread Overlock',
  1,
  580,
  20,
  'SN-SR747-8812',
  12
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '3f3522d2-118a-437f-ba62-b5b9c6f8748c',
  'INV-2026-0924',
  '2026-09-24',
  '086771a4-ae9a-4944-9c2f-c00cd51eeac7',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  2150,
  'COMPLETED',
  'Major cutting department replenishment: Eastman 8" straight knife cutters and spare blades.',
  '3f3522d2-118a-437f-ba62-b5b9c6f8748c',
  false,
  '2026-09-24 11:00:00', '2026-09-24 11:00:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '9a59f3e9-5003-4b37-b3f7-ff80460b4b71',
  '3f3522d2-118a-437f-ba62-b5b9c6f8748c',
  '1151d26f-f436-4efa-a653-9e05969cd02d',
  'Eastman Blue Streak II 8-inch Cloth Cutting Machine',
  3,
  680,
  60,
  'SN-EM8-7712',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '167598b9-fb3f-4d33-8119-6018a9aa6cf6',
  '3f3522d2-118a-437f-ba62-b5b9c6f8748c',
  '05df5ef1-ba01-4ca4-b85c-13d4edaacb01',
  'Lejiang YJ-65 Octagonal Mini Rotary Fabric Cutter',
  4,
  45,
  10,
  'SN-LJ-3391',
  6
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '85d45530-a6bd-4100-abcc-6c0a24cb6619',
  'INV-2026-0922',
  '2026-09-22',
  '1e8d5bdf-3ef1-4f74-838d-1e38cab2d802',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  2480,
  'COMPLETED',
  'Interlock hemming setup for knitted sportswear t-shirt contract.',
  '85d45530-a6bd-4100-abcc-6c0a24cb6619',
  true,
  '2026-09-22 15:30:00', '2026-09-22 15:30:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'a0769b8a-8d13-4b8f-81d8-bbded0d41fa4',
  '85d45530-a6bd-4100-abcc-6c0a24cb6619',
  'a3b04188-b97c-45ca-83ec-8564e5818072',
  'Siruba C007K Flatbed Interlock / Coverstitch',
  2,
  850,
  80,
  'SN-C007-9912',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '1772b655-ac14-4dfe-ac8f-4205581ebb2a',
  '85d45530-a6bd-4100-abcc-6c0a24cb6619',
  '8baf9c31-d058-4a5a-b0bf-5b6a4b7193ea',
  'Jack W4 Cylinder-Bed Interlock Machine',
  1,
  780,
  30,
  'SN-JKW4-5512',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '000199ce-220d-48fe-89af-6429cd97eda3',
  '85d45530-a6bd-4100-abcc-6c0a24cb6619',
  '30707025-9bda-47d0-b416-ea81b70723f6',
  'Groz-Beckert DCx27 #11 Overlock Needles (Pack of 10)',
  25,
  4.8,
  10,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'bd34885a-49ee-434c-b236-6c3ef5835578',
  'INV-2026-0920',
  '2026-09-20',
  'feb58a49-5d80-4ced-84c4-ae26ab4d81ce',
  'd3c07a20-2810-440c-8536-6a461b834369',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  2060,
  'COMPLETED',
  'Electronic buttonhole machine installation with operator training.',
  'bd34885a-49ee-434c-b236-6c3ef5835578',
  true,
  '2026-09-20 09:45:00', '2026-09-20 09:45:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'cac8fbb0-d9a7-472e-9091-01eec51c3ace',
  'bd34885a-49ee-434c-b236-6c3ef5835578',
  '3f5a3b40-06c6-4731-a378-72e7acee289b',
  'Jack JK-T1790 Electronic Buttonholing Machine',
  1,
  2150,
  150,
  'SN-1790-2021',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '293a9a05-a9a7-4a7d-97ec-dbbed80dc4d3',
  'bd34885a-49ee-434c-b236-6c3ef5835578',
  '6baf79db-c552-4901-b4f9-e07465aefe95',
  'Organ DPx5 #18 Needles for Heavy Leather & Jeans (Box of 10)',
  15,
  4,
  0,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '980ed236-9d97-44c4-bb2e-f90289d25425',
  'INV-2026-0918',
  '2026-09-18',
  '896672a8-9727-42d0-a412-3d44363da009',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  1510,
  'COMPLETED',
  'Workwear stitching batch: 4 Singer 191D lockstitch complete sets.',
  '980ed236-9d97-44c4-bb2e-f90289d25425',
  true,
  '2026-09-18 16:00:00', '2026-09-18 16:00:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '273571df-a0ca-42c6-917b-bf9ff2203668',
  '980ed236-9d97-44c4-bb2e-f90289d25425',
  'cfb635d6-02ac-4ec5-a707-b841aa0a4eb0',
  'Singer 191D High-Speed Industrial Lockstitch',
  4,
  360,
  60,
  'SN-191D-8821',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '0286fed0-407d-4aa3-94d1-ef044f17d415',
  '980ed236-9d97-44c4-bb2e-f90289d25425',
  'e34d0459-cfcb-41a4-a099-68dd0fb791f7',
  'Silver Star ES-300 Gravity Feed Industrial Steam Iron Set',
  2,
  65,
  0,
  'SN-SS-5519',
  6
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'd144dfc3-6db6-4829-80c5-23082377720e',
  'INV-2026-0915',
  '2026-09-15',
  'e855d3d3-9d3f-4e40-8184-68608d1b696c',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  1870,
  'COMPLETED',
  'Serviced Japan used lockstitch machines with 6-month store warranty.',
  'd144dfc3-6db6-4829-80c5-23082377720e',
  true,
  '2026-09-15 13:15:00', '2026-09-15 13:15:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'ce45bcb2-ec78-46f8-80b1-c96cf8e62821',
  'd144dfc3-6db6-4829-80c5-23082377720e',
  'dba46412-7350-43f9-8c64-010b1fc87c00',
  'Juki DDL-8700 (Used Japan / មួយទឹក)',
  5,
  260,
  50,
  'SN-JK87-U991',
  6
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '03092056-7362-43fa-84ab-12142c3db970',
  'd144dfc3-6db6-4829-80c5-23082377720e',
  'c02a02c1-7ff1-4808-ab3e-5d5c8e2ca14e',
  'Siruba 747K (Used / មួយទឹក)',
  2,
  320,
  20,
  'SN-SR74-U332',
  6
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '224d4d00-77e9-429b-b492-9e6e3bb24037',
  'INV-2026-0912',
  '2026-09-12',
  'c3c6c355-ccd9-415d-a01b-016e625fe670',
  '35f8a7da-e37f-4e73-9a0f-fd35d83aa067',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  868.5,
  'COMPLETED',
  'Fine silk tailoring equipment: Brother computerized machine and delicate needles.',
  '224d4d00-77e9-429b-b492-9e6e3bb24037',
  true,
  '2026-09-12 10:00:00', '2026-09-12 10:00:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'f811eb02-edb9-4158-82b3-4dc1040d09d4',
  '224d4d00-77e9-429b-b492-9e6e3bb24037',
  'e83fd365-572b-490c-a66e-71acfd92dc84',
  'Brother Innov-is A80 Domestic Computerized',
  2,
  420,
  20,
  'SN-BR-A80-112',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'fe9f6a1e-0a33-4ea0-9704-534e372e30a2',
  '224d4d00-77e9-429b-b492-9e6e3bb24037',
  'fa3a63bd-3956-4ba9-b669-ed9a05992d16',
  'Organ Sewing Machine Needles DBx1 #14',
  10,
  3.5,
  0,
  '',
  0
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '68ac1f83-9d36-483b-ae7a-eced3235e21a',
  '224d4d00-77e9-429b-b492-9e6e3bb24037',
  'c58cb55c-7ca2-422b-92d9-b914cb381322',
  'Singer Clear Sewing Machine Oil 1L',
  3,
  4.5,
  0,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'cc2f97fd-83e2-4b87-aa8f-6a27030f922c',
  'INV-2026-0910',
  '2026-09-10',
  '6be1893c-643e-4fb7-a0b2-6a23fbd767e3',
  'd3c07a20-2810-440c-8536-6a461b834369',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  757,
  'COMPLETED',
  'Suit making equipment: Jack direct drive machine and pressing iron.',
  'cc2f97fd-83e2-4b87-aa8f-6a27030f922c',
  true,
  '2026-09-10 14:45:00', '2026-09-10 14:45:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'b383b7eb-d0d4-485c-8dee-8050793eeaac',
  'cc2f97fd-83e2-4b87-aa8f-6a27030f922c',
  'f42fdb63-903a-45b9-bdd7-e4659f5ff750',
  'Jack F4 Direct-Drive Lockstitch',
  2,
  340,
  20,
  'SN-JKF4-1189',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '68105d1c-f38a-4c14-8432-f042664f569f',
  'cc2f97fd-83e2-4b87-aa8f-6a27030f922c',
  'e34d0459-cfcb-41a4-a099-68dd0fb791f7',
  'Silver Star ES-300 Gravity Feed Industrial Steam Iron Set',
  1,
  65,
  0,
  'SN-SS-7712',
  6
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '220b1e04-8cca-4f82-affc-42491fb871ec',
  'cc2f97fd-83e2-4b87-aa8f-6a27030f922c',
  '735146e2-4bd9-42e1-a67b-b959ca6fec77',
  'Industrial Presser Foot 16-Piece Assortment Kit',
  2,
  16,
  0,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'b8826a86-0042-4f0b-9be4-e999c5eeb29a',
  'INV-2026-0908',
  '2026-09-08',
  '6da29298-f3e5-41ae-9ee8-a8e31c34ea84',
  '17c5533a-9927-41db-a092-e4e4bc42b356',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  670,
  'COMPLETED',
  'Jeans alteration setup: refurbished Juki walking foot machine.',
  'b8826a86-0042-4f0b-9be4-e999c5eeb29a',
  true,
  '2026-09-08 11:30:00', '2026-09-08 11:30:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'b7ed22ed-2de9-423b-97fd-fbdf352b9568',
  'b8826a86-0042-4f0b-9be4-e999c5eeb29a',
  '0ce48f7a-e773-48af-ab1c-cdb987c6cf78',
  'Juki DNU-1541 (Refurbished Japan / កែច្នៃ)',
  1,
  680,
  30,
  'SN-1541-R881',
  6
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'ec85ca2f-3c72-4756-ac2b-91a11089fec2',
  'b8826a86-0042-4f0b-9be4-e999c5eeb29a',
  '6baf79db-c552-4901-b4f9-e07465aefe95',
  'Organ DPx5 #18 Needles for Heavy Leather & Jeans (Box of 10)',
  5,
  4,
  0,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'f2545604-e25a-4fb2-bafe-2ccab8fedbea',
  'INV-2026-0905',
  '2026-09-05',
  'c9fb83c5-eca3-497c-be50-2754044ee331',
  '35f8a7da-e37f-4e73-9a0f-fd35d83aa067',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  448,
  'COMPLETED',
  'Curtain workshop equipment: vintage Juki lockstitch and LED lights.',
  'f2545604-e25a-4fb2-bafe-2ccab8fedbea',
  true,
  '2026-09-05 15:20:00', '2026-09-05 15:20:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '66c9fb6d-f919-45dd-8066-fa558e9dd202',
  'f2545604-e25a-4fb2-bafe-2ccab8fedbea',
  '86445838-1e43-4edc-a91b-8e4f5a065c40',
  'Juki DDL-5550 (Used Japan / មួយទឹក)',
  2,
  220,
  20,
  'SN-5550-9921',
  6
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '81ab1677-f9c1-40d1-a3ad-295938365545',
  'f2545604-e25a-4fb2-bafe-2ccab8fedbea',
  '2133ff04-44d7-4ba7-be58-3a52aec9cb23',
  'LED Flexible Magnetic Gooseneck Sewing Lamp 30-LED',
  4,
  7,
  0,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  'bd70f889-3570-4d5a-aec0-7d56135fc4df',
  'INV-2026-0902',
  '2026-09-02',
  '15c7bf2f-50a3-4407-b119-43880220b35f',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  2750,
  'COMPLETED',
  'Factory floor replenishment: Juki DDL-8700 brand new complete workstations.',
  'bd70f889-3570-4d5a-aec0-7d56135fc4df',
  true,
  '2026-09-02 09:30:00', '2026-09-02 09:30:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '49233102-bd08-4ad4-a018-7079fb4235c8',
  'bd70f889-3570-4d5a-aec0-7d56135fc4df',
  '0a45cc74-e532-4bed-8bec-2f1375b0186e',
  'Juki DDL-8700 Industrial Lockstitch',
  5,
  480,
  100,
  'SN-8700-4491',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '114477e5-1527-45b8-b67a-78bb51d8731c',
  'bd70f889-3570-4d5a-aec0-7d56135fc4df',
  '6247a796-c0cb-4892-9928-259c41f90f06',
  'Jack Powermax 550W Energy-Saving Servo Motor',
  5,
  95,
  25,
  'SN-SM55-1102',
  12
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '392495f6-14fc-414f-8fec-d37182332a90',
  'INV-2026-0828',
  '2026-08-28',
  '476ad96b-de50-4879-9994-93f6a084f2c9',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  2369,
  'COMPLETED',
  'Export polo shirt line: Siruba 4-thread overlock and needles.',
  '392495f6-14fc-414f-8fec-d37182332a90',
  true,
  '2026-08-28 11:00:00', '2026-08-28 11:00:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '3141dbfb-6b80-463f-97f6-251caf86c99e',
  '392495f6-14fc-414f-8fec-d37182332a90',
  'dc4336dc-fd35-40fb-b3a2-d52e11da38cb',
  'Siruba 747K 4-Thread Overlock',
  4,
  580,
  80,
  'SN-SR747-5510',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '76044fc8-c2b5-488c-8ac3-2b174772ed60',
  '392495f6-14fc-414f-8fec-d37182332a90',
  '30707025-9bda-47d0-b416-ea81b70723f6',
  'Groz-Beckert DCx27 #11 Overlock Needles (Pack of 10)',
  30,
  4.8,
  15,
  '',
  0
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '4df0c6a4-eadf-41eb-a502-62b4d2260cb9',
  'INV-2026-0822',
  '2026-08-22',
  '674e63e3-3328-4cd9-8c5d-80003ab0d33f',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  2250,
  'COMPLETED',
  'Belt loop and pocket reinforcement: Juki electronic bar-tacker.',
  '4df0c6a4-eadf-41eb-a502-62b4d2260cb9',
  true,
  '2026-08-22 14:15:00', '2026-08-22 14:15:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '2eef1536-7bf8-4e16-9ffd-e0d023dc3a83',
  '4df0c6a4-eadf-41eb-a502-62b4d2260cb9',
  'c4d6b4b4-c699-46ec-b159-545152cd7944',
  'Juki LK-1900A Electronic Bar-Tacking Machine',
  1,
  2400,
  150,
  'SN-1900-3321',
  12
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '36a397a2-208c-4997-bcd9-b2f7ebe5cb9a',
  'INV-2026-0815',
  '2026-08-15',
  'ce2b544e-3f7e-449d-be17-39df80c85691',
  '35f8a7da-e37f-4e73-9a0f-fd35d83aa067',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  680,
  'COMPLETED',
  'Fusing press and cloth cutter for boutique dressmaking shop.',
  '36a397a2-208c-4997-bcd9-b2f7ebe5cb9a',
  true,
  '2026-08-15 10:30:00', '2026-08-15 10:30:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '9b8b63ae-0efe-430a-bc7c-8ba871ea7409',
  '36a397a2-208c-4997-bcd9-b2f7ebe5cb9a',
  '67c30839-765b-490b-a611-ea8cf9764d87',
  'KM KS-EU 8-inch Vertical Cloth Cutting Machine',
  1,
  580,
  30,
  'SN-KM8-4491',
  12
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  '5cbb5350-e492-4234-9dde-6498e49e381d',
  '36a397a2-208c-4997-bcd9-b2f7ebe5cb9a',
  'e34d0459-cfcb-41a4-a099-68dd0fb791f7',
  'Silver Star ES-300 Gravity Feed Industrial Steam Iron Set',
  2,
  65,
  0,
  'SN-SS-1182',
  6
);
INSERT INTO sales (id, invoice_code, sale_date, customer_id, employee_id, user_id, exchange_rate, currency, discount, total_amount, status, note, sale_uuid, paid, created_at, updated_at)
VALUES (
  '799c9619-9213-4b3a-b682-597303d180d4',
  'INV-2026-0808',
  '2026-08-08',
  '086771a4-ae9a-4944-9c2f-c00cd51eeac7',
  'c11b48d9-3ac3-480e-af11-e4e9439df2f7',
  '4e7006d4-94cc-4dfd-a67c-16f93103bafe',
  1.0, 'USD', 0,
  270,
  'COMPLETED',
  'Bulk industrial oil and spare bobbin boxes for factory maintenance division.',
  '799c9619-9213-4b3a-b682-597303d180d4',
  true,
  '2026-08-08 15:00:00', '2026-08-08 15:00:00'
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'd8269a2a-162b-4c9b-9a47-b0351503ce79',
  '799c9619-9213-4b3a-b682-597303d180d4',
  '196e818a-4299-4446-bf35-f8c82a1306d5',
  'Singer Industrial Sewing Lubricant 5L Gallon',
  10,
  16.5,
  15,
  '',
  0
);
INSERT INTO sale_items (id, sale_id, product_id, product_name, quantity, unit_price, discount, serial_number, warranty_months)
VALUES (
  'ac68ed9f-5855-4480-ba5b-28e6b283bc24',
  '799c9619-9213-4b3a-b682-597303d180d4',
  'fd9421c0-393c-40ae-9c94-d60634d8e191',
  'Industrial Steel Bobbins Box (Set of 25 Bobbins)',
  20,
  6.5,
  10,
  '',
  0
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '98e71474-8703-4bd9-b325-149413a7d08d',
  'SALE',
  '3852d4a5-c297-41c3-a58a-f546733abf90',
  2025,
  'BANK_TRANSFER',
  '2026-10-01',
  'USD', 1.0,
  'Full payment settled for INV-2026-1001 via BANK_TRANSFER',
  '2026-10-01 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '54fa28ad-eb54-4288-9ebd-4c0d6298ee37',
  'SALE',
  '445882cd-e07e-45ea-8996-79b76d1f0c67',
  1945,
  'BANK_TRANSFER',
  '2026-10-01',
  'USD', 1.0,
  'Full payment settled for INV-2026-1002 via BANK_TRANSFER',
  '2026-10-01 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'a5ccb957-a26e-4e62-bb0e-b5b4cf4cc0a7',
  'SALE',
  'b9becd52-23be-40eb-bb77-1e67bf637c61',
  501,
  'ABA_KHQR',
  '2026-10-01',
  'USD', 1.0,
  'Full payment settled for INV-2026-1003 via ABA_KHQR',
  '2026-10-01 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '387e52ab-ae3a-4f36-93fc-3316d251aa0c',
  'SALE',
  'a774de7d-ef8f-4319-8a6a-166533971e5c',
  41,
  'CASH',
  '2026-10-01',
  'USD', 1.0,
  'Full payment settled for INV-2026-1004 via CASH',
  '2026-10-01 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '29b879be-dbbc-49aa-89ea-2f56cf5a4041',
  'SALE',
  'd64d2e68-1a26-4855-986a-44708c8b5b12',
  3420,
  'BANK_TRANSFER',
  '2026-09-28',
  'USD', 1.0,
  'Full payment settled for INV-2026-0928 via BANK_TRANSFER',
  '2026-09-28 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '0f09375b-6fcd-4146-b52b-2d75f6418138',
  'SALE',
  '08066a8e-1128-46ad-86a4-1e6c0b17d523',
  1410,
  'BANK_TRANSFER',
  '2026-09-26',
  'USD', 1.0,
  'Full payment settled for INV-2026-0926 via BANK_TRANSFER',
  '2026-09-26 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '9ff77c5b-bd61-4b53-96fd-a8cbb4dae7f2',
  'SALE',
  '85d45530-a6bd-4100-abcc-6c0a24cb6619',
  2480,
  'BANK_TRANSFER',
  '2026-09-22',
  'USD', 1.0,
  'Full payment settled for INV-2026-0922 via BANK_TRANSFER',
  '2026-09-22 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'd0f083be-6675-4a6f-8ae9-6dcef32e163a',
  'SALE',
  'bd34885a-49ee-434c-b236-6c3ef5835578',
  2060,
  'BANK_TRANSFER',
  '2026-09-20',
  'USD', 1.0,
  'Full payment settled for INV-2026-0920 via BANK_TRANSFER',
  '2026-09-20 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'cc8150a9-14bc-4fd5-8dc3-376e8d673cfd',
  'SALE',
  '980ed236-9d97-44c4-bb2e-f90289d25425',
  1510,
  'BANK_TRANSFER',
  '2026-09-18',
  'USD', 1.0,
  'Full payment settled for INV-2026-0918 via BANK_TRANSFER',
  '2026-09-18 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '10d7cff0-e5e8-481b-884e-6d81211b6703',
  'SALE',
  'd144dfc3-6db6-4829-80c5-23082377720e',
  1870,
  'BANK_TRANSFER',
  '2026-09-15',
  'USD', 1.0,
  'Full payment settled for INV-2026-0915 via BANK_TRANSFER',
  '2026-09-15 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'f1a3385a-fca5-4bc0-ab75-0dfe6435241d',
  'SALE',
  '224d4d00-77e9-429b-b492-9e6e3bb24037',
  868.5,
  'ABA_KHQR',
  '2026-09-12',
  'USD', 1.0,
  'Full payment settled for INV-2026-0912 via ABA_KHQR',
  '2026-09-12 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '07b1e251-1806-4344-8b66-2d1a9e6b2f67',
  'SALE',
  'cc2f97fd-83e2-4b87-aa8f-6a27030f922c',
  757,
  'ABA_KHQR',
  '2026-09-10',
  'USD', 1.0,
  'Full payment settled for INV-2026-0910 via ABA_KHQR',
  '2026-09-10 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'fa24edbc-c256-4b74-9723-787611ab9128',
  'SALE',
  'b8826a86-0042-4f0b-9be4-e999c5eeb29a',
  670,
  'ABA_KHQR',
  '2026-09-08',
  'USD', 1.0,
  'Full payment settled for INV-2026-0908 via ABA_KHQR',
  '2026-09-08 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '61370069-930a-4bab-8e47-4002b08b2484',
  'SALE',
  'f2545604-e25a-4fb2-bafe-2ccab8fedbea',
  448,
  'ABA_KHQR',
  '2026-09-05',
  'USD', 1.0,
  'Full payment settled for INV-2026-0905 via ABA_KHQR',
  '2026-09-05 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'b72184ca-4d04-4ee1-ae4e-6c72bea83447',
  'SALE',
  'bd70f889-3570-4d5a-aec0-7d56135fc4df',
  2750,
  'BANK_TRANSFER',
  '2026-09-02',
  'USD', 1.0,
  'Full payment settled for INV-2026-0902 via BANK_TRANSFER',
  '2026-09-02 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'd1e9cab3-86b2-41d2-b495-0bdc4d975342',
  'SALE',
  '392495f6-14fc-414f-8fec-d37182332a90',
  2369,
  'BANK_TRANSFER',
  '2026-08-28',
  'USD', 1.0,
  'Full payment settled for INV-2026-0828 via BANK_TRANSFER',
  '2026-08-28 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '847636b2-67a5-441a-aabf-b52072e8ff40',
  'SALE',
  '4df0c6a4-eadf-41eb-a502-62b4d2260cb9',
  2250,
  'BANK_TRANSFER',
  '2026-08-22',
  'USD', 1.0,
  'Full payment settled for INV-2026-0822 via BANK_TRANSFER',
  '2026-08-22 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '80ca86bd-0362-4dcc-9000-3218123ad41b',
  'SALE',
  '36a397a2-208c-4997-bcd9-b2f7ebe5cb9a',
  680,
  'ABA_KHQR',
  '2026-08-15',
  'USD', 1.0,
  'Full payment settled for INV-2026-0815 via ABA_KHQR',
  '2026-08-15 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'd5118810-f22a-4831-abac-98554b948978',
  'SALE',
  '799c9619-9213-4b3a-b682-597303d180d4',
  270,
  'CASH',
  '2026-08-08',
  'USD', 1.0,
  'Full payment settled for INV-2026-0808 via CASH',
  '2026-08-08 16:30:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'a59f7f5c-c74c-4d78-a54f-ef155c2d3d4e',
  'PURCHASE',
  'dbd607e6-b62a-4b4c-9f2c-8286e420b601',
  4436,
  'BANK_TRANSFER',
  '2026-07-15',
  'USD', 1.0,
  'Supplier wire remittance for purchase order PO-2026-0715',
  '2026-07-15 17:00:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '1e08e5a3-d82b-4bfd-953e-d0e55f14d44e',
  'PURCHASE',
  '4d8e31d3-85e2-4b36-8920-c88d5bf1bc93',
  10090,
  'BANK_TRANSFER',
  '2026-08-02',
  'USD', 1.0,
  'Supplier wire remittance for purchase order PO-2026-0802',
  '2026-08-02 17:00:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '1e7bd03d-eec3-4a57-9fc1-f92473d382c6',
  'PURCHASE',
  '08b66f87-e721-4226-a7b3-e79c67f1f3b0',
  9320,
  'BANK_TRANSFER',
  '2026-08-18',
  'USD', 1.0,
  'Supplier wire remittance for purchase order PO-2026-0818',
  '2026-08-18 17:00:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'ffdf9380-6fe0-4b4a-92bb-0921b8757d37',
  'PURCHASE',
  'f205414f-c832-4e64-844e-071beb1bb89a',
  1129,
  'BANK_TRANSFER',
  '2026-09-02',
  'USD', 1.0,
  'Supplier wire remittance for purchase order PO-2026-0902',
  '2026-09-02 17:00:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '3f768583-d194-4400-9ad7-d94d03f78aca',
  'PURCHASE',
  '2f52213d-16c3-4200-879e-9e684570ef2c',
  2900,
  'BANK_TRANSFER',
  '2026-09-15',
  'USD', 1.0,
  'Supplier wire remittance for purchase order PO-2026-0915',
  '2026-09-15 17:00:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  '36769e7b-42cd-4499-a4e4-60ebe42c7a8e',
  'PURCHASE',
  'af089134-f40a-4a07-b395-50764a3de79a',
  1249,
  'BANK_TRANSFER',
  '2026-09-25',
  'USD', 1.0,
  'Supplier wire remittance for purchase order PO-2026-0925',
  '2026-09-25 17:00:00'
);
INSERT INTO payments (id, reference_type, reference_id, amount, payment_method, payment_date, currency, exchange_rate, note, created_at)
VALUES (
  'd9232f25-ff21-4345-b607-65ddfbc0c489',
  'PURCHASE',
  '52d8a126-c8ee-4450-ad39-c2b745da20c2',
  3190,
  'BANK_TRANSFER',
  '2026-10-01',
  'USD', 1.0,
  'Supplier wire remittance for purchase order PO-2026-1001',
  '2026-10-01 17:00:00'
);
INSERT INTO sale_returns (id, sale_id, return_date, reason, total_refund, status, created_at, updated_at)
VALUES (
  'befb4419-7772-4e09-89e8-f3c8c95fc460',
  'b9becd52-23be-40eb-bb77-1e67bf637c61',
  '2026-10-01',
  'Customer exchanged presser foot set for another size; difference refunded.',
  16.00,
  'COMPLETED',
  '2026-10-01 16:00:00', '2026-10-01 16:00:00'
);
INSERT INTO sale_return_items (id, sale_return_id, product_id, product_name, quantity, unit_price)
VALUES (
  'f665a23a-cb1a-408a-a133-e011ec19e46b',
  'befb4419-7772-4e09-89e8-f3c8c95fc460',
  '735146e2-4bd9-42e1-a67b-b959ca6fec77',
  'Industrial Presser Foot 16-Piece Assortment Kit',
  1, 16.00
);
INSERT INTO sale_returns (id, sale_id, return_date, reason, total_refund, status, created_at, updated_at)
VALUES (
  '42f60256-e610-4f91-9104-bf6a1c00f4e4',
  '85d45530-a6bd-4100-abcc-6c0a24cb6619',
  '2026-09-25',
  'Ordered DCx27 #11 but factory requested DCx27 #14 gauge instead.',
  24.00,
  'COMPLETED',
  '2026-09-25 14:00:00', '2026-09-25 14:00:00'
);
INSERT INTO sale_return_items (id, sale_return_id, product_id, product_name, quantity, unit_price)
VALUES (
  'c410886a-0826-4e27-b499-9244913c1b30',
  '42f60256-e610-4f91-9104-bf6a1c00f4e4',
  '30707025-9bda-47d0-b416-ea81b70723f6',
  'Groz-Beckert DCx27 #11 Overlock Needles (Pack of 10)',
  5, 4.80
);
INSERT INTO sale_returns (id, sale_id, return_date, reason, total_refund, status, created_at, updated_at)
VALUES (
  '59f08fb4-ffdc-45de-b548-b60a9841c4b9',
  '224d4d00-77e9-429b-b492-9e6e3bb24037',
  '2026-09-14',
  'Client decided to upgrade domestic Brother A80 to high-speed industrial model.',
  400.00,
  'COMPLETED',
  '2026-09-14 11:30:00', '2026-09-14 11:30:00'
);
INSERT INTO sale_return_items (id, sale_return_id, product_id, product_name, quantity, unit_price)
VALUES (
  '52a599b4-e9a6-423c-9729-95181e1fee8c',
  '59f08fb4-ffdc-45de-b548-b60a9841c4b9',
  'e83fd365-572b-490c-a66e-71acfd92dc84',
  'Brother Innov-is A80 Domestic Computerized',
  1, 400.00
);

COMMIT;
