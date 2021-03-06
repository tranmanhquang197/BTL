SET FOREIGN_KEY_CHECKS = 0;
drop table if exists generator;
drop table if exists kpi_type_config_statistic;
drop table if exists kpi;
drop table if exists kpi_distributor;
drop table if exists kpi_manufacturer;
drop table if exists kpi_package;
drop table if exists kpi_segment;
drop table if exists kpi_level;
drop table if exists kpi_product_packing;
drop table if exists kpi_store;
drop table if exists kpi_township;
drop table if exists kpi_file;
drop table if exists policy;
drop table if exists policy_distributor;
drop table if exists policy_manufacturer;
drop table if exists policy_package;
drop table if exists policy_segment;
drop table if exists policy_level;
drop table if exists policy_product_packing;
drop table if exists policy_store;
drop table if exists policy_township;
drop table if exists policy_detail;
drop table if exists policy_file;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE generator (
  code varchar(255) NOT NULL,
  value text NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (code)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO generator (code, value)
          VALUES ('KPI_CODE', '0'), ('POLICY_CODE', '0'),
                 ('PROMOTION_CODE', '0'), ('CAMPAIGN_CODE', '0'),
                 ('COUPON_CODE', '0');

          
drop table if exists kpi_type_config_statistic;
CREATE TABLE kpi_type_config_statistic (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  type ENUM('KPI_BUSINESS_RESULT_REVENUE_SELL_IN',
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
            'INCENTIVE_RATE_AMOUNT_REVENUE', 'INCENTIVE_RATE_PERCENT_REVENUE')
          NOT NULL,
  min_target_value DECIMAL(20, 2) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE DEFAULT NULL,
  config_object LONGTEXT NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
)ENGINE=INNODB AUTO_INCREMENT=10 DEFAULT CHARSET=UTF8;
delete from kpi_type_config_statistic;
INSERT INTO kpi_type_config_statistic (id, type, min_target_value, from_date, to_date, config_object)
            VALUES (1, 'KPI_BUSINESS_RESULT_REVENUE_SELL_IN', 1, DATE(SYSDATE()), null, '{}'),
                   (2, 'KPI_BUSINESS_RESULT_QUANTITY_SELL_IN', 1, DATE(SYSDATE()), null, '{}'),
                   (3, 'KPI_NETWORK_EXPANSION_L1_L1_NEW_ACTIVATION', 1, DATE(SYSDATE()), null, '{}'),
                   (4, 'KPI_NETWORK_EXPANSION_L1_L1_REAL_DEVELOPMENT', 1, DATE(SYSDATE()), null, '{"minAmount": "1"}'),
                   (5, 'KPI_NETWORK_EXPANSION_L1_EXISTS_ON_SYSTEM', 1, DATE(SYSDATE()), null, '{}'),
                   (6, 'KPI_NETWORK_EXPANSION_L1_OPERATE_FOR_DAYS', 1, DATE(SYSDATE()), null, '{"inDays": "3"}'),
                   (7, 'KPI_NETWORK_EXPANSION_L1_PURCHASE_IN_DAYS', 1, DATE(SYSDATE()), null, '{"minAmount": "1", "inDays": "3"}'),
                   (8, 'KPI_NETWORK_EXPANSION_L1_SELL_IN_DAYS', 1, DATE(SYSDATE()), null, '{"minAmount": "1", "inDays": "3"}'),
                   (9, 'KPI_NETWORK_EXPANSION_L1_AVERAGE_INCOME', 1, DATE(SYSDATE()), null, '{}'),
                   (10, 'KPI_NETWORK_EXPANSION_L2_L2_NEW_ACTIVATION', 1, DATE(SYSDATE()), null, '{}'),
                   (11, 'KPI_NETWORK_EXPANSION_L2_L2_EXISTS_ON_SYSTEM', 1, DATE(SYSDATE()), null, '{}'),
                   (12, 'KPI_INVENTORY_AMOUNT', 1, DATE(SYSDATE()), null, '{}'),
                   (13, 'KPI_INVENTORY_QUANTITY', 1, DATE(SYSDATE()), null, '{}'),
                   (14, 'INCENTIVE_RATE_AMOUNT_REVENUE', 1, DATE(SYSDATE()), null, '{}'),
                   (15, 'INCENTIVE_RATE_PERCENT_REVENUE', 1, DATE(SYSDATE()), null, '{}');


CREATE TABLE kpi (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  client_id VARCHAR(256) NOT NULL,
  type ENUM('KPI_BUSINESS_RESULT_REVENUE_SELL_IN',
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
            'KPI_INVENTORY_AMOUNT','KPI_INVENTORY_QUANTITY')
          NOT NULL,
  code VARCHAR(255) UNIQUE NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  description LONGTEXT DEFAULT NULL,
  status ENUM('DRAFT', 'ACCEPTED', 'REJECTED') NOT NULL,
  -- -------------------------------
  accept_date DATETIME DEFAULT NULL,
  accept_user varchar(255) DEFAULT NULL,
  reject_reason LONGTEXT DEFAULT NULL,
  -- -------------------------------
  reference_kpi_id BIGINT(20) DEFAULT NULL COMMENT 'Cái này chưa rõ lắm :( hiện tại mới chỉ có thể khai báo cấp COMPANY chứ còn công thức để luận ra bên dưới chưa có',
  -- -------------------------------
  target_value DECIMAL(20, 2) NOT NULL,
  -- -------------------------------
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (client_id, code),
  CONSTRAINT fk_kpi_kpi FOREIGN KEY (reference_kpi_id) REFERENCES kpi(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_distributor (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  kpi_id BIGINT(20) NOT NULL,
  distributor_code VARCHAR(255) NOT NULL,
  distributor_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (kpi_id, distributor_code),
  CONSTRAINT fk_kpidistributor_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_manufacturer (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  kpi_id BIGINT(20) NOT NULL,
  manufacturer_code VARCHAR(255) NOT NULL,
  manufacturer_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (kpi_id, manufacturer_code),
  CONSTRAINT fk_kpimanufacturer_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_package (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  kpi_id BIGINT(20) NOT NULL,
  package_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (kpi_id, package_id),
  CONSTRAINT fk_kpipackage_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id),
  CONSTRAINT fk_kpipackage_package FOREIGN KEY (package_id) REFERENCES package(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_segment (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  kpi_id BIGINT(20) NOT NULL,
  segment_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (kpi_id, segment_id),
  CONSTRAINT fk_kpisegment_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id),
  CONSTRAINT fk_kpisegment_segment FOREIGN KEY (segment_id) REFERENCES segment(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_level (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  kpi_id BIGINT(20) NOT NULL,
  level_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (kpi_id, level_id),
  CONSTRAINT fk_kpilevel_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id),
  CONSTRAINT fk_kpilevel_level FOREIGN KEY (level_id) REFERENCES level(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_product_packing (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  kpi_id BIGINT(20) NOT NULL,
  product_packing_code VARCHAR(255) NOT NULL,
  product_packing_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (kpi_id, product_packing_code),
  CONSTRAINT fk_kpiproductpacking_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_store (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  kpi_id BIGINT(20) NOT NULL,
  store_code VARCHAR(255) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (kpi_id, store_code),
  CONSTRAINT fk_kpistore_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_township (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  kpi_id BIGINT(20) NOT NULL,
  township_code VARCHAR(255) NOT NULL,
  township_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (kpi_id, township_code),
  CONSTRAINT fk_kpitownship_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE kpi_file (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  kpi_id bigint(20) NOT NULL,
  url text NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_kpiimage_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE policy (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  kpi_id bigint(20) DEFAULT NULL,
  type ENUM('DISCOUNT_AMOUNT_ORDER', 'DISCOUNT_PERCENT_ORDER_P1', 'DISCOUNT_PERCENT_ORDER_P2',
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
            'LOYALTY_POINT_INSTALL_APP_EXISTS_PURCHASE',
            
            'OTHER')
          NOT NULL,
  code VARCHAR(255) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  description LONGTEXT DEFAULT NULL,
  last_time_paid_reward DATE DEFAULT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_policy_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE policy_distributor (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  policy_id BIGINT(20) NOT NULL,
  distributor_code VARCHAR(255) NOT NULL,
  distributor_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (policy_id, distributor_code),
  CONSTRAINT fk_policydistributor_policy FOREIGN KEY (policy_id) REFERENCES policy(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE policy_manufacturer (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  policy_id BIGINT(20) NOT NULL,
  manufacturer_code VARCHAR(255) NOT NULL,
  manufacturer_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (policy_id, manufacturer_code),
  CONSTRAINT fk_policymanufacturer_policy FOREIGN KEY (policy_id) REFERENCES policy(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE policy_package (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  policy_id BIGINT(20) NOT NULL,
  package_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (policy_id, package_id),
  CONSTRAINT fk_policypackage_policy FOREIGN KEY (policy_id) REFERENCES policy(id),
  CONSTRAINT fk_policypackage_package FOREIGN KEY (package_id) REFERENCES package(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE policy_segment (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  policy_id BIGINT(20) NOT NULL,
  segment_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (policy_id, segment_id),
  CONSTRAINT fk_policysegment_policy FOREIGN KEY (policy_id) REFERENCES policy(id),
  CONSTRAINT fk_policysegment_segment FOREIGN KEY (segment_id) REFERENCES segment(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE policy_level (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  policy_id BIGINT(20) NOT NULL,
  level_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (policy_id, level_id),
  CONSTRAINT fk_policylevel_policy FOREIGN KEY (policy_id) REFERENCES policy(id),
  CONSTRAINT fk_policylevel_level FOREIGN KEY (level_id) REFERENCES level(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE policy_product_packing (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  policy_id BIGINT(20) NOT NULL,
  product_packing_code VARCHAR(255) NOT NULL,
  product_packing_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (policy_id, product_packing_code),
  CONSTRAINT fk_policyproductpacking_policy FOREIGN KEY (policy_id) REFERENCES policy(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE policy_store (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  policy_id BIGINT(20) NOT NULL,
  store_code VARCHAR(255) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (policy_id, store_code),
  CONSTRAINT fk_policystore_policy FOREIGN KEY (policy_id) REFERENCES policy(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE policy_township (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  policy_id BIGINT(20) NOT NULL,
  township_code VARCHAR(255) NOT NULL,
  township_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (policy_id, township_code),
  CONSTRAINT fk_policytownship_policy FOREIGN KEY (policy_id) REFERENCES policy(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE policy_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  kpi_id bigint(20) DEFAULT NULL,
  policy_id bigint(20) NOT NULL,
  -- -------------------------------
  min_value DECIMAL(20,2) NOT NULL,
  reward_value DECIMAL(20,2) NOT NULL,
  reward_unit ENUM('%', 'MMK', 'POINT') NOT NULL,
  -- -------------------------------
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_policydetail_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id),
  CONSTRAINT fk_policydetail_policy FOREIGN KEY (policy_id) REFERENCES policy(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE policy_file (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  policy_id bigint(20) NOT NULL,
  url text NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_policyfile_policy FOREIGN KEY (policy_id) REFERENCES policy(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


drop table if exists dcommerce_market_place.STATISTIC_MERCHANT_RESULT_BY_POLICY;
CREATE TABLE dcommerce_market_place.STATISTIC_MERCHANT_RESULT_BY_POLICY (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  user_name VARCHAR(255) NOT NULL,
  township_code VARCHAR(45) NOT NULL,
  package_code VARCHAR(45) DEFAULT NULL,
  segment_code VARCHAR(45) NOT NULL,
  level_code VARCHAR(45) NOT NULL,
  policy_code VARCHAR(255) NOT NULL,
  policy_type VARCHAR(255) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  value DECIMAL(20, 2) NOT NULL,
  reward_value DECIMAL(20, 2) DEFAULT NULL,
  reward_unit ENUM('MMK', 'POINT') DEFAULT NULL,
  reward_status INT(11) DEFAULT 0,
  reward_date DATETIME DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  note TEXT DEFAULT NULL,
  pay_type INT(11) DEFAULT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
--   UNIQUE KEY (user_name, policy_code, from_date)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


drop table if exists dcommerce_market_place.STATISTIC_BUSINESS_RESULTS;
CREATE TABLE dcommerce_market_place.STATISTIC_BUSINESS_RESULTS (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  package_code VARCHAR(50) NOT NULL,
  distributor_code VARCHAR(50) NOT NULL,
  product_packing_code VARCHAR(255) NOT NULL,
  manufacturer_code VARCHAR(50) NOT NULL,
  township_code VARCHAR(50) NOT NULL,
  store_code VARCHAR(50) NOT NULL,
  merged_codes VARCHAR(700) NOT NULL COMMENT 'Merged Columns',
  affect_date DATE NOT NULL,
  total_quantity BIGINT(20) NOT NULL,
  total_amount DECIMAL(20, 2) NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (merged_codes, affect_date)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

drop table if exists dcommerce_market_place.STATISTIC_NETWORK_EXPANSION_L1_NEW_ACTIVATION;
CREATE TABLE dcommerce_market_place.STATISTIC_NETWORK_EXPANSION_L1_NEW_ACTIVATION (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  package_code VARCHAR(50) NOT NULL,
  township_code VARCHAR(50) NOT NULL,
  affect_date DATE NOT NULL,
  total_quantity BIGINT(20) NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (package_code, township_code, affect_date)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP PROCEDURE IF EXISTS dcommerce_market_place.statistic_network_expansion_L1_new_activation;
DELIMITER //
CREATE PROCEDURE dcommerce_market_place.`statistic_network_expansion_L1_new_activation`(fDate varchar(30), tDate varchar(30))
BEGIN
  DECLARE fromDate DATE DEFAULT STR_TO_DATE(fDate,'%d/%m/%Y');
  DECLARE toDate DATE DEFAULT DATE_ADD(STR_TO_DATE(tDate,'%d/%m/%Y'), INTERVAL 1 DAY);
  -- Xóa đi để tổng hợp lại
   DELETE FROM statistic_network_expansion_l1_new_activation WHERE affect_date >= fromDate and affect_date < toDate;
  -- Tổng hợp lại theo khoảng thời gian
  SET @var = 0;
  INSERT INTO statistic_network_expansion_l1_new_activation(package_code, township_code, affect_date, total_quantity)
	SELECT g.package_code, g.village_code, g.from_date, (@var:=@var+g.act) AS total
	FROM (
	    SELECT m.package_code, m.village_code, a.from_date, SUM(a.status) AS act
	    FROM merchant_active_history AS a
		       join merchant AS m ON a.introducer_id = m.MERCHANT_ID
	    WHERE a.merchant_type = 1 AND m.village_code IS NOT NULL
		    AND a.from_date >= fromDate
		    AND a.from_date < toDate
	    GROUP BY m.village_code, m.package_code, a.from_date
	    ORDER BY m.village_code, m.package_code, a.from_date) AS g
	GROUP BY g.village_code, g.package_code,from_date;
END; //
DELIMITER ;

