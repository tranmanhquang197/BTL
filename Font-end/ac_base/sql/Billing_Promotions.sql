SET FOREIGN_KEY_CHECKS = 0;
drop table if exists package;
drop table if exists segment;
drop table if exists level;
drop table if exists promotion;
drop table if exists promotion_manufacturer;
drop table if exists promotion_distributor;
drop table if exists promotion_store;
drop table if exists promotion_township;
drop table if exists promotion_package;
drop table if exists promotion_segment;
drop table if exists promotion_flash_sale_range_time;
drop table if exists promotion_coupon_account;
drop table if exists promotion_image;
drop table if exists promotion_level;
drop table if exists promotion_level_group_sell;
drop table if exists promotion_level_group_reward;
drop table if exists promotion_level_group_mapping_sell_reward;
drop table if exists promotion_level_group_sell_product_packing;
drop table if exists promotion_level_group_reward_product_packing;
drop table if exists campaign;
drop table if exists campaign_image;
drop table if exists campaign_file;
drop table if exists campaign_township;
drop table if exists campaign_category;
drop table if exists campaign_distributor;
drop table if exists FLASH_SALE_RANGE_TIME_CONFIG;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE FLASH_SALE_RANGE_TIME_CONFIG (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  from_time varchar(10) NOT NULL,
  to_time varchar(10) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

INSERT INTO FLASH_SALE_RANGE_TIME_CONFIG(from_time, to_time)
      VALUES ('09:00:00', '10:00:00'), ('12:00:00', '14:00:00'), ('16:00:00', '16:30:00');
   
CREATE TABLE package (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  client_id VARCHAR(256) NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(1000) NOT NULL,
  description LONGTEXT DEFAULT NULL,
  status ENUM('DRAFT', 'ACCEPTED', 'REJECTED') NOT NULL,
  accept_date DATETIME DEFAULT NULL,
  accept_user varchar(255) DEFAULT NULL,
  reject_reason LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (client_id, code)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

INSERT INTO package(id, client_id, code, name, description, status)
        VALUES (8888, 'Dcommerce', 'Package_L1', 'Package_L1', 'Package_L1', 'ACCEPTED'),
               (9999, 'Dcommerce', 'Package_Saleman', 'Package_Saleman', 'Package_Saleman', 'ACCEPTED');
               
CREATE TABLE segment (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  client_id VARCHAR(256) NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(1000) NOT NULL,
  description LONGTEXT DEFAULT NULL,
  status ENUM('DRAFT', 'ACCEPTED', 'REJECTED') NOT NULL,
  accept_date DATETIME DEFAULT NULL,
  accept_user varchar(255) DEFAULT NULL,
  reject_reason LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (client_id, code)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

INSERT INTO segment(id, client_id, code, name, description, status)
        VALUES (8888, 'Dcommerce', 'SV', 'Sinh viên', 'Sinh viên', 'ACCEPTED'),
               (9999, 'Dcommerce', 'TH', 'Tạp hóa', 'Tạp hóa', 'ACCEPTED');
               
CREATE TABLE level (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  client_id VARCHAR(256) NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(1000) NOT NULL,
  description LONGTEXT DEFAULT NULL,
  status ENUM('DRAFT', 'ACCEPTED', 'REJECTED') NOT NULL,
  point_to_reach DECIMAL(20, 2) NOT NULL COMMENT 'Số điểm cần đạt để lên level này', 
  accept_date DATETIME DEFAULT NULL,
  accept_user varchar(255) DEFAULT NULL,
  reject_reason LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (client_id, code)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

INSERT INTO level(id, client_id, code, name, description, point_to_reach, status)
        VALUES (6666, 'Dcommerce', 'Bronze', 'Bronze', 'Bronze', 0, 'ACCEPTED'),
               (8888, 'Dcommerce', 'Silver', 'Silver', 'Silver', 4500000, 'ACCEPTED'),
               (9999, 'Dcommerce', 'Gold', 'Gold', 'Gold', 9000000, 'ACCEPTED');
             

CREATE TABLE campaign (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  client_id VARCHAR(256) NOT NULL,
  type ENUM('FLASH_SALE', 'PROMOTION_LINE_QUANTITY_PARITY') NOT NULL,
  code VARCHAR(255) NOT NULL,
  name VARCHAR(1000) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE DEFAULT NULL,
  from_date_registration DATE NOT NULL,
  to_date_registration DATE NOT NULL,
  description LONGTEXT DEFAULT NULL,
  status ENUM('DRAFT', 'ACCEPTED', 'REJECTED', 'ON_GOING', 'CLOSED') NOT NULL,
  delivery_time_required INT(11) NOT NULL COMMENT 'hour',
  minimum_quantity_of_each_package_id_to_be_sold INT(11) NOT NULL,
  package_id_minimum_stock INT(11) NOT NULL,
  minimum_percentage_off DECIMAL(12,2) NOT NULL,
  parity_level DECIMAL(12, 2) DEFAULT NULL,
  accept_date DATETIME DEFAULT NULL,
  accept_user varchar(255) DEFAULT NULL,
  reject_reason LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (client_id, code)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE campaign_image (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  campaign_id bigint(20) NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_campaignimage_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE campaign_file (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  campaign_id bigint(20) NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_campaignfile_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE campaign_township (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  campaign_id BIGINT(20) NOT NULL,
  township_code VARCHAR(255) NOT NULL,
  township_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (campaign_id, township_code),
  CONSTRAINT fk_campaigntownship_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE campaign_category (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  campaign_id BIGINT(20) NOT NULL,
  category_code VARCHAR(255) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (campaign_id, category_code),
  CONSTRAINT fk_campaigncategory_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE campaign_distributor (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  campaign_id BIGINT(20) NOT NULL,
  distributor_code VARCHAR(255) NOT NULL,
  distributor_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (campaign_id, distributor_code),
  CONSTRAINT fk_campaigndistributor_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  client_id VARCHAR(256) NOT NULL,
  type ENUM('PROMOTION_LINE_QUANTITY_PERCENT',
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
            'PROMOTION_LINE_QUANTITY_PARITY')
     NOT NULL,
  code VARCHAR(255) NOT NULL,
  name VARCHAR(1000) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE DEFAULT NULL,
  description LONGTEXT DEFAULT NULL,
  status ENUM('DRAFT', 'ACCEPTED', 'REJECTED', 'ON_GOING', 'CLOSED') NOT NULL,
  display_type ENUM('BANNER', 'FLASH_SALE', 'SUPER_PROMOTION', 'COUPON', 'COUPON_AFTER_TRANSACTION') NOT NULL,
  maximum_number_of_turns INT(11) DEFAULT NULL,
  uses_per_customer INT(11) DEFAULT NULL,
  attendance ENUM('RETAILER', 'END_USER') NOT NULL,
  campaign_id BIGINT(20) DEFAULT NULL,
  accept_date DATETIME DEFAULT NULL,
  accept_user varchar(255) DEFAULT NULL,
  reject_reason LONGTEXT DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (client_id, code),
  CONSTRAINT fk_promotion_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

-- INSERT INTO promotion (id, client_id, type, code, name, from_date, to_date, description, status)
--     VALUES (1, 'Dcommerce', 'PROMOTION_LINE_QUANTITY_PERCENT', 'P_L_Q_P', 'PLQP', '2020-06-20', null, 'Ừ đây là cái mô tả PLQP ^^', 'DRAFT');

CREATE TABLE promotion_distributor (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  distributor_code VARCHAR(255) NOT NULL,
  distributor_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (promotion_id, distributor_code),
  CONSTRAINT fk_promotiondistributor_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_manufacturer (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  manufacturer_code VARCHAR(255) NOT NULL,
  manufacturer_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (promotion_id, manufacturer_code),
  CONSTRAINT fk_promotionmanufacturer_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_store (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  store_code VARCHAR(255) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (promotion_id, store_code),
  CONSTRAINT fk_promotionstore_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_township (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  township_code VARCHAR(255) NOT NULL,
  township_name VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (promotion_id, township_code),
  CONSTRAINT fk_promotiontownship_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_package (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  package_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (promotion_id, package_id),
  CONSTRAINT fk_promotionpackage_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id),
  CONSTRAINT fk_promotionpackage_package FOREIGN KEY (package_id) REFERENCES package(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_segment (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  segment_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (promotion_id, segment_id),
  CONSTRAINT fk_promotionsegment_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id),
  CONSTRAINT fk_promotionsegment_segment FOREIGN KEY (segment_id) REFERENCES segment(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_flash_sale_range_time (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  from_time DATETIME NOT NULL,
  to_time DATETIME NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_promotionflashsalerangetime_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_coupon_account (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  username VARCHAR(255) NOT NULL,
  maximum_number_of_turns INT(11) DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY (promotion_id, username),
  CONSTRAINT fk_promotioncouponaccount_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_image (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  promotion_id bigint(20) NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  create_date datetime DEFAULT NULL,
  create_user varchar(255) DEFAULT NULL,
  update_date datetime DEFAULT NULL,
  update_user varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_promotionimage_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE promotion_level (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  code VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_promotionlevel_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_level_group_sell (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  promotion_level_id BIGINT(20) NOT NULL,
  -- Điều kiện theo kết quả kinh doanh
  min_quantity INT(11) NOT NULL,
  min_amount DECIMAL(20, 2) NOT NULL,
  -- Điều kiện theo phát triển kênh
  number_of_merchant INT(11) DEFAULT NULL COMMENT 'Số lượng L1/L2 mà SM/L1 phát triển được',
  percent_of_merchant_sell DECIMAL(11, 2) DEFAULT NULL COMMENT '% L1/L2 mua hàng',
  amount_of_merchant_sell DECIMAL(20, 2) DEFAULT NULL COMMENT 'tổng tiền L1/L2 mua hàng',
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_promotionlevelgroupsell_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id),
  CONSTRAINT fk_promotionlevelgroupsell_promotionlevel FOREIGN KEY (promotion_level_id) REFERENCES promotion_level(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_level_group_reward (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  promotion_level_id BIGINT(20) NOT NULL,
  max_quantity INT(11) DEFAULT NULL,
  max_amount DECIMAL(20, 2) DEFAULT NULL,
  percent DECIMAL(11, 2) DEFAULT NULL CHECK(percent BETWEEN 0 AND 100),
  parity_level DECIMAL(12, 2) DEFAULT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_promotionlevelgroupreward_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id),
  CONSTRAINT fk_promotionlevelgroupreward_promotionlevel FOREIGN KEY (promotion_level_id) REFERENCES promotion_level(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_level_group_mapping_sell_reward (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  promotion_level_id BIGINT(20) NOT NULL,
  promotion_level_group_sell_id BIGINT(20) NOT NULL,
  promotion_level_group_reward_id BIGINT(20) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_promotionlevelgroupmappingsellreward_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id),
  CONSTRAINT fk_promotionlevelgroupmappingsellreward_promotionlevel FOREIGN KEY (promotion_level_id) REFERENCES promotion_level(id),
  CONSTRAINT fk_promotionlevelgroupmappingsellreward_promotionlevelgroupsell FOREIGN KEY (promotion_level_group_sell_id) REFERENCES promotion_level_group_sell(id),
  CONSTRAINT fk_plevelgroupmappingsellreward_plevelgroupreward FOREIGN KEY (promotion_level_group_reward_id) REFERENCES promotion_level_group_reward(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_level_group_sell_product_packing (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_id BIGINT(20) NOT NULL,
  promotion_level_group_sell_id BIGINT(20) NOT NULL,
  mch5_code VARCHAR(255) NOT NULL,
  mch5_name VARCHAR(255) NOT NULL,
  product_packing_code VARCHAR(255) NOT NULL,
  product_packing_name VARCHAR(255) NOT NULL,
  quantity INT(11) DEFAULT NULL,
  amount DECIMAL(20, 2) DEFAULT NULL, 
  sell_price DECIMAL(20, 2) NOT NULL,
  max_sell_quantity INT(11) DEFAULT NULL,
  sku VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  packing_type_code VARCHAR(255) NOT NULL,
  packing_type_quantity VARCHAR(255) NOT NULL,
  distributor_code VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_promotionlevelgroupsellproductpacking_promotionlevelgroupsell FOREIGN KEY (promotion_level_group_sell_id) REFERENCES promotion_level_group_sell(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

CREATE TABLE promotion_level_group_reward_product_packing (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  promotion_level_group_reward_id BIGINT(20) NOT NULL,
  mch5_code VARCHAR(255) NOT NULL,
  mch5_name VARCHAR(255) NOT NULL,
  product_packing_code VARCHAR(255) NOT NULL,
  product_packing_name VARCHAR(255) NOT NULL,
  quantity INT(11) NOT NULL,
  price DECIMAL(20, 2) NOT NULL, 
  amount DECIMAL(20, 2) NOT NULL, 
  sku VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  packing_type_code VARCHAR(255) NOT NULL,
  packing_type_quantity VARCHAR(255) NOT NULL,
  distributor_code VARCHAR(255) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_plevelgrouprewardproductpacking_plevelgroupreward FOREIGN KEY (promotion_level_group_reward_id) REFERENCES promotion_level_group_reward(id)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;

drop table if exists promotion_product_packing_appear_same_time;
CREATE TABLE promotion_product_packing_appear_same_time (
  id BIGINT(20) NOT NULL AUTO_INCREMENT,
  type_one VARCHAR(255) NOT NULL,
  display_type_one VARCHAR(255) NOT NULL,
  type_two VARCHAR(255) NOT NULL,
  display_type_two VARCHAR(255) NOT NULL,
  is_appear BIT(1) NOT NULL,
  create_date DATETIME DEFAULT NULL,
  create_user VARCHAR(255) DEFAULT NULL,
  update_date DATETIME DEFAULT NULL,
  update_user VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id), UNIQUE KEY(type_one, display_type_one, type_two, display_type_two)
)ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;


-- CREATE TABLE kpi_paid_rewards (
--   id BIGINT(20) NOT NULL AUTO_INCREMENT,
--   kpi_id BIGINT(20) NOT NULL,
--   username VARCHAR(255) NOT NULL,
--   -- Giá trị tổng hợp bên mStore
--   total_quantity INT(11) DEFAULT NULL,
--   total_amount DECIMAL(20, 2) DEFAULT NULL,
--   number_of_merchant INT(11) DEFAULT NULL,
--   percent_of_merchant_sell DECIMAL(11, 2) DEFAULT NULL,
--   amount_of_merchant_sell DECIMAL(20, 2) DEFAULT NULL,
--   -- Phần trả thưởng: Tiền || hiện vật
--   reward_amount DECIMAL(20, 2) DEFAULT NULL,
--   reward_quantity INT(11) DEFAULT NULL COMMENT 'Nếu có số này tức là trả thưởng bằng hiện vật với bảng chi tiết',
--   accepted_paid_date DATE NOT NULL,
--   accepted_paid_user VARCHAR(255) NOT NULL,
--   create_date DATETIME DEFAULT NULL,
--   create_user VARCHAR(255) DEFAULT NULL,
--   update_date DATETIME DEFAULT NULL,
--   update_user VARCHAR(255) DEFAULT NULL,
--   PRIMARY KEY (id),
--   CONSTRAINT fk_kpipaidrewards_kpi FOREIGN KEY (kpi_id) REFERENCES kpi(id)
-- )ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=UTF8;



-- ---------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS cast_to_bit;
DELIMITER //
CREATE FUNCTION cast_to_bit (N INT) RETURNS bit(1)
BEGIN
    IF N > 0 THEN
      RETURN 1;
    ELSE
      RETURN 0;
    END IF;
END; //
DELIMITER ;


DROP FUNCTION IF EXISTS first_day;
DELIMITER //
CREATE FUNCTION first_day(dt DATETIME) RETURNS date
BEGIN
    RETURN DATE(DATE_ADD(DATE_ADD(LAST_DAY(dt), INTERVAL 1 DAY), INTERVAL - 1 MONTH));
END; //
DELIMITER ;

drop table if exists xDate;
create table xDate(
  xdate DATE NOT NULL
)ENGINE=INNODB DEFAULT CHARSET=UTF8;

DROP PROCEDURE IF EXISTS dcommerce_market_place.getDateInRange;
DELIMITER //
CREATE PROCEDURE dcommerce_market_place.getDateInRange(fromDate DATETIME, toDate DATETIME)
BEGIN
    DELETE FROM xDate;
    INSERT INTO xDate(xDate)
    SELECT a.Date 
		FROM ( 
		    SELECT toDate - INTERVAL (a.a +(10*b.a)+(100*c.a)) DAY AS date 
		 	  FROM (
            SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
									   		  UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 
									   		  UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a 
				      CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
									   			              UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 
		                                    UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b 
		          CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
									   			              UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 
		                                    UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c 
		    ) a WHERE a.date BETWEEN fromDate AND toDate 
    ORDER BY a.date;
END; //
DELIMITER ;
-- ---------------------------------------------------------------------------------
