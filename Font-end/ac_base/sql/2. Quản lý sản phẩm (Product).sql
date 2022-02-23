SET FOREIGN_KEY_CHECKS = 0;
drop table if exists product_description;
drop table if exists product_packing_price;
drop table if exists currency;
drop table if exists currency_exchange_rate;
drop table if exists product_packing;
drop table if exists product_packing_unit;
drop table if exists product_packing_unit_description;
drop table if exists product_image_description;
drop table if exists product_image;
drop table if exists product_digital;
drop table if exists product_category;
drop table if exists product;
drop table if exists category_description;
drop table if exists category;
drop table if exists product_type;
drop table if exists packing_type;
drop table if exists language;
drop table if exists manufacturer;
drop table if exists manufacturer_description;
drop table if exists distributor;
SET FOREIGN_KEY_CHECKS = 1;

drop table if exists config;
create table config (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  CODE varchar(255) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
  VALUE longtext DEFAULT NULL,
  description longtext DEFAULT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
select * from config;
INSERT INTO config (id, code, value, description)
            VALUES (1, 'EXPORT_STATEMENT_WARNING', 'USD|10000', 'Định dạng gồm 2 phần được phân cách bởi dấu "|", Phần phía trước là loại tiền, phần phía sau là giá trị sẽ đưa ra thông báo'),
                   (2, 'TOTAL_TIME_PURCHASE_ORDER', '45', 'Tổng số ngày đảm bảo để đặt PO với NCC và hàng về được đến FC'),
                   (3, 'ENABLE_UPDATE_STORE', '1', 'Trạng thái có cho chỉnh sửa kho ( 0 | 1 )'),
                   (4, 'ROLE_HEAD_OF_WAREHOUSE', 'TKFC|TKDC', 'Các mã vai trò được gắn tự động là thủ kho khi chọn địa bàn kho; phân cách bởi dấu "|"');

create table language (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  CODE varchar(255) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
  SORT_ORDER int(11) DEFAULT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

insert into language(id, Code, sort_order, create_date, create_user, update_date, update_user)
            values(1, 'vi', 2, SYSDATE(), 'AUTO INSERT', null, null);
insert into language(id, Code, sort_order, create_date, create_user, update_date, update_user)
            values(2, 'en', 1, SYSDATE(), 'AUTO INSERT', null, null);
insert into language(id, Code, sort_order, create_date, create_user, update_date, update_user)
            values(3, 'my', 1, SYSDATE(), 'AUTO INSERT', null, null);

create table distributor (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE NOT NULL,
  name varchar(255) default null,
  phone_number varchar(50) default null,
  email varchar(100) default null,
  address longtext default null,
  about_us longtext default null,
  enabled bit(1) default null,
  tin varchar(100) default null COMMENT 'Taxpayer Identification Number',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
-- INSERT INTO distributor(id, code, name, phone_number, email, address, about_us, enabled)
--         VALUES(1, 'mFunction', 'mFunction', '1234567890', 'mail@mfunction.com.vn', '', '', 1);


create table manufacturer (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE NOT NULL,
  tel varchar(50) default null,
  email varchar(100) default null,
  status bit(1) default null COMMENT '0: không hoạt động, 1: hoạt động',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table manufacturer_description (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  manufacturer_id bigint(20) NOT NULL,
  language_id bigint(20) NOT NULL,
  name varchar(255) default null,
  address longtext default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_manufacturerdescription_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id),
  CONSTRAINT fk_manufacturerdescription_language FOREIGN KEY (language_id) REFERENCES language(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- INSERT INTO manufacturer(id, code, name, address, tel, email, status, create_date, create_user) VALUES (1, 'MSN', 'Công ty CP Hàng tiêu dùng Massan', 'Mp Plaza, 39 Lê Duẩn, Bến Nghé, Quận 1, Hồ Chí Minh', '(028) 6255 5660', 'info@massan.com.vn', 1, SYSDATE(), 'AUTO INSERT'),(2, 'THP', 'Công ty TNHH TM – DV Tân Hiệp Phát', '219 Đại Lộ Bình Dương, Tx Thuận An, Bình Dương', '0898760066', 'info@thp.com.vn', 1, SYSDATE(), 'AUTO INSERT'),(3, 'VCR', 'Công ty Công nghiệp Dầu thực vật Việt Nam (VOCARIMEX) ', 'Tầng 9 Empress Tower, 138-142 Hai Bà Trưng, P. Đakao, Q. 1,Tp. Hồ Chí Minh (TPHCM)', '(028) 38237981', 'vocar@vocarimex.com.vn', 1, SYSDATE(), 'AUTO INSERT'),(4, 'HCC', 'Công ty Cổ Phần Bánh Kẹo Hải Châu', '15 Mạc Thị Bưởi, Q. Hai Bà Trưng, Hà Nội', '(024)36 361 692', 'tuongvi.ntv992@gmail.com', 1, SYSDATE(), 'AUTO INSERT'),(5, 'VNS', 'Công ty sữa đậu nành Việt Nam (VINASOY)', 'Số 2, Nguyễn Chí Thanh, Tp. Quảng Ngãi, tỉnh Quảng Ngãi, Việt Nam', '(055) 3 719 719', 'daunanhvn@vinasoy.com.vn', 1, SYSDATE(), 'AUTO INSERT');

#https://support.sugarcrm.com/Knowledge_Base/Products_Quotes/Product_Types_vs_Product_Categories/
create table product_type (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
  name varchar(255) NOT NULL,
  status bit(1) default null COMMENT '0: không hoạt động, 1: hoạt động',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- INSERT INTO product_type (id, code, name, status, create_date, create_user) VALUES (1, '1', 'Thực phẩm', 1, SYSDATE(), 'AUTO INSERT'),(2, '2', 'Đồ uống ', 1, SYSDATE(), 'AUTO INSERT'),(3, '3', 'Gia vị ', 1, SYSDATE(), 'AUTO INSERT');

create table product (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  product_type_id bigint(20) DEFAULT NULL,
  code varchar(255) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
  name varchar(255) default null,
  sku varchar(255) NOT NULL,
  available bit(1) default null COMMENT '0: không thể sử dụng để thao tác nghiệp vụ, 1: Còn có thể sử dụng để thao tác nghiệp vụ',
  available_date datetime default null,
  quantity_ordered int(11) default null COMMENT 'Số lượng package đã được đặt hàng, tính với các đơn hàng hoàn thành việc xuất hàng',
  sort_order int(11) default null,
  is_hot int(11) default null,
  is_popular int(11) default null,
  manufacturer_id bigint(20) NOT NULL,
  distributor_id bigint(20) NOT NULL,
  length decimal(19, 2) NOT NULL default 0 COMMENT 'DVT: mm',
  width decimal(19, 2) NOT NULL default 0 COMMENT 'DVT: mm',
  height decimal(19, 2) NOT NULL default 0 COMMENT 'DVT: mm',
  weight decimal(19, 2) NOT NULL default 0 COMMENT 'DVT: gram',
  vat int(11) default null,
  warning_threshold int(11) NOT NULL default 0 COMMENT 'DVT: ngày',
  lifecycle int(11) NOT NULL default 0 COMMENT 'DVT: ngày',
  barcode longtext default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_product_producttype FOREIGN KEY (product_type_id) REFERENCES product_type(id),
  CONSTRAINT fk_product_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id),
  CONSTRAINT fk_product_distributor FOREIGN KEY (distributor_id) REFERENCES distributor(id)
)ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- INSERT INTO product (id, product_type_id, code, name, available, available_date, quantity_ordered, sort_order, is_hot, is_popular, manufacturer_id, create_date, create_user) VALUES (1, 3, '100000135', 'Nước mắm Nam Ngư (Siêu Tiết Kiệm 800ml)', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(2, 3, '100000136', 'Nước mắm Nam Ngư (750ml)', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(3, 3, '100000137', 'Nước mắm Yod Thong', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(4, 3, '100000138', 'Nước tương Chinsu 250ml', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(5, 3, '100000139', 'Nước tương Chinsu tỏi ớt 250ml', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(6, 3, '100000140', 'Nước tương Tam Thái Tử  Nhất Ca 500ml', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(7, 3, '100000142', 'Tương ớt Chinsu 250gr', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(8, 3, '100000143', 'Tương ớt Rồng Việt 200gr', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(9, 1, '100000144', 'Mỳ Kokomi tôm chua cay (65g)', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(10, 1, '100000145', 'Mỳ khoai tây Omachi sốt bò (80g)', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(11, 1, '100000147', 'Mỳ Omachi lẩu tôm chua cay (80g)', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(12, 2, '100000150', 'Cà phê hòa tan 3 trong 1 Gold Original - 40 sachets x 20g', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(13, 2, '100000152', 'Cà phê hòa tan Wake Up 3 in 1 Saigon -  40 sachet x 19gr ', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(14, 2, '100000154', 'Nước uống tăng lực Wake Up 247 - Chai nhựa 250ml', 1, '2019-10-13', 0, null, null, null, 1, SYSDATE(), 'AUTO INSERT'),(15, 2, '100000003', 'Nước Tăng Lực Number 1 - Chai nhựa 330ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(16, 2, '100000004', 'Nước tăng lực Number 1 Vị Dâu - Chai nhựa: 330ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(17, 2, '100000005', 'Nước tăng lực Number 1 Vị Chanh - Chai nhựa 330ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(18, 2, '100000006', 'Nước ngọt Number 1 - Chai nhựa 455ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(19, 2, '100000007', 'Trà xanh không độ - Chai nhựa 455ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(20, 2, '100000008', 'Trà bí đao không độ - Lon 330ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(21, 2, '100000009', 'Trà sữa Machiato - Chai nhựa 330ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(22, 2, '100000010', 'Trà thanh nhiệt Doctor Thanh - Chai nhựa 350ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(23, 2, '100000011', 'Trà thanh nhiệt Doctor Thanh không đường - Chai nhựa 350ml', 1, '2019-10-13', 0, null, null, null, 2, SYSDATE(), 'AUTO INSERT'),(24, 1, '100000283', 'Bánh lương khô Omega 420g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(25, 1, '100000286', 'Nhãn lương khô dinh dưỡng 65g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(26, 1, '100000287', 'Nhãn lương khô cacao 65g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(27, 1, '100000292', 'Kem xốp kobe 205g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(28, 1, '100000293', 'Bánh xốp sữa 170g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(29, 1, '100000299', 'Bánh Quế Rami vị kem', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(30, 1, '100000298', 'Bánh kem xốp 3 in 1 200g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(31, 1, '100000300', 'Kẹo nhân khoai môn xoắn 260g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(32, 1, '100000301', 'Kẹo chew nhân nho xoắn 100g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(33, 1, '100000302', 'Kẹo Chew nhân cà phê 100g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(34, 1, '100000284', 'Hộp lương khô rong biển 700g', 1, '2019-10-13', 0, null, null, null, 4, SYSDATE(), 'AUTO INSERT'),(35, 2, '100000091', 'Sữa đậu nành Fami nguyên chất 200ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(36, 2, '100000092', 'Sữa đậu nành Fami nguyên chất ít đường 200ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(37, 2, '100000093', 'Sữa đậu nành Fami canxi 200ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(38, 2, '100000094', 'Sữa đậu nành Fami kid 200ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(39, 2, '100000095', 'Sữa đậu nành Fami Go mè đen 200ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(40, 2, '100000096', 'Sữa đậu nành Fami Go đậu đỏ 200ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(41, 2, '100000097', 'Sữa đậu nành Vinasoy nguyên chất 200ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(42, 2, '100000098', 'Sữa đậu nành Vinasoy mè đen 200ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(43, 2, '100000099', 'Sữa đậu nành Soymen 250ml', 1, '2019-10-13', 0, null, null, null, 5, SYSDATE(), 'AUTO INSERT'),(44, 3, '100000074', 'Dầu ăn Vocarimex 250ml', 1, '2019-10-20', 0, null, null, null, 3, SYSDATE(), 'AUTO INSERT'),(45, 3, '100000076', 'Dầu ăn Vocarimex 1L', 1, '2019-10-20', 0, null, null, null, 3, SYSDATE(), 'AUTO INSERT'),(46, 3, '100000078', 'Dầu ăn Vocarimex 2L', 1, '2019-10-20', 0, null, null, null, 3, SYSDATE(), 'AUTO INSERT'),(47, 3, '100000080', 'Dầu ăn Vocarimex 5L', 1, '2019-10-20', 0, null, null, null, 3, SYSDATE(), 'AUTO INSERT'),(48, 3, '100000064', 'Dầu ăn Premium 250ml', 1, '2019-10-20', 0, null, null, null, 3, SYSDATE(), 'AUTO INSERT'),(49, 3, '100000071', 'Dầu ăn Premium 1.8L', 1, '2019-10-20', 0, null, null, null, 3, SYSDATE(), 'AUTO INSERT'),(50, 3, '100000067', 'Dầu ăn Premium 5L', 1, '2019-10-20', 0, null, null, null, 3, SYSDATE(), 'AUTO INSERT');

create table product_description (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  product_id bigint(20) NOT NULL,
  language_id bigint(20) NOT NULL,
  code varchar(255) default null,
  name varchar(255) default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_productdescription_product FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_productdescription_language FOREIGN KEY (language_id) REFERENCES language(id)
)ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- INSERT INTO product_description (id, product_id, language_id, code, name, create_date, create_user) VALUES (1, 1, 2, '100000135', 'Nước mắm Nam Ngư (Siêu Tiết Kiệm 800ml)', SYSDATE(), 'AUTO INSERT'),(2, 1, 1, '100000135', 'Nam Ngu Fish Sauce - Super Saving Brand (800ml)', SYSDATE(), 'AUTO INSERT'),(3, 2, 2, '100000136', 'Nước mắm Nam Ngư (750ml)', SYSDATE(), 'AUTO INSERT'),(4, 1, 1, '100000136', 'Nam Ngu Fish Sauce (750ml)', SYSDATE(), 'AUTO INSERT'),(5, 3, 2, '100000137', 'Nước mắm Yod Thong', SYSDATE(), 'AUTO INSERT'),(6, 3, 1, '100000137', 'Yod Thong Fish Sauce', SYSDATE(), 'AUTO INSERT'),(7, 4, 2, '100000138', 'Nước tương Chinsu 250ml', SYSDATE(), 'AUTO INSERT'),(8, 4, 1, '100000138', 'Chinsu Soya Sauce 250ml', SYSDATE(), 'AUTO INSERT'),(9, 5, 2, '100000139', 'Nước tương Chinsu tỏi ớt 250ml', SYSDATE(), 'AUTO INSERT'),(10, 5, 1, '100000139', 'Chinsu Soya Sauce with Garlic & Chilli 250ml', SYSDATE(), 'AUTO INSERT'),(11, 6, 2, '100000140', 'Nước tương Tam Thái Tử  Nhất Ca 500ml', SYSDATE(), 'AUTO INSERT'),(12, 6, 1, '100000140', '3rd Prince Soya Sauce - Nhat Ca Brand (500ml)', SYSDATE(), 'AUTO INSERT'),(13, 7, 2, '100000142', 'Tương ớt Chinsu 250gr', SYSDATE(), 'AUTO INSERT'),(14, 7, 1, '100000142', 'Chinsu Chilli Sauce 250gr', SYSDATE(), 'AUTO INSERT'),(15, 8, 2, '100000143', 'Tương ớt Rồng Việt 200gr', SYSDATE(), 'AUTO INSERT'),(16, 8, 1, '100000143', 'Vietnam Dragon Chilli Sauce 250gr', SYSDATE(), 'AUTO INSERT'),(17, 9, 2, '100000144', 'Mỳ Kokomi tôm chua cay (65g)', SYSDATE(), 'AUTO INSERT'),(18, 9, 1, '100000144', 'Kokomi Sour & Spicy Noodles (65g)', SYSDATE(), 'AUTO INSERT'),(19, 10, 2, '100000145', 'Mỳ khoai tây Omachi sốt bò (80g)', SYSDATE(), 'AUTO INSERT'),(20, 10, 1, '100000145', 'Omachi Potato Noodles With Beef Sauce (80g)', SYSDATE(), 'AUTO INSERT'),(21, 11, 2, '100000147', 'Mỳ Omachi lẩu tôm chua cay (80g)', SYSDATE(), 'AUTO INSERT'),(22, 11, 1, '100000147', 'Omachi Sour & Spicy Noodles with  shrimp flavour (80g)', SYSDATE(), 'AUTO INSERT'),(23, 12, 2, '100000150', 'Cà phê hòa tan 3 trong 1 Gold Original - 40 sachets x 20g', SYSDATE(), 'AUTO INSERT'),(24, 12, 1, '100000150', 'Gold Original Instant Coffee 3 in 1 - 40 sachets x 20g.', SYSDATE(), 'AUTO INSERT'),(25, 13, 2, '100000152', 'Cà phê hòa tan Wake Up 3 in 1 Saigon -  40 sachet x 19gr ', SYSDATE(), 'AUTO INSERT'),(26, 13, 1, '100000152', 'Instant Coffee Wake Up 3 in 1 Saigon - 40 sachet x 19gr', SYSDATE(), 'AUTO INSERT'),(27, 14, 2, '100000154', 'Nước uống tăng lực Wake Up 247 - Chai nhựa 250ml', SYSDATE(), 'AUTO INSERT'),(28, 14, 1, '100000154', 'Wake Up 247 Energy Drink - Plastic bottle: 250ml ', SYSDATE(), 'AUTO INSERT'),(29, 15, 2, '100000003', 'Nước Tăng Lực Number 1 - Chai nhựa 330ml', SYSDATE(), 'AUTO INSERT'),(30, 15, 1, '100000003', 'Number 1 Energy Drink - Plastic bottle: 330 ml ', SYSDATE(), 'AUTO INSERT'),(31, 16, 2, '100000004', 'Nước tăng lực Number 1 Vị Dâu - Chai nhựa: 330ml', SYSDATE(), 'AUTO INSERT'),(32, 16, 1, '100000004', 'Number 1 Energy Drink With Strawberry Flavour - Plastic bottle: 330ml ', SYSDATE(), 'AUTO INSERT'),(33, 17, 2, '100000005', 'Nước tăng lực Number 1 Vị Chanh - Chai nhựa 330ml', SYSDATE(), 'AUTO INSERT'),(34, 17, 1, '100000005', 'Energy Drink Number 1 With Lemon Flavor - Plastic bottle: 330 ml ', SYSDATE(), 'AUTO INSERT'),(35, 18, 2, '100000006', 'Nước ngọt Number 1 - Chai nhựa 455ml', SYSDATE(), 'AUTO INSERT'),(36, 18, 1, '100000006', 'Number 1 Sport Drink - Plastic bottle 455 ml ', SYSDATE(), 'AUTO INSERT'),(37, 19, 2, '100000007', 'Trà xanh không độ - Chai nhựa 455ml', SYSDATE(), 'AUTO INSERT'),(38, 19, 1, '100000007', 'Zero Degree Green Tea - Plastic bottle: 455ml ', SYSDATE(), 'AUTO INSERT'),(39, 20, 2, '100000008', 'Trà bí đao không độ - Lon 330ml', SYSDATE(), 'AUTO INSERT'),(40, 20, 1, '100000008', 'Zero Deegree Pumpkin Tea - Can 330ml', SYSDATE(), 'AUTO INSERT'),(41, 21, 2, '100000009', 'Trà sữa Machiato - Chai nhựa 330ml', SYSDATE(), 'AUTO INSERT'),(42, 21, 1, '100000009', 'Machiato Milk Tea - Plastic bottle: 330ml ', SYSDATE(), 'AUTO INSERT'),(43, 22, 2, '100000010', 'Trà thanh nhiệt Doctor Thanh - Chai nhựa 350ml', SYSDATE(), 'AUTO INSERT'),(44, 22, 1, '100000010', 'Doctor Thanh Heat-relieving Tea - Plastic bottle: 350ml', SYSDATE(), 'AUTO INSERT'),(45, 23, 2, '100000011', 'Trà thanh nhiệt Doctor Thanh không đường - Chai nhựa 350ml', SYSDATE(), 'AUTO INSERT'),(46, 23, 1, '100000011', 'Doctor Thanh Heat-relieving Tea Without Sugar. Plastic bottle: 350 ml ', SYSDATE(), 'AUTO INSERT'),(47, 24, 2, '100000283', 'Bánh lương khô Omega 420g', SYSDATE(), 'AUTO INSERT'),(48, 24, 1, '100000283', 'Omega dry provision 420g', SYSDATE(), 'AUTO INSERT'),(49, 25, 2, '100000286', 'Nhãn lương khô dinh dưỡng 65g', SYSDATE(), 'AUTO INSERT'),(50, 25, 1, '100000286', 'Nutrion dry provision NW 65g', SYSDATE(), 'AUTO INSERT'),(51, 26, 2, '100000287', 'Nhãn lương khô cacao 65g', SYSDATE(), 'AUTO INSERT'),(52, 26, 1, '100000287', 'Cocoa dry provision NW 65g', SYSDATE(), 'AUTO INSERT'),(53, 27, 2, '100000292', 'Kem xốp kobe 205g', SYSDATE(), 'AUTO INSERT'),(54, 27, 1, '100000292', 'Kobe foam cake 205g', SYSDATE(), 'AUTO INSERT'),(55, 28, 2, '100000293', 'Bánh xốp sữa 170g', SYSDATE(), 'AUTO INSERT'),(56, 28, 1, '100000293', 'Milk foam cake 170g', SYSDATE(), 'AUTO INSERT'),(57, 29, 2, '100000299', 'Bánh Quế Rami vị kem', SYSDATE(), 'AUTO INSERT'),(58, 29, 1, '100000299', 'Rami cake ', SYSDATE(), 'AUTO INSERT'),(59, 30, 2, '100000298', 'Bánh kem xốp 3 in 1 200g', SYSDATE(), 'AUTO INSERT'),(60, 30, 1, '100000298', 'Sponge cake 3 in 1 310g', SYSDATE(), 'AUTO INSERT'),(61, 31, 2, '100000300', 'Kẹo nhân khoai môn xoắn 260g', SYSDATE(), 'AUTO INSERT'),(62, 31, 1, '100000300', 'Tarro candy 260g', SYSDATE(), 'AUTO INSERT'),(63, 32, 2, '100000301', 'Kẹo chew nhân nho xoắn 100g', SYSDATE(), 'AUTO INSERT'),(64, 32, 1, '100000301', 'Grape Chew Candy 100g', SYSDATE(), 'AUTO INSERT'),(65, 33, 2, '100000302', 'Kẹo Chew nhân cà phê 100g', SYSDATE(), 'AUTO INSERT'),(66, 33, 1, '100000302', 'Coffee Chew Candy 100g', SYSDATE(), 'AUTO INSERT'),(67, 34, 2, '100000284', 'Hộp lương khô rong biển 700g', SYSDATE(), 'AUTO INSERT'),(68, 34, 1, '100000284', 'Seaweed dry provision 700g', SYSDATE(), 'AUTO INSERT'),(69, 35, 2, '100000091', 'Sữa đậu nành Fami nguyên chất 200ml', SYSDATE(), 'AUTO INSERT'),(70, 35, 1, '100000091', 'Fami soymilk 200ml ', SYSDATE(), 'AUTO INSERT'),(71, 36, 2, '100000092', 'Sữa đậu nành Fami nguyên chất ít đường 200ml', SYSDATE(), 'AUTO INSERT'),(72, 36, 1, '100000092', 'Fami soymilk less sugar 200ml ', SYSDATE(), 'AUTO INSERT'),(73, 37, 2, '100000093', 'Sữa đậu nành Fami canxi 200ml', SYSDATE(), 'AUTO INSERT'),(74, 37, 1, '100000093', 'Fami cacium soymilk 200ml ', SYSDATE(), 'AUTO INSERT'),(75, 38, 2, '100000094', 'Sữa đậu nành Fami kid 200ml', SYSDATE(), 'AUTO INSERT'),(76, 38, 1, '100000094', 'Fami kid soymilk 200ml ', SYSDATE(), 'AUTO INSERT'),(77, 39, 2, '100000095', 'Sữa đậu nành Fami Go mè đen 200ml', SYSDATE(), 'AUTO INSERT'),(78, 39, 1, '100000095', 'Fami back seseam flavor 200ml', SYSDATE(), 'AUTO INSERT'),(79, 40, 2, '100000096', 'Sữa đậu nành Fami Go đậu đỏ 200ml', SYSDATE(), 'AUTO INSERT'),(80, 40, 1, '100000096', 'Fami red bean flavor 200ml ', SYSDATE(), 'AUTO INSERT'),(81, 41, 2, '100000097', 'Sữa đậu nành Vinasoy nguyên chất 200ml', SYSDATE(), 'AUTO INSERT'),(82, 41, 1, '100000097', 'Vinasoy soymilk 200ml ', SYSDATE(), 'AUTO INSERT'),(83, 42, 2, '100000098', 'Sữa đậu nành Vinasoy mè đen 200ml', SYSDATE(), 'AUTO INSERT'),(84, 42, 1, '100000098', 'Vinasoy black seseam flavor 200ml ', SYSDATE(), 'AUTO INSERT'),(85, 43, 2, '100000099', 'Sữa đậu nành Soymen 250ml', SYSDATE(), 'AUTO INSERT'),(86, 43, 1, '100000099', 'Soymen soymilk 250ml ', SYSDATE(), 'AUTO INSERT'),(87, 44, 2, '100000074', 'Dầu ăn Vocarimex 250ml', SYSDATE(), 'AUTO INSERT'),(88, 44, 1, '100000074', 'Vocarimex soby 250ml', SYSDATE(), 'AUTO INSERT'),(89, 45, 2, '100000076', 'Dầu ăn Vocarimex 1L', SYSDATE(), 'AUTO INSERT'),(90, 45, 1, '100000076', 'Vocarimex soby 1L', SYSDATE(), 'AUTO INSERT'),(91, 46, 2, '100000078', 'Dầu ăn Vocarimex 2L', SYSDATE(), 'AUTO INSERT'),(92, 46, 1, '100000078', 'Vocarimex soby 2L', SYSDATE(), 'AUTO INSERT'),(93, 47, 2, '100000080', 'Dầu ăn Vocarimex 5L', SYSDATE(), 'AUTO INSERT'),(94, 47, 1, '100000080', 'Vocarimex soby 5L', SYSDATE(), 'AUTO INSERT'),(95, 48, 2, '100000064', 'Dầu ăn Premium 250ml', SYSDATE(), 'AUTO INSERT'),(96, 48, 1, '100000064', 'Premium cooking oil 250ml', SYSDATE(), 'AUTO INSERT'),(97, 49, 2, '100000071', 'Dầu ăn Premium 1.8L', SYSDATE(), 'AUTO INSERT'),(98, 49, 1, '100000066', 'Premium cooking oil 1.8L', SYSDATE(), 'AUTO INSERT'),(99, 50, 2, '100000067', 'Dầu ăn Premium 5L', SYSDATE(), 'AUTO INSERT'),(100, 50, 1, '100000067', 'Premium cooking oil 5L', SYSDATE(), 'AUTO INSERT');

create table packing_type (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
  quantity int(11) NOT NULL COMMENT 'Số lượng theo quy cách đóng gói',
  status bit(1) default null COMMENT '0: không hoạt động, 1: hoạt động',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- INSERT INTO packing_type (id, code, quantity, status, create_date, create_user) VALUES (1, 'S1', 1, 1, SYSDATE(), 'AUTO INSERT'),(2, 'S3', 3, 1, SYSDATE(), 'AUTO INSERT'),(3, 'S6', 6, 1, SYSDATE(), 'AUTO INSERT'),(4, 'S10', 10, 1, SYSDATE(), 'AUTO INSERT');

create table product_packing_unit (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table product_packing_unit_description (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  language_id bigint(20) NOT NULL,
  product_packing_unit_id bigint(20) NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id), UNIQUE(product_packing_unit_id, language_id),
  CONSTRAINT fk_productpackingunitdescription_language FOREIGN KEY (language_id) REFERENCES language(id),
  CONSTRAINT fk_productpackingunitdescription_productpackingunit FOREIGN KEY (product_packing_unit_id) REFERENCES product_packing_unit(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table product_packing (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
  name varchar(255) NOT NULL,
  vat int(11) default null,
  uom bigint(20) NOT NULL,
  barcode longtext default null,
  product_id bigint(20) NOT NULL,
  packing_type_id bigint(20) NOT NULL,
  distributor_id bigint(20) NOT NULL,
  status bit(1) default null COMMENT '0: không hoạt động, 1: hoạt động',
  length decimal(19, 2) NOT NULL default 0 COMMENT 'DVT: mm',
  width decimal(19, 2) NOT NULL default 0 COMMENT 'DVT: mm',
  height decimal(19, 2) NOT NULL default 0 COMMENT 'DVT: mm',
  weight decimal(19, 2) NOT NULL default 0 COMMENT 'DVT: gram',
  volume decimal(19,2) NOT NULL default 0 COMMENT 'DVT: mm^3',
  warning_threshold int(11) NOT NULL default 0 COMMENT 'DVT: ngày',
  lifecycle int(11) NOT NULL default 0 COMMENT 'DVT: ngày',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_productpacking_product FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_productpacking_packingtype FOREIGN KEY (packing_type_id) REFERENCES packing_type(id),
  CONSTRAINT fk_productpacking_distributor FOREIGN KEY (distributor_id) REFERENCES distributor(id),
  CONSTRAINT fk_productpacking_productpackingunit FOREIGN KEY (uom) REFERENCES product_packing_unit(id)
)ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- INSERT INTO product_packing (id, code, name, vat, uom, barcode, product_id, packing_type_id, status, create_date, create_user) VALUES (1, 'G0001', 'Nước mắm Nam Ngư (Siêu Tiết Kiệm 800ml) gói 6 chai', 5, 'chai', '8936017000011', 1, 3, 1, SYSDATE(), 'AUTO INSERT'),(2, 'G0002', 'Nước mắm Nam Ngư (Siêu Tiết Kiệm 800ml)', 5, 'chai', '8936017000011', 1, 1, 1, SYSDATE(), 'AUTO INSERT'),(3, 'G0003', 'Nước mắm Nam Ngư (750ml) gói 6 chai', 5, 'chai', '8936017000028', 2, 3, 1, SYSDATE(), 'AUTO INSERT'),(4, 'G0004', 'Nước mắm Nam Ngư (750ml)', 5, 'chai', '8936017000028', 2, 1, 1, SYSDATE(), 'AUTO INSERT'),(5, 'G0005', 'Nước mắm Yod Thong gói 6 chai', 5, 'chai', '8936017000035', 3, 3, 1, SYSDATE(), 'AUTO INSERT'),(6, 'G0006', 'Nước mắm Yod Thong', 5, 'chai', '8936017000035', 3, 1, 1, SYSDATE(), 'AUTO INSERT'),(7, 'G0007', 'Nước tương Chinsu 250mlgói 6 chai', 5, 'chai', '8936017000042', 4, 3, 1, SYSDATE(), 'AUTO INSERT'),(8, 'G0008', 'Nước tương Chinsu 250ml', 5, 'chai', '8936017000042', 4, 1, 1, SYSDATE(), 'AUTO INSERT'),(9, 'G0009', 'Nước tương Chinsu tỏi ớt 250mlgói 6 chai', 5, 'chai', '8936017000059', 5, 3, 1, SYSDATE(), 'AUTO INSERT'),(10, 'G0010', 'Nước tương Chinsu tỏi ớt 250ml', 5, 'chai', '8936017000059', 5, 1, 1, SYSDATE(), 'AUTO INSERT'),(11, 'G0011', 'Nước tương Tam Thái Tử  Nhất Ca 500mlgói 6 chai', 5, 'chai', '8936017000066', 6, 3, 1, SYSDATE(), 'AUTO INSERT'),(12, 'G0012', 'Nước tương Tam Thái Tử  Nhất Ca 500ml', 5, 'chai', '8936017000066', 6, 1, 1, SYSDATE(), 'AUTO INSERT'),(13, 'G0013', 'Tương ớt Chinsu 250gr gói 6 chai', 5, 'chai', '8936017000073', 7, 3, 1, SYSDATE(), 'AUTO INSERT'),(14, 'G0014', 'Tương ớt Chinsu 250gr', 5, 'chai', '8936017000073', 7, 1, 1, SYSDATE(), 'AUTO INSERT'),(15, 'G0015', 'Tương ớt Rồng Việt 200grgói 6 chai', 5, 'chai', '8936017000080', 8, 3, 1, SYSDATE(), 'AUTO INSERT'),(16, 'G0016', 'Tương ớt Rồng Việt 200gr', 5, 'chai', '8936017000080', 8, 1, 1, SYSDATE(), 'AUTO INSERT'),(17, 'G0017', 'Mỳ Kokomi tôm chua cay (65g) gói 10 gói', 5, 'gói', '8936017000097', 9, 4, 1, SYSDATE(), 'AUTO INSERT'),(18, 'G0018', 'Mỳ Kokomi tôm chua cay (65g)', 5, 'gói', '8936017000097', 9, 1, 1, SYSDATE(), 'AUTO INSERT'),(19, 'G0019', 'Mỳ khoai tây Omachi sốt bò (80g) gói 10 gói', 5, 'gói', '8936017000004', 10, 4, 1, SYSDATE(), 'AUTO INSERT'),(20, 'G0020', 'Mỳ khoai tây Omachi sốt bò (80g)', 5, 'gói', '8936017000004', 10, 1, 1, SYSDATE(), 'AUTO INSERT'),(21, 'G0021', 'Mỳ Omachi lẩu tôm chua cay (80g) gói 10 gói', 5, 'gói', '8936017000110', 11, 4, 1, SYSDATE(), 'AUTO INSERT'),(22, 'G0022', 'Mỳ Omachi lẩu tôm chua cay (80g)', 5, 'gói', '8936017000110', 11, 1, 1, SYSDATE(), 'AUTO INSERT'),(23, 'G0023', 'Cà phê hòa tan 3 trong 1 Gold Original - 40 sachets x 20g gói 3 hộp', 5, 'hộp', '8936017000127', 12, 2, 1, SYSDATE(), 'AUTO INSERT'),(24, 'G0024', 'Cà phê hòa tan 3 trong 1 Gold Original - 40 sachets x 20g', 5, 'hộp', '8936017000127', 12, 1, 1, SYSDATE(), 'AUTO INSERT'),(25, 'G0025', 'Cà phê hòa tan Wake Up 3 in 1 Saigon -  40 sachet x 19gr gói 3 hộp', 5, 'hộp', '8936017000134', 13, 2, 1, SYSDATE(), 'AUTO INSERT'),(26, 'G0026', 'Cà phê hòa tan Wake Up 3 in 1 Saigon -  40 sachet x 19gr ', 5, 'hộp', '8936017000134', 13, 1, 1, SYSDATE(), 'AUTO INSERT'),(27, 'G0027', 'Nước uống tăng lực Wake Up 247 - Chai nhựa 250mlgói 6 chai', 5, 'chai', '8936017000141', 14, 3, 1, SYSDATE(), 'AUTO INSERT'),(28, 'G0028', 'Nước uống tăng lực Wake Up 247 - Chai nhựa 250ml', 5, 'chai', '8936017000141', 14, 1, 1, SYSDATE(), 'AUTO INSERT'),(29, 'G0029', 'Nước Tăng Lực Number 1 - Chai nhựa 330mlgói 6 chai', 5, 'chai', '8936090000151', 15, 3, 1, SYSDATE(), 'AUTO INSERT'),(30, 'G0030', 'Nước Tăng Lực Number 1 - Chai nhựa 330ml', 5, 'chai', '8936090000151', 15, 1, 1, SYSDATE(), 'AUTO INSERT'),(31, 'G0031', 'Nước tăng lực Number 1 Vị Dâu - Chai nhựa: 330mlgói 6 chai', 5, 'chai', '8936090000168', 16, 3, 1, SYSDATE(), 'AUTO INSERT'),(32, 'G0032', 'Nước tăng lực Number 1 Vị Dâu - Chai nhựa: 330ml', 5, 'chai', '8936090000168', 16, 1, 1, SYSDATE(), 'AUTO INSERT'),(33, 'G0033', 'Nước tăng lực Number 1 Vị Chanh - Chai nhựa 330mlgói 6 chai', 5, 'chai', '8936090000175', 17, 3, 1, SYSDATE(), 'AUTO INSERT'),(34, 'G0034', 'Nước tăng lực Number 1 Vị Chanh - Chai nhựa 330ml', 5, 'chai', '8936090000175', 17, 1, 1, SYSDATE(), 'AUTO INSERT'),(35, 'G0035', 'Nước ngọt Number 1 - Chai nhựa 455mlgói 6 chai', 5, 'chai', '8936090000182', 18, 3, 1, SYSDATE(), 'AUTO INSERT'),(36, 'G0036', 'Nước ngọt Number 1 - Chai nhựa 455ml', 5, 'chai', '8936090000182', 18, 1, 1, SYSDATE(), 'AUTO INSERT'),(37, 'G0037', 'Trà xanh không độ - Chai nhựa 455mlgói 6 chai', 5, 'chai', '8936090000199', 19, 3, 1, SYSDATE(), 'AUTO INSERT'),(38, 'G0038', 'Trà xanh không độ - Chai nhựa 455ml', 5, 'chai', '8936090000199', 19, 1, 1, SYSDATE(), 'AUTO INSERT'),(39, 'G0039', 'Trà bí đao không độ - Lon 330ml gói 6 chai', 5, 'chai', '8936090000205', 20, 3, 1, SYSDATE(), 'AUTO INSERT'),(40, 'G0040', 'Trà bí đao không độ - Lon 330ml', 5, 'chai', '8936090000205', 20, 1, 1, SYSDATE(), 'AUTO INSERT'),(41, 'G0041', 'Trà sữa Machiato - Chai nhựa 330ml gói 6 chai', 5, 'chai', '8936090000212', 21, 3, 1, SYSDATE(), 'AUTO INSERT'),(42, 'G0042', 'Trà sữa Machiato - Chai nhựa 330ml', 5, 'chai', '8936090000212', 21, 1, 1, SYSDATE(), 'AUTO INSERT'),(43, 'G0043', 'Trà thanh nhiệt Doctor Thanh - Chai nhựa 350ml gói 6 chai', 5, 'chai', '8936090000229', 22, 3, 1, SYSDATE(), 'AUTO INSERT'),(44, 'G0044', 'Trà thanh nhiệt Doctor Thanh - Chai nhựa 350ml', 5, 'chai', '8936090000229', 22, 1, 1, SYSDATE(), 'AUTO INSERT'),(45, 'G0045', 'Trà thanh nhiệt Doctor Thanh không đường - Chai nhựa 350ml gói 6 chai', 5, 'chai', '8936090000236', 23, 3, 1, SYSDATE(), 'AUTO INSERT'),(46, 'G0046', 'Trà thanh nhiệt Doctor Thanh không đường - Chai nhựa 350ml', 5, 'chai', '8936090000236', 23, 1, 1, SYSDATE(), 'AUTO INSERT'),(47, 'G0047', 'Bánh lương khô Omega 420g gói 6 gói', 5, 'gói', '8934597000247', 24, 3, 1, SYSDATE(), 'AUTO INSERT'),(48, 'G0048', 'Bánh lương khô Omega 420g ', 5, 'gói', '8934597000247', 24, 1, 1, SYSDATE(), 'AUTO INSERT'),(49, 'G0049', 'Nhãn lương khô dinh dưỡng 65g gói 6 gói', 5, 'gói', '8934597000254', 25, 3, 1, SYSDATE(), 'AUTO INSERT'),(50, 'G0050', 'Nhãn lương khô dinh dưỡng 65g', 5, 'gói', '8934597000254', 25, 1, 1, SYSDATE(), 'AUTO INSERT'),(51, 'G0051', 'Nhãn lương khô cacao 65g gói 6 gói', 5, 'gói', '8934597000261', 26, 3, 1, SYSDATE(), 'AUTO INSERT'),(52, 'G0052', 'Nhãn lương khô cacao 65g', 5, 'gói', '8934597000261', 26, 1, 1, SYSDATE(), 'AUTO INSERT'),(53, 'G0053', 'Kem xốp kobe 205g gói 3 gói', 5, 'gói', '8934597000278', 27, 3, 1, SYSDATE(), 'AUTO INSERT'),(54, 'G0054', 'Kem xốp kobe 205g', 5, 'gói', '8934597000278', 27, 1, 1, SYSDATE(), 'AUTO INSERT'),(55, 'G0055', 'Bánh xốp sữa 170g gói 3 gói ', 5, 'gói', '8934597000285', 28, 3, 1, SYSDATE(), 'AUTO INSERT'),(56, 'G0056', 'Bánh xốp sữa 170g', 5, 'gói', '8934597000285', 28, 3, 1, SYSDATE(), 'AUTO INSERT'),(57, 'G0057', 'Bánh Quế Rami vị kem gói 3 gói', 5, 'gói', '8934597000292', 29, 3, 1, SYSDATE(), 'AUTO INSERT'),(58, 'G0058', 'Bánh Quế Rami vị kem', 5, 'gói', '8934597000292', 29, 1, 1, SYSDATE(), 'AUTO INSERT'),(59, 'G0059', 'Bánh kem xốp 3 in 1 200g gói 6 gói', 5, 'gói', '8934597000308', 30, 3, 1, SYSDATE(), 'AUTO INSERT'),(60, 'G0060', 'Bánh kem xốp 3 in 1 200g', 5, 'gói', '8934597000308', 30, 3, 1, SYSDATE(), 'AUTO INSERT'),(61, 'G0061', 'Kẹo nhân khoai môn xoắn 260g gói 6 gói', 5, 'tô', '8934597000315', 31, 3, 1, SYSDATE(), 'AUTO INSERT'),(62, 'G0062', 'Kẹo nhân khoai môn xoắn 260g', 5, 'tô', '8934597000315', 31, 1, 1, SYSDATE(), 'AUTO INSERT'),(63, 'G0063', 'Kẹo chew nhân nho xoắn 100g gói 6 gói', 5, 'tô', '8934597000322', 32, 3, 1, SYSDATE(), 'AUTO INSERT'),(64, 'G0064', 'Kẹo chew nhân nho xoắn 100g', 5, 'tô', '8934597000322', 32, 1, 1, SYSDATE(), 'AUTO INSERT'),(65, 'G0065', 'Kẹo Chew nhân cà phê 100g gói 6 gói', 5, 'gói', '8934597000339', 33, 3, 1, SYSDATE(), 'AUTO INSERT'),(66, 'G0066', 'Kẹo Chew nhân cà phê 100g', 5, 'gói', '8934597000339', 33, 1, 1, SYSDATE(), 'AUTO INSERT'),(67, 'G0067', 'Hộp lương khô rong biển 700g gói 6 gói', 5, 'gói', '8934597000346', 34, 3, 1, SYSDATE(), 'AUTO INSERT'),(68, 'G0068', 'Hộp lương khô rong biển 700g', 5, 'gói', '8934597000346', 34, 1, 1, SYSDATE(), 'AUTO INSERT'),(69, 'G0069', 'Sữa đậu nành Fami nguyên chất 200ml lốc 6 hộp', 5, 'hộp', '8934614000359', 35, 3, 1, SYSDATE(), 'AUTO INSERT'),(70, 'G0070', 'Sữa đậu nành Fami nguyên chất 200ml', 5, 'hộp', '8934614000359', 35, 1, 1, SYSDATE(), 'AUTO INSERT'),(71, 'G0071', 'Sữa đậu nành Fami nguyên chất ít đường 200ml lốc 6 hộp', 5, 'hộp', '8934614000366', 36, 3, 1, SYSDATE(), 'AUTO INSERT'),(72, 'G0072', 'Sữa đậu nành Fami nguyên chất ít đường 200ml', 5, 'hộp', '8934614000366', 36, 1, 1, SYSDATE(), 'AUTO INSERT'),(73, 'G0073', 'Sữa đậu nành Fami canxi 200ml lốc 6 hộp', 5, 'hộp', '8934614000373', 37, 3, 1, SYSDATE(), 'AUTO INSERT'),(74, 'G0074', 'Sữa đậu nành Fami canxi 200ml', 5, 'hộp', '8934614000373', 37, 1, 1, SYSDATE(), 'AUTO INSERT'),(75, 'G0075', 'Sữa đậu nành Fami kid 200ml lốc 6 hộp', 5, 'hộp', '8934614000380', 38, 3, 1, SYSDATE(), 'AUTO INSERT'),(76, 'G0076', 'Sữa đậu nành Fami kid 200ml', 5, 'hộp', '8934614000380', 38, 1, 1, SYSDATE(), 'AUTO INSERT'),(77, 'G0077', 'Sữa đậu nành Fami Go mè đen 200ml lốc 6 hộp', 5, 'hộp', '8934614000397', 39, 3, 1, SYSDATE(), 'AUTO INSERT'),(78, 'G0078', 'Sữa đậu nành Fami Go mè đen 200ml', 5, 'hộp', '8934614000397', 39, 1, 1, SYSDATE(), 'AUTO INSERT'),(79, 'G0079', 'Sữa đậu nành Fami Go đậu đỏ 200ml lốc 6 hộp', 5, 'hộp', '8934614000403', 40, 3, 1, SYSDATE(), 'AUTO INSERT'),(80, 'G0080', 'Sữa đậu nành Fami Go đậu đỏ 200ml', 5, 'hộp', '8934614000403', 40, 1, 1, SYSDATE(), 'AUTO INSERT'),(81, 'G0081', 'Sữa đậu nành Vinasoy nguyên chất 200ml lốc 6 hộp', 5, 'hộp', '8934614000410', 41, 3, 1, SYSDATE(), 'AUTO INSERT'),(82, 'G0082', 'Sữa đậu nành Vinasoy nguyên chất 200ml', 5, 'hộp', '8934614000410', 41, 1, 1, SYSDATE(), 'AUTO INSERT'),(83, 'G0083', 'Sữa đậu nành Vinasoy mè đen 200ml lốc 6 hộp', 5, 'hộp', '8934614000427', 42, 3, 1, SYSDATE(), 'AUTO INSERT'),(84, 'G0084', 'Sữa đậu nành Vinasoy mè đen 200ml', 5, 'hộp', '8934614000427', 42, 1, 1, SYSDATE(), 'AUTO INSERT'),(85, 'G0085', 'Sữa đậu nành Soymen 250ml lốc 6 hộp', 5, 'hộp', '8934614000434', 43, 3, 1, SYSDATE(), 'AUTO INSERT'),(86, 'G0086', 'Sữa đậu nành Soymen 250ml', 5, 'hộp', '8934614000434', 43, 1, 1, SYSDATE(), 'AUTO INSERT'),(87, 'G0087', 'Dầu ăn Vocarimex 250ml gói 3 chai ', 10, 'chai', '8935008000443', 44, 2, 1, SYSDATE(), 'AUTO INSERT'),(88, 'G0088', 'Dầu ăn Vocarimex 250ml', 10, 'chai', '8935008000443', 44, 1, 1, SYSDATE(), 'AUTO INSERT'),(89, 'G0089', 'Dầu ăn Vocarimex 1L gói 3 chai ', 10, 'chai', '8935008000450', 45, 2, 1, SYSDATE(), 'AUTO INSERT'),(90, 'G0090', 'Dầu ăn Vocarimex 1L', 10, 'chai', '8935008000450', 45, 1, 1, SYSDATE(), 'AUTO INSERT'),(91, 'G0091', 'Dầu ăn Vocarimex 2L gói 3 chai ', 10, 'chai', '8935008000467', 46, 2, 1, SYSDATE(), 'AUTO INSERT'),(92, 'G0092', 'Dầu ăn Vocarimex 2L', 10, 'chai', '8935008000467', 46, 1, 1, SYSDATE(), 'AUTO INSERT'),(93, 'G0093', 'Dầu ăn Vocarimex 5L gói 3 chai ', 10, 'chai', '8935008000474', 47, 2, 1, SYSDATE(), 'AUTO INSERT'),(94, 'G0094', 'Dầu ăn Vocarimex 5L', 10, 'chai', '8935008000474', 47, 1, 1, SYSDATE(), 'AUTO INSERT'),(95, 'G0095', 'Dầu ăn Premium 250mlgói 3 chai ', 10, 'chai', '8935008000481', 48, 2, 1, SYSDATE(), 'AUTO INSERT'),(96, 'G0096', 'Dầu ăn Premium 250ml', 10, 'chai', '8935008000481', 48, 1, 1, SYSDATE(), 'AUTO INSERT'),(97, 'G0097', 'Dầu ăn Premium 1.8L gói 3 chai ', 10, 'chai', '8935008000498', 49, 2, 1, SYSDATE(), 'AUTO INSERT'),(98, 'G0098', 'Dầu ăn Premium 1.8L', 10, 'chai', '8935008000498', 49, 1, 1, SYSDATE(), 'AUTO INSERT'),(99, 'G0099', 'Dầu ăn Premium 5L gói 3 chai ', 10, 'chai', '8935008000504', 50, 2, 1, SYSDATE(), 'AUTO INSERT'),(100, 'G0100', 'Dầu ăn Premium 5L', 10, 'chai', '8935008000504', 50, 1, 1, SYSDATE(), 'AUTO INSERT');

create table currency (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) UNIQUE default null,
  name varchar(255) UNIQUE default null,
  is_support bit(1) default null COMMENT '0: Không hỗ trợ, 1: Có hỗ trợ',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

insert into currency(id, code, name, is_support, create_date, create_user, update_date, update_user)
            values(1, 'USD', 'USD', 1, SYSDATE(), 'AUTO INSERT', null, null);
insert into currency(id, code, name, is_support, create_date, create_user, update_date, update_user)
            values(2, 'VND', 'VND', 1, SYSDATE(), 'AUTO INSERT', null, null);
insert into currency(id, code, name, is_support, create_date, create_user, update_date, update_user)
            values(3, 'MMK', 'Kyat', 1, SYSDATE(), 'AUTO INSERT', null, null);
            
CREATE TABLE currency_exchange_rate (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  from_currency_id BIGINT(20) NOT NULL,
  to_currency_id BIGINT(20) NOT NULL,
  exchange_rate DECIMAL(9,2) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE DEFAULT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_currencyexchangerate_fromcurrency FOREIGN KEY (from_currency_id) REFERENCES currency(id),
  CONSTRAINT fk_currencyexchangerate_tocurrency FOREIGN KEY (to_currency_id) REFERENCES currency(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table product_packing_price (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  currency_id bigint(20) NOT NULL,
  product_id bigint(20) NOT NULL,
  packing_type_quantity int(11) NOT NULL,
  product_packing_id bigint(20) NOT NULL,
  price double NOT NULL,
  sale_type varchar(50) NOT NULL COMMENT 'IN: Giá nhập, OUT: Giá xuất',
  from_date date NOT NULL,
  to_date date default null,
  status bit(1) default null COMMENT '0: không hoạt động, 1: hoạt động',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  unique (currency_id, product_packing_id, sale_type, from_date),
  CONSTRAINT fk_productpackingprice_currency FOREIGN KEY (currency_id) REFERENCES currency(id),
  CONSTRAINT fk_productpackingprice_product FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_productpackingprice_productpacking FOREIGN KEY (product_packing_id) REFERENCES product_packing(id)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- INSERT INTO product_packing_price(id, currency_id, product_packing_id, price, sale_type, from_date, to_date, status, create_date, create_user) VALUES (1, 2, 1, 62802, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(2, 2, 2, 10467, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(3, 2, 3, 106065.6, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(4, 2, 4, 17677.6, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(5, 2, 5, 123000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(6, 2, 6, 20500, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(7, 2, 7, 51637.2, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(8, 2, 8, 8606.2, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(9, 2, 9, 72571.2, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(10, 2, 10, 12095.2, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(11, 2, 11, 72571.2, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(12, 2, 12, 12095.2, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(13, 2, 13, 20934, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(14, 2, 14, 3489, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(15, 2, 15, 30000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(16, 2, 16, 5000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(17, 2, 17, 34000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(18, 2, 18, 3400, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(19, 2, 19, 34000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(20, 2, 20, 3400, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(21, 2, 21, 34000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(22, 2, 22, 3400, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(23, 2, 23, 90714, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(24, 2, 24, 30238, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(25, 2, 25, 72571.2, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(26, 2, 26, 24190.4, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(27, 2, 27, 34192.2, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(28, 2, 28, 5698.7, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(29, 2, 29, 48000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(30, 2, 30, 8000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(31, 2, 31, 48000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(32, 2, 32, 8000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(33, 2, 33, 48000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(34, 2, 34, 8000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(35, 2, 35, 48000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(36, 2, 36, 8000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(37, 2, 37, 51000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(38, 2, 38, 8500, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(39, 2, 39, 40200, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(40, 2, 40, 6700, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(41, 2, 41, 66000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(42, 2, 42, 11000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(43, 2, 43, 66000, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(44, 2, 44, 11000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(45, 2, 45, 66000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(46, 2, 46, 11000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(47, 2, 47, 34800, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(48, 2, 48, 45000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(49, 2, 49, 36000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(50, 2, 50, 6000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(51, 2, 51, 36000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(52, 2, 52, 6000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(53, 2, 53, 66000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(54, 2, 54, 11000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(55, 2, 55, 51000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(56, 2, 56, 8500, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(57, 2, 57, 36000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(58, 2, 58, 6000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(59, 2, 59, 180000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(60, 2, 60, 30000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(61, 2, 61, 90000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(62, 2, 62, 15000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(63, 2, 63, 90000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(64, 2, 64, 15000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(65, 2, 65, 120000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(66, 2, 66, 20000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(67, 2, 67, 360000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(68, 2, 68, 60000, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(69, 2, 69, 21600, 'IN', '2019-10-14', null, 1, SYSDATE(), 'AUTO INSERT'),(70, 2, 70, 3600, 'IN', '2019-10-23', null, 1, SYSDATE(), 'AUTO INSERT'),(71, 2, 71, 21600, 'IN', '2019-10-24', null, 1, SYSDATE(), 'AUTO INSERT'),(72, 2, 72, 3600, 'IN', '2019-10-25', null, 1, SYSDATE(), 'AUTO INSERT'),(73, 2, 73, 22800, 'IN', '2019-10-26', null, 1, SYSDATE(), 'AUTO INSERT'),(74, 2, 74, 3800, 'IN', '2019-10-27', null, 1, SYSDATE(), 'AUTO INSERT'),(75, 2, 75, 22800, 'IN', '2019-10-28', null, 1, SYSDATE(), 'AUTO INSERT'),(76, 2, 76, 3800, 'IN', '2019-10-29', null, 1, SYSDATE(), 'AUTO INSERT'),(77, 2, 77, 30600, 'IN', '2019-10-30', null, 1, SYSDATE(), 'AUTO INSERT'),(78, 2, 78, 5100, 'IN', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(79, 2, 79, 30600, 'IN', '2019-10-14', null, 1, SYSDATE(), 'AUTO INSERT'),(80, 2, 80, 5100, 'IN', '2019-10-15', null, 1, SYSDATE(), 'AUTO INSERT'),(81, 2, 81, 25200, 'IN', '2019-10-16', null, 1, SYSDATE(), 'AUTO INSERT'),(82, 2, 82, 4200, 'IN', '2019-10-17', null, 1, SYSDATE(), 'AUTO INSERT'),(83, 2, 83, 27600, 'IN', '2019-10-18', null, 1, SYSDATE(), 'AUTO INSERT'),(84, 2, 84, 4600, 'IN', '2019-10-19', null, 1, SYSDATE(), 'AUTO INSERT'),(85, 2, 85, 27600, 'IN', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(86, 2, 86, 4600, 'IN', '2019-10-21', null, 1, SYSDATE(), 'AUTO INSERT'),(87, 2, 87, 69000, 'IN', '2019-10-22', null, 1, SYSDATE(), 'AUTO INSERT'),(88, 2, 88, 23000, 'IN', '2019-10-23', null, 1, SYSDATE(), 'AUTO INSERT'),(89, 2, 89, 126000, 'IN', '2019-10-24', null, 1, SYSDATE(), 'AUTO INSERT'),(90, 2, 90, 42000, 'IN', '2019-10-25', null, 1, SYSDATE(), 'AUTO INSERT'),(91, 2, 91, 249000, 'IN', '2019-10-26', null, 1, SYSDATE(), 'AUTO INSERT'),(92, 2, 92, 83000, 'IN', '2019-10-27', null, 1, SYSDATE(), 'AUTO INSERT'),(93, 2, 93, 618000, 'IN', '2019-10-28', null, 1, SYSDATE(), 'AUTO INSERT'),(94, 2, 94, 206000, 'IN', '2019-10-29', null, 1, SYSDATE(), 'AUTO INSERT'),(95, 2, 95, 63000, 'IN', '2019-10-30', null, 1, SYSDATE(), 'AUTO INSERT'),(96, 2, 96, 21000, 'IN', '2019-10-27', null, 1, SYSDATE(), 'AUTO INSERT'),(97, 2, 97, 120000, 'IN', '2019-10-28', null, 1, SYSDATE(), 'AUTO INSERT'),(98, 2, 98, 40000, 'IN', '2019-10-29', null, 1, SYSDATE(), 'AUTO INSERT'),(99, 2, 99, 603000, 'IN', '2019-10-30', null, 1, SYSDATE(), 'AUTO INSERT'),(100, 2, 100, 201000, 'IN', '2019-10-30', null, 1, SYSDATE(), 'AUTO INSERT'),(101, 2, 1, 72000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(102, 2, 2, 12000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(103, 2, 3, 112200, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(104, 2, 4, 18700, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(105, 2, 5, 129000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(106, 2, 6, 21500, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(107, 2, 7, 57600, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(108, 2, 8, 9600, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(109, 2, 9, 78000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(110, 2, 10, 13000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(111, 2, 11, 78000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(112, 2, 12, 13000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(113, 2, 13, 30000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(114, 2, 14, 5000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(115, 2, 15, 36000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(116, 2, 16, 6000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(117, 2, 17, 36000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(118, 2, 18, 3600, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(119, 2, 19, 36000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(120, 2, 20, 3600, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(121, 2, 21, 36000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(122, 2, 22, 3600, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(123, 2, 23, 93000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(124, 2, 24, 31000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(125, 2, 25, 75000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(126, 2, 26, 25000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(127, 2, 27, 35000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(128, 2, 28, 6500, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(129, 2, 29, 52000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(130, 2, 30, 9000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(131, 2, 31, 52000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(132, 2, 32, 9000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(133, 2, 33, 52000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(134, 2, 34, 9000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(135, 2, 35, 52000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(136, 2, 36, 9000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(137, 2, 37, 52000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(138, 2, 38, 9500, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(139, 2, 39, 46200, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(140, 2, 40, 7700, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(141, 2, 41, 72000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(142, 2, 42, 12000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(143, 2, 43, 72000, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(144, 2, 44, 12000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(145, 2, 45, 72000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(146, 2, 46, 12000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(147, 2, 47, 34800, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(148, 2, 48, 45000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(149, 2, 49, 36000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(150, 2, 50, 6000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(151, 2, 51, 39000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(152, 2, 52, 6500, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(153, 2, 53, 66000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(154, 2, 54, 11000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(155, 2, 55, 52800, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(156, 2, 56, 8800, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(157, 2, 57, 39000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(158, 2, 58, 6500, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(159, 2, 59, 192000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(160, 2, 60, 32000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(161, 2, 61, 96000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(162, 2, 62, 16000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(163, 2, 63, 96000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(164, 2, 64, 16000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(165, 2, 65, 132000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(166, 2, 66, 22000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(167, 2, 67, 372000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(168, 2, 68, 62000, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(169, 2, 69, 27600, 'OUT', '2019-10-14', null, 1, SYSDATE(), 'AUTO INSERT'),(170, 2, 70, 4600, 'OUT', '2019-10-23', null, 1, SYSDATE(), 'AUTO INSERT'),(171, 2, 71, 27600, 'OUT', '2019-10-24', null, 1, SYSDATE(), 'AUTO INSERT'),(172, 2, 72, 4600, 'OUT', '2019-10-25', null, 1, SYSDATE(), 'AUTO INSERT'),(173, 2, 73, 28800, 'OUT', '2019-10-26', null, 1, SYSDATE(), 'AUTO INSERT'),(174, 2, 74, 4800, 'OUT', '2019-10-27', null, 1, SYSDATE(), 'AUTO INSERT'),(175, 2, 75, 28800, 'OUT', '2019-10-28', null, 1, SYSDATE(), 'AUTO INSERT'),(176, 2, 76, 4800, 'OUT', '2019-10-29', null, 1, SYSDATE(), 'AUTO INSERT'),(177, 2, 77, 36600, 'OUT', '2019-10-30', null, 1, SYSDATE(), 'AUTO INSERT'),(178, 2, 78, 6100, 'OUT', '2019-10-13', null, 1, SYSDATE(), 'AUTO INSERT'),(179, 2, 79, 36600, 'OUT', '2019-10-14', null, 1, SYSDATE(), 'AUTO INSERT'),(180, 2, 80, 6100, 'OUT', '2019-10-15', null, 1, SYSDATE(), 'AUTO INSERT'),(181, 2, 81, 31200, 'OUT', '2019-10-16', null, 1, SYSDATE(), 'AUTO INSERT'),(182, 2, 82, 5200, 'OUT', '2019-10-17', null, 1, SYSDATE(), 'AUTO INSERT'),(183, 2, 83, 33600, 'OUT', '2019-10-18', null, 1, SYSDATE(), 'AUTO INSERT'),(184, 2, 84, 5600, 'OUT', '2019-10-19', null, 1, SYSDATE(), 'AUTO INSERT'),(185, 2, 85, 33600, 'OUT', '2019-10-20', null, 1, SYSDATE(), 'AUTO INSERT'),(186, 2, 86, 5600, 'OUT', '2019-10-21', null, 1, SYSDATE(), 'AUTO INSERT'),(187, 2, 87, 72000, 'OUT', '2019-10-22', null, 1, SYSDATE(), 'AUTO INSERT'),(188, 2, 88, 24000, 'OUT', '2019-10-23', null, 1, SYSDATE(), 'AUTO INSERT'),(189, 2, 89, 129000, 'OUT', '2019-10-24', null, 1, SYSDATE(), 'AUTO INSERT'),(190, 2, 90, 43000, 'OUT', '2019-10-25', null, 1, SYSDATE(), 'AUTO INSERT'),(191, 2, 91, 252000, 'OUT', '2019-10-26', null, 1, SYSDATE(), 'AUTO INSERT'),(192, 2, 92, 84000, 'OUT', '2019-10-27', null, 1, SYSDATE(), 'AUTO INSERT'),(193, 2, 93, 621000, 'OUT', '2019-10-28', null, 1, SYSDATE(), 'AUTO INSERT'),(194, 2, 94, 207000, 'OUT', '2019-10-29', null, 1, SYSDATE(), 'AUTO INSERT'),(195, 2, 95, 66000, 'OUT', '2019-10-30', null, 1, SYSDATE(), 'AUTO INSERT'),(196, 2, 96, 22000, 'OUT', '2019-10-27', null, 1, SYSDATE(), 'AUTO INSERT'),(197, 2, 97, 123000, 'OUT', '2019-10-28', null, 1, SYSDATE(), 'AUTO INSERT'),(198, 2, 98, 41000, 'OUT', '2019-10-29', null, 1, SYSDATE(), 'AUTO INSERT'),(199, 2, 99, 606000, 'OUT', '2019-10-30', null, 1, SYSDATE(), 'AUTO INSERT'),(200, 2, 100, 202000, 'OUT', '2019-10-30', null, 1, SYSDATE(), 'AUTO INSERT');

DELIMITER ;
DROP TRIGGER IF EXISTS product_packing_price_trig_before_insert;
CREATE TRIGGER product_packing_price_trig_before_insert
    BEFORE INSERT ON `product_packing_price`
    FOR EACH ROW
BEGIN
    SELECT -1 INTO @oldId;
    SELECT NVL(id, 0) INTO @oldId FROM product_packing_price
    WHERE (NEW.id is NULL or id <> NEW.id)
          AND currency_id = NEW.currency_id
          AND product_packing_id = NEW.product_packing_id
          AND sale_type = NEW.sale_type
          AND GREATEST(from_date, NEW.from_date) <= 
                      LEAST(COALESCE(to_date, STR_TO_DATE('31/12/9999','%d/%m/%Y')),
                            COALESCE(NEW.to_date, STR_TO_DATE('31/12/9999','%d/%m/%Y')))
    LIMIT 1;
    IF @oldId > 0
    THEN
        SELECT code INTO @currencyCode FROM currency WHERE id = NEW.currency_id LIMIT 1;
        SELECT code INTO @productPackingCode FROM product_packing WHERE id = NEW.product_packing_id LIMIT 1;
        SET @MESSAGE_TEXT = CONCAT('PRICE CANNOT CHEATING...!!! INSERT ', '( ', @oldId, ' - ', NEW.id, ' )',
                                   'currency_id: ', NEW.currency_id, ' - ', @currencyCode , ', ',
                                   'product_packing_id: ', NEW.product_packing_id, ' - ', @productPackingCode, ', ',
                                   'sale_type: ', NEW.sale_type, ', ',
                                   'from_date: ', NEW.from_date, ', '
                                  );
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @MESSAGE_TEXT;
    END IF;
END;
DELIMITER;
-- SELECT * FROM product_packing_price WHERE id in (5320, 5337);
DELIMITER ;
DROP TRIGGER IF EXISTS product_packing_price_trig_before_update;
CREATE TRIGGER product_packing_price_trig_before_update
    BEFORE UPDATE ON `product_packing_price`
    FOR EACH ROW
BEGIN
    SELECT -1 INTO @oldId;
    SELECT NVL(id, 0) INTO @oldId FROM product_packing_price
    WHERE (NEW.id is NULL or id <> NEW.id)
          AND currency_id = NEW.currency_id
          AND product_packing_id = NEW.product_packing_id
          AND sale_type = NEW.sale_type
          AND GREATEST(from_date, NEW.from_date) <= 
                      LEAST(COALESCE(to_date, STR_TO_DATE('31/12/9999','%d/%m/%Y')),
                            COALESCE(NEW.to_date, STR_TO_DATE('31/12/9999','%d/%m/%Y')))
    LIMIT 1;
    IF @oldId > 0
    THEN
        SELECT code INTO @currencyCode FROM currency WHERE id = NEW.currency_id LIMIT 1;
        SELECT code INTO @productPackingCode FROM product_packing WHERE id = NEW.product_packing_id LIMIT 1;
        SET @MESSAGE_TEXT = CONCAT('PRICE CANNOT CHEATING...!!! UPDATE ', '( ', @oldId, ' - ', NEW.id, ' )',
                                   'currency_id: ', NEW.currency_id, ' - ', @currencyCode , ', ',
                                   'product_packing_id: ', NEW.product_packing_id, ' - ', @productPackingCode, ', ',
                                   'sale_type: ', NEW.sale_type, ', ',
                                   'from_date: ', NEW.from_date, ', '
                                  );
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @MESSAGE_TEXT;
    END IF;
END;
DELIMITER;



create table product_image (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  product_id bigint(20) NOT NULL,
  default_image bit(1) default null,
  image_crop bit(1) default null,
  image_type int(11) default null,
  image varchar(255) default null,
  image_url varchar(255) default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_productimage_product FOREIGN KEY (product_id) REFERENCES product(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table product_image_description (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  product_image_id bigint(20) NOT NULL,
  language_id bigint(20) NOT NULL,
  name varchar(120) default null,
  title varchar(100) default null,
  description longtext,
  alt_tag varchar(100),
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_productimagedescription_productimage FOREIGN KEY (product_image_id) REFERENCES product_image(id),
  CONSTRAINT fk_productimagedescription_language FOREIGN KEY (language_id) REFERENCES language(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table category (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255) NOT NULL,
  image varchar(255) NOT NULL,
  sort_order int(11) default null,
  parent_id bigint(20) default null,
  status bit(1) default null COMMENT '0: không hoạt động, 1: hoạt động',
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_category_category FOREIGN KEY (parent_id) REFERENCES category(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table category_description (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  language_id bigint(20) NOT NULL,
  category_id bigint(20) NOT NULL,
  name varchar(255) default null,
  title varchar(255) default null,
  description longtext default null,
  url_image longtext default null,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_categorydescription_category FOREIGN KEY (category_id) REFERENCES category(id),
  CONSTRAINT fk_categorydescription_language FOREIGN KEY (language_id) REFERENCES language(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table product_category (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  product_id bigint(20) NOT NULL,
  category_id bigint(20) NOT NULL,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_productcategory_category FOREIGN KEY (category_id) REFERENCES category(id),
  CONSTRAINT fk_productcategory_product FOREIGN KEY (product_id) REFERENCES product(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

create table product_digital (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  product_id bigint(20) NOT NULL,
  file_name longtext,
  create_date datetime default null,
  create_user varchar(255) default null,
  update_date datetime default null,
  update_user varchar(255) default null,
  PRIMARY KEY (id),
  CONSTRAINT fk_productdigital_product FOREIGN KEY (product_id) REFERENCES product(id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

commit;

