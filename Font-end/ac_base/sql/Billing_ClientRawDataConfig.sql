SET FOREIGN_KEY_CHECKS = 0;
drop table if exists client_raw_data_config;
SET FOREIGN_KEY_CHECKS = 1;
             
CREATE TABLE client_raw_data_config (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  code ENUM('MANUFACTURER', 'DISTRIBUTOR', 'STORE', 'TOWNSHIP', 'TREE_MCH',
            'CURRENT_USER_DISTRIBUTOR', 'MAXIMUM_NUMBER_OF_TURNS', 'PAID_REWARDS',
            'SYNCHRONIZE_ACCEPT_PROMOTION', 'SYNCHRONIZE_REJECT_PROMOTION',
            'PREVIOUS_RESULT', 'UPDATE_ACCEPTED_PROMOTION', 'PAY_REWAD',
            'SEND_NOTIFICATIONS', 'INVENTORY_PRODUCT_PACKING') NOT NULL,
  client_id VARCHAR(256) NOT NULL,
  type ENUM('ALL', 'KPI',
            'PROMOTION_LINE_QUANTITY_PERCENT',
            'PROMOTION_LINE_QUANTITY_AMOUNT',
            'PROMOTION_LINE_QUANTITY_FREEITEM',
            'PROMOTION_LINE_AMOUNT_PERCENT',
            'PROMOTION_LINE_AMOUNT_AMOUNT',
            'PROMOTION_LINE_AMOUNT_FREEITEM',
            'PROMOTION_GROUP_QUANTITY_PERCENT',
            'PROMOTION_GROUP_QUANTITY_AMOUNT',
            'PROMOTION_GROUP_QUANTITY_FREEITEM',
            'PROMOTION_GROUP_AMOUNT_PERCENT',
            'PROMOTION_GROUP_AMOUNT_AMOUNT',
            'PROMOTION_GROUP_AMOUNT_FREEITEM',
            'PROMOTION_BUNDLE_QUANTITY_PERCENT',
            'PROMOTION_BUNDLE_QUANTITY_AMOUNT',
            'PROMOTION_BUNDLE_QUANTITY_FREEITEM',
            'PROMOTION_BUNDLE_AMOUNT_PERCENT',
            'PROMOTION_BUNDLE_AMOUNT_AMOUNT',
            'PROMOTION_BUNDLE_AMOUNT_FREEITEM',
            'PROMOTION_ORDER_QUANTITY_PERCENT',
            'PROMOTION_ORDER_QUANTITY_AMOUNT',
            'PROMOTION_ORDER_QUANTITY_FREEITEM',
            'PROMOTION_ORDER_AMOUNT_PERCENT',
            'PROMOTION_ORDER_AMOUNT_AMOUNT',
            'PROMOTION_ORDER_AMOUNT_FREEITEM',
            'PROMOTION_LINE_QUANTITY_PARITY',
            
            'KPI_BUSINESS_RESULT_REVENUE_SELL_IN',
            'KPI_BUSINESS_RESULT_QUANTITY_SELL_IN',
            'KPI_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION',
            'KPI_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT',
            'KPI_NETWORK_EXPANSION_L1_EXISTS_ON_SYSTEM',
            'KPI_NETWORK_EXPANSION_L1_OPERATE_FOR_DAYS',
            'KPI_NETWORK_EXPANSION_L1_PURCHASE_IN_DAYS',
            'KPI_NETWORK_EXPANSION_L1_SELL_IN_DAYS',
            'KPI_NETWORK_EXPANSION_L1_AVERAGE_INCOME',
            'KPI_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION',
            'KPI_NETWORK_EXPANSION_L2_L2_REAL_DEVELOPMENT',
            'KPI_NETWORK_EXPANSION_L2_L2_EXISTS_ON_SYSTEM',
            'KPI_INVENTORY_AMOUNT','KPI_INVENTORY_QUANTITY',
            
            'DISCOUNT_AMOUNT_ORDER', 'DISCOUNT_PERCENT_ORDER_P1', 'DISCOUNT_PERCENT_ORDER_P2',
            'REACHED_AMOUNT_DISCOUNT_PERCENT_ORDER_P1', 'REACHED_AMOUNT_DISCOUNT_PERCENT_ORDER_P2',
            
            'INCENTIVE_RATE_AMOUNT_REVENUE',
            'INCENTIVE_RATE_PERCENT_REVENUE',
            'INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION',
            'INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT',
            'INCENTIVE_RATE_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION',
            'INCENTIVE_RATE_AMOUNT_LOGIN', 'INCENTIVE_RATE_INSTALL_APP_EXISTS_PURCHASE',
            
            'LOYALTY_POINT_AMOUNT_ORDER', 'LOYALTY_POINT_AMOUNT_LOGIN',
            'LOYALTY_POINT_AMOUNT_REVIEW_PRODUCT',
            'LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION',
            'LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT',
            'LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION',
            'LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_OPERATE_FOR_DAYS',
            'LOYALTY_POINT_AMOUNT_NETWORK_EXPANSION_L1_PURCHASE_IN_DAYS',
            'LOYALTY_POINT_INSTALL_APP_EXISTS_PURCHASE')
          NOT NULL,
  base_url TEXT NOT NULL,
  native_url TEXT NOT NULL,
  method ENUM("GET", "POST") NOT NULL,
  http_param LONGTEXT DEFAULT NULL,
  http_header LONGTEXT DEFAULT NULL,
  body LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (client_id, type, code)
)ENGINE=INNODB AUTO_INCREMENT=126 DEFAULT CHARSET=UTF8;



DELETE FROM oauth2_sso.user_role WHERE user_id BETWEEN 90 AND 99 OR role_id BETWEEN 90 AND  99;
DELETE FROM oauth2_sso.app_user WHERE id BETWEEN 90 AND  99;
INSERT INTO oauth2_sso.app_user (id, first_name, last_name, password, username, enabled, must_change_password) VALUES 
(90, 'Billing', 'Billing_NPP', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_NPP', 1, 0),
(91, 'Billing', 'Billing_NPP_Manager', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_NPP_Manager', 1, 0),
(92, 'Billing', 'Billing_CV_Marketing', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_CV_Marketing', 1, 0),
(93, 'Billing', 'Billing_TP_Marketing', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_TP_Marketing', 1, 0),
(94, 'Billing', 'Billing_salesadmin', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_salesadmin', 1, 0),
(95, 'Billing', 'Billing_RSM', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_RSM', 1, 0),
(96, 'Billing', 'Billing_Accountant', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_Accountant', 1, 0),
(97, 'Billing', 'Billing_1', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_1', 1, 0),
(98, 'Billing', 'Billing_2', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_2', 1, 0),
(99, 'Billing', 'Billing_3', '$2a$10$dAPmXXaiF6/OirSNUDHnaOKC5YYjJdCcjK2eg7GcoOXkJ0RRvB0Qa', 'Billing_3', 1, 0);

DELETE FROM oauth2_sso.role_menu WHERE role_id BETWEEN 90 AND  99 OR menu_id BETWEEN 200 AND 299;
DELETE FROM oauth2_sso.role_permission WHERE role_id BETWEEN 90 AND  99 OR permission_id between 901 and 1000;
DELETE FROM oauth2_sso.app_role WHERE id BETWEEN 90 AND  99;
INSERT INTO oauth2_sso.app_role (id, client_id, role_name, description) VALUES
(90, 'Billing', 'Billing_NPP', 'Billing_NPP'),
(91, 'Billing', 'Billing_NPP_Manager', 'Billing_NPP_Manager'),
(92, 'Billing', 'Billing_CV_Marketing', 'Billing_CV_Marketing'),
(93, 'Billing', 'Billing_TP_Marketing', 'Billing_TP_Marketing'),
(94, 'Billing', 'Billing_salesadmin', 'Billing_salesadmin'),
(95, 'Billing', 'Billing_RSM', 'Billing_RSM'),
(96, 'Billing', 'Billing_Accountant', 'Billing_Accountant'),
(97, 'Billing', 'Billing_1', 'Billing_1'),
(98, 'Billing', 'Billing_2', 'Billing_2'),
(99, 'Billing', 'Billing_3', 'Billing_3');
INSERT INTO oauth2_sso.user_role(user_id, role_id) VALUES (90, 90),(91, 91),(92, 92),(93, 93),(94, 94),(95, 95),(96, 96),(97, 97),(98, 98),(99, 99);

DELETE FROM oauth2_sso.app_menu where id between 200 and 299 and client_id = 'Billing' and parent_menu_id is not null;
DELETE FROM oauth2_sso.app_menu where id between 200 and 299;
INSERT INTO oauth2_sso.app_menu (id, client_id, app_type, code, url, parent_menu_id) VALUES (200, 'Billing', 'WEB', 'LOGOUT', '', null),(201, 'Billing', 'WEB', 'LEVEL', '', null),(202, 'Billing', 'WEB', 'SEGMENT', '', null),(203, 'Billing', 'WEB', 'PACKAGE', '', null),(204, 'Billing', 'WEB', 'PROMOTION', '', null),(205, 'Billing', 'WEB', 'KPI', '', null),(206, 'Billing', 'WEB', 'KPI_MANAGERMENT', '', 205),(207, 'Billing', 'WEB', 'KPI_PREVIOUS_RESULT', '', 205),(208, 'Billing', 'WEB', 'POLICY', '', null),(209, 'Billing', 'WEB', 'POLICY_PRICE', '', 208),(210, 'Billing', 'WEB', 'POLICY_CHANNEL', '', 208),(211, 'Billing', 'WEB', 'POLICY_PAID_REWARD', '', 208),(212, 'Billing', 'WEB', 'POLICY_PAID_REWARD_RESULT', '', 208),(213, 'Billing', 'WEB', 'CAMPAIGN', '', null),(214, 'Billing', 'WEB', 'DISTRIBUTOR_CAMPAIGN', '', 213),(215, 'Billing', 'WEB', 'MSTORE_CAMPAIGN', '', 213);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (90, 200),(90, 213),(90, 214),(90, 215);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (91, 200),(91, 213),(91, 214),(91, 215);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (92, 200),(92, 205),(92, 206),(92, 207),(92, 208),(92, 209),(92, 210),(92, 213),(92, 214),(92, 215);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (93, 200),(93, 205),(93, 206),(93, 207),(93, 208),(93, 209),(93, 210),(93, 213),(93, 214),(93, 215);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (94, 200),(94, 203),(94, 205),(94, 208);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (95, 200),(95, 203),(95, 205),(95, 208);
INSERT INTO oauth2_sso.role_menu(role_id, menu_id) VALUES (96, 200),(96, 201),(96, 202),(96, 203),(96, 204),(96, 205),(96, 206),(96, 207),(96, 208),(96, 209),(96, 210),(96, 211),(96, 212),(96, 213),(96, 214),(96, 215);




DELETE FROM oauth2_sso.role_permission WHERE permission_id between 901 and 1000;
DELETE FROM oauth2_sso.app_permission where id between 901 and 1000;
INSERT INTO oauth2_sso.app_permission (id, client_id, url, description) VALUES (901, 'Billing', '**/**', ''),(902, 'Billing', 'get/campaigns', ''),(903, 'Billing', 'post/campaigns', ''),(904, 'Billing', 'get/campaigns/{id}', ''),(905, 'Billing', 'patch/campaigns/{id}', ''),(906, 'Billing', 'patch/campaigns/{id}/accept', ''),(907, 'Billing', 'post/campaigns/{id}/register', ''),(908, 'Billing', 'patch/campaigns/{id}/reject', ''),(909, 'Billing', 'get/client-raw-data-config', ''),(910, 'Billing', 'post/client-raw-data-config', ''),(911, 'Billing', 'get/client-raw-data-config/{id}', ''),(912, 'Billing', 'patch/client-raw-data-config/{id}', ''),(913, 'Billing', 'get/kpis', ''),(914, 'Billing', 'post/kpis', ''),(915, 'Billing', 'get/kpis/{id}', ''),(916, 'Billing', 'patch/kpis/{id}', ''),(917, 'Billing', 'patch/kpis/{id}/accept', ''),(918, 'Billing', 'patch/kpis/{id}/reject', ''),(919, 'Billing', 'post/kpis/download-template', ''),(920, 'Billing', 'post/kpis/export-excel', ''),(921, 'Billing', 'post/kpis/import-child-kpi/{id}', ''),(922, 'Billing', 'get/kpis/previous-results', ''),(923, 'Billing', 'get/levels', ''),(924, 'Billing', 'post/levels', ''),(925, 'Billing', 'get/levels/{id}', ''),(926, 'Billing', 'patch/levels/{id}', ''),(927, 'Billing', 'patch/levels/{id}/accept', ''),(928, 'Billing', 'patch/levels/{id}/reject', ''),(929, 'Billing', 'get/packages', ''),(930, 'Billing', 'post/packages', ''),(931, 'Billing', 'get/packages/{id}', ''),(932, 'Billing', 'patch/packages/{id}', ''),(933, 'Billing', 'patch/packages/{id}/accept', ''),(934, 'Billing', 'patch/packages/{id}/reject', ''),(935, 'Billing', 'get/policies', ''),(936, 'Billing', 'post/policies', ''),(937, 'Billing', 'get/policies/{id}', ''),(938, 'Billing', 'patch/policies/{id}', ''),(939, 'Billing', 'post/policies/export-excel', ''),(940, 'Billing', 'get/promotions', ''),(941, 'Billing', 'post/promotions', ''),(942, 'Billing', 'get/promotions/{id}', ''),(943, 'Billing', 'patch/promotions/{id}', ''),(944, 'Billing', 'patch/promotions/{id}/accept', ''),(945, 'Billing', 'patch/promotions/{id}/level', ''),(946, 'Billing', 'patch/promotions/{id}/reject', ''),(947, 'Billing', 'get/promotions/{promotionId}/level/{promotionLevelId}', ''),(948, 'Billing', 'patch/promotions/{promotionId}/level/{promotionLevelId}', ''),(949, 'Billing', 'post/promotions/calculate', ''),(950, 'Billing', 'get/segments', ''),(951, 'Billing', 'post/segments', ''),(952, 'Billing', 'get/segments/{id}', ''),(953, 'Billing', 'patch/segments/{id}', ''),(954, 'Billing', 'patch/segments/{id}/accept', ''),(955, 'Billing', 'patch/segments/{id}/reject', ''),(956, 'Billing', 'PayReward', ''),(957, 'Billing', 'post_patch_kpi_l1', ''),(958, 'Billing', 'post_patch_kpi_saleman', ''),(959, 'Billing', 'post_patch_promotion', '');
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (90, 901),(90, 902),(90, 904),(90, 907),(90, 909),(90, 923),(90, 929),(90, 940),(90, 941),(90, 942),(90, 943),(90, 945),(90, 947),(90, 948),(90, 949),(90, 950),(90, 959);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (91, 901),(91, 902),(91, 904),(91, 907),(91, 909),(91, 923),(91, 929),(91, 940),(91, 941),(91, 942),(91, 943),(91, 945),(91, 947),(91, 948),(91, 949),(91, 950),(91, 959);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (92, 901),(92, 902),(92, 903),(92, 904),(92, 905),(92, 909),(92, 913),(92, 914),(92, 915),(92, 916),(92, 919),(92, 920),(92, 921),(92, 922),(92, 923),(92, 929),(92, 935),(92, 936),(92, 937),(92, 938),(92, 939),(92, 940),(92, 941),(92, 942),(92, 943),(92, 945),(92, 947),(92, 948),(92, 949),(92, 950);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (93, 901),(93, 902),(93, 904),(93, 905),(93, 906),(93, 908),(93, 909),(93, 913),(93, 914),(93, 915),(93, 916),(93, 919),(93, 920),(93, 921),(93, 922),(93, 923),(93, 929),(93, 935),(93, 936),(93, 937),(93, 938),(93, 939),(93, 940),(93, 941),(93, 942),(93, 943),(93, 944),(93, 945),(93, 946),(93, 947),(93, 948),(93, 949),(93, 950);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (94, 901),(94, 909);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (95, 901),(95, 909);
INSERT INTO oauth2_sso.role_permission(role_id, permission_id) VALUES (96, 901),(96, 902),(96, 904),(96, 909),(96, 913),(96, 915),(96, 920),(96, 922),(96, 923),(96, 929),(96, 935),(96, 937),(96, 940),(96, 942),(96, 947),(96, 948),(96, 949),(96, 950),(96, 956);
