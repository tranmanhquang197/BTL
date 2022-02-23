SET FOREIGN_KEY_CHECKS = 0;
drop table if exists merchant_order_detail;
drop table if exists merchant_order;
SET FOREIGN_KEY_CHECKS = 1;

-- create table merchant (
--   id bigint(20) NOT NULL AUTO_INCREMENT,
--   country_id bigint(20) NOT NULL,
--   language_id bigint(20) NOT NULL,
--   currency_id bigint(20) NOT NULL,
--   code varchar(255) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
--   name varchar(255) NOT NULL,
--   domain_name varchar(255) default null,
--   in_business_since datetime NOT NULL,
--   email varchar(255) default null,
--   logo varchar(255) default null,
--   address varchar(255) default null,
--   city varchar(255) default null,
--   phone varchar(255) default null,
--   postal_code varchar(255) default null,
--   lat DECIMAL(10, 8) NOT NULL,
--   lng DECIMAL(11, 8) NOT NULL,
--   status bit(1) default null COMMENT '0: không hoạt động, 1: hoạt động',
--   create_date datetime default null,
--   create_user varchar(255) default null,
--   update_date datetime default null,
--   update_user varchar(255) default null,
--   PRIMARY KEY (id),
--   CONSTRAINT fk_merchant_language FOREIGN KEY (language_id) REFERENCES language(id),
--   CONSTRAINT fk_merchant_country FOREIGN KEY (country_id) REFERENCES country(id),
--   CONSTRAINT fk_merchant_currency FOREIGN KEY (currency_id) REFERENCES currency(id)
-- )ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
-- 
-- #lat, lng: Số 2 Lê Văn Thiêm
-- insert into merchant (id, country_id, language_id, currency_id, code, name, domain_name, in_business_since, email, logo, address, city, phone, postal_code, lat, lng, status, create_date, create_user)
--             values(1, 1, 2, 2, 'code', 'name', 'domain_name', SYSDATE(), 'email', 'logo', 'address', 'city', 'phone', 'postal_code', 21.002682, 105.802157, 1, SYSDATE(), 'AUTO INSERT');
            
create table merchant_order (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE NOT NULL,
  QR_code longtext  NOT NULL,
  merchant_code varchar(255) NOT NULL,
  merchant_name varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  amount decimal(20, 2) NOT NULL,
  order_id bigint(20) UNIQUE NOT NULL,
  order_code varchar(255) NOT NULL,
  order_date datetime NOT NULL,
  from_store_id bigint(20) NOT NULL,
--   merchant_id bigint(20) NOT NULL,
  status int(1) default null COMMENT '0: Đơn hàng Store thiếu hàng, 1: Đơn hàng Store đủ hàng, 2: Đơn hàng trả hàng thành công, 3: Bị hủy, 4: Bị trả, 5. Đang chờ điều chuyển kho',
  goods_receive_form ENUM('SHIPPING', 'PICK_UP') NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_merchantorder_store FOREIGN KEY (from_store_id) REFERENCES store(id)
--   CONSTRAINT fk_merchantorder_merchant FOREIGN KEY (merchant_id) REFERENCES merchant(id)
)ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


create table merchant_order_detail (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  merchant_order_id bigint(20) NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  distributor_id bigint(20) NOT NULL,
  quantity bigint(20) NOT NULL,
	price decimal(20, 2) NOT NULL,
  type int(11) NOT NULL COMMENT '0: Hàng bán, 1: Hàng khuyến mãi',
  status int(1) default null COMMENT '0: from_store không đủ hàng, 1: from_store đang chờ hàng, 2: from_store đủ hàng,',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_merchantorderdetail_merchantorder FOREIGN KEY (merchant_order_id) REFERENCES merchant_order(id),
  CONSTRAINT fk_merchantorderdetail_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id),
  CONSTRAINT fk_merchantorderdetail_distributor FOREIGN KEY (distributor_id) REFERENCES distributor(id)
)ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;












