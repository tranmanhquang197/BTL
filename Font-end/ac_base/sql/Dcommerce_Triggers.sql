DELIMITER ;
DROP TRIGGER IF EXISTS packing_price_trig_before_insert;
CREATE TRIGGER packing_price_trig_before_insert
    BEFORE INSERT ON `packing_price`
    FOR EACH ROW
BEGIN
    SELECT NVL(packing_price_id, 0) INTO @oldId FROM packing_price
    WHERE (NEW.packing_price_id is NULL or packing_price_id <> NEW.packing_price_id)
          AND currency_code = NEW.currency_code
          AND packing_product_id = NEW.packing_product_id
          AND price_type = NEW.price_type
          AND NOT (from_date > coalesce(NEW.to_date, STR_TO_DATE('01/01/1900','%d/%m/%Y'))
              OR coalesce(to_date, STR_TO_DATE('01/01/1900','%d/%m/%Y')) < NEW.from_date)
    LIMIT 1;
    IF @oldId > 0
    THEN
        SELECT code INTO @productPackingCode FROM packing_product WHERE packing_product_id = NEW.packing_product_id LIMIT 1;
        SET @MESSAGE_TEXT = CONCAT('PRICE CANNOT CHEATING...!!! INSERT ', '( ', @oldId, ' - ', NEW.packing_price_id, ' )',
                                   'currency_code: ', NEW.currency_code , ', ',
                                   'packing_product_id: ', NEW.packing_product_id, ' - ', @productPackingCode, ', ',
                                   'price_type: ', NEW.price_type, ', ',
                                   'from_date: ', NEW.from_date, ', '
                                  );
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @MESSAGE_TEXT;
    END IF;
END;
DELIMITER;

DELIMITER ;
DROP TRIGGER IF EXISTS packing_price_trig_before_update;
CREATE TRIGGER packing_price_trig_before_update
    BEFORE UPDATE ON `packing_price`
    FOR EACH ROW
BEGIN
    SELECT NVL(packing_price_id, 0) INTO @oldId FROM packing_price
    WHERE (NEW.packing_price_id is NULL or packing_price_id <> NEW.packing_price_id)
          AND currency_code = NEW.currency_code
          AND packing_product_id = NEW.packing_product_id
          AND price_type = NEW.price_type
          AND (from_date > coalesce(NEW.to_date, STR_TO_DATE('01/01/1900','%d/%m/%Y'))
              OR coalesce(to_date, STR_TO_DATE('01/01/1900','%d/%m/%Y')) < NEW.from_date)
    LIMIT 1;
    IF @oldId > 0
    THEN
        SELECT code INTO @productPackingCode FROM packing_product WHERE packing_product_id = NEW.packing_product_id LIMIT 1;
        SET @MESSAGE_TEXT = CONCAT('PRICE CANNOT CHEATING...!!! UPDATE ', '( ', @oldId, ' - ', NEW.packing_price_id, ' )',
                                   'currency_code: ', NEW.currency_code , ', ',
                                   'packing_product_id: ', NEW.packing_product_id, ' - ', @productPackingCode, ', ',
                                   'price_type: ', NEW.price_type, ', ',
                                   'from_date: ', NEW.from_date, ', '
                                  );
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = @MESSAGE_TEXT;
    END IF;
END;
DELIMITER;

select * from packing_product where code = 'P1000043';

update packing_price set packing_product_id = packing_product_id where packing_price_id = 1273;
select * from packing_price where packing_product_id = 307;

------------------------- manufacturer
update manufacturer set IS_SYNCHRONIZATION = 0 where IS_SYNCHRONIZATION is null;

DELIMITER //
DROP TRIGGER IF EXISTS manufacturer_trig_before_insert//
CREATE TRIGGER manufacturer_trig_before_insert
    BEFORE INSERT ON `manufacturer`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS manufacturer_trig_before_update//
CREATE TRIGGER manufacturer_trig_before_update
    BEFORE UPDATE ON `manufacturer`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;

------------------------- manufacturer_description
update manufacturer_description set IS_SYNCHRONIZATION = 0 where IS_SYNCHRONIZATION is null;

DELIMITER //
DROP TRIGGER IF EXISTS manufacturer_description_trig_before_insert//
CREATE TRIGGER manufacturer_description_trig_before_insert
    BEFORE INSERT ON `manufacturer_description`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS manufacturer_description_trig_before_update//
CREATE TRIGGER manufacturer_description_trig_before_update
    BEFORE UPDATE ON `manufacturer_description`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;

------------------------- product_type
update product_type set IS_SYNCHRONIZATION = 0 where IS_SYNCHRONIZATION is null;

DELIMITER //
DROP TRIGGER IF EXISTS product_type_trig_before_insert//
CREATE TRIGGER product_type_trig_before_insert
    BEFORE INSERT ON `product_type`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS product_type_trig_before_update//
CREATE TRIGGER product_type_trig_before_update
    BEFORE UPDATE ON `product_type`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;

------------------------- product
update product set IS_SYNCHRONIZATION = 0 where IS_SYNCHRONIZATION is null;

DELIMITER //
DROP TRIGGER IF EXISTS product_trig_before_insert//
CREATE TRIGGER product_trig_before_insert
    BEFORE INSERT ON `product`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS product_trig_before_update//
CREATE TRIGGER product_trig_before_update
    BEFORE UPDATE ON `product`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;

------------------------- product_description
update product_description set IS_SYNCHRONIZATION = 0 where IS_SYNCHRONIZATION is null;

DELIMITER //
DROP TRIGGER IF EXISTS product_description_trig_before_insert//
CREATE TRIGGER product_description_trig_before_insert
    BEFORE INSERT ON `product_description`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS product_description_trig_before_update//
CREATE TRIGGER product_description_trig_before_update
    BEFORE UPDATE ON `product_description`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;

------------------------- packing_type
update packing_type set IS_SYNCHRONIZATION = 0 where IS_SYNCHRONIZATION is null;

DELIMITER //
DROP TRIGGER IF EXISTS packing_type_trig_before_insert//
CREATE TRIGGER packing_type_trig_before_insert
    BEFORE INSERT ON `packing_type`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS packing_type_trig_before_update//
CREATE TRIGGER packing_type_trig_before_update
    BEFORE UPDATE ON `packing_type`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;

------------------------- packing_product
update packing_product set IS_SYNCHRONIZATION = 0 where IS_SYNCHRONIZATION is null;

DELIMITER //
DROP TRIGGER IF EXISTS packing_product_trig_before_insert//
CREATE TRIGGER packing_product_trig_before_insert
    BEFORE INSERT ON `packing_product`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS packing_product_trig_before_update//
CREATE TRIGGER packing_product_trig_before_update
    BEFORE UPDATE ON `packing_product`
    FOR EACH ROW
BEGIN
    SET NEW.IS_SYNCHRONIZATION = 0;
END//
DELIMITER ;












DELIMITER //
DROP TRIGGER IF EXISTS product_description_trig_before_insert//
CREATE TRIGGER product_description_trig_before_insert
    BEFORE INSERT ON `product_description`
    FOR EACH ROW
BEGIN
    UPDATE PRODUCT SET IS_SYNCHRONIZATION = 0 WHERE PRODUCT_ID = NEW.PRODUCT_ID;
END//
DELIMITER ;


DELIMITER //
DROP TRIGGER IF EXISTS product_description_trig_before_update//
CREATE TRIGGER product_description_trig_before_update
    BEFORE UPDATE ON `product_description`
    FOR EACH ROW
BEGIN
    UPDATE PRODUCT SET IS_SYNCHRONIZATION = 0 WHERE PRODUCT_ID = NEW.PRODUCT_ID;
END//
DELIMITER ;

DELIMITER //
DROP TRIGGER IF EXISTS packing_product_trig_after_update//
CREATE TRIGGER packing_product_trig_after_update
    AFTER UPDATE ON `packing_product`
    FOR EACH ROW
BEGIN
  IF NEW.ORG_PRICE is not null 
     AND NOT EXISTS(SELECT 1 FROM packing_price
                    WHERE packing_product_id = NEW.packing_product_id
                          AND price_type = 1 AND from_date >= CURRENT_DATE()
                          AND (to_date IS NULL OR CURRENT_DATE() <= to_date))
  THEN
    INSERT INTO packing_price (packing_product_id, price, from_date, to_date, price_type, currency_code, is_synchronization)
                VALUES (NEW.packing_product_id, NEW.ORG_PRICE, CURRENT_DATE() , null, 1, 'VND', 0);
  END IF;
END//
DELIMITER ;



select * from language;
select * from currency;
select * from manufacturer;
select * from manufacturer_description;
select * from product_type;
select * from distributor;

update manufacturer set IS_SYNCHRONIZATION = 0;
update product_type set IS_SYNCHRONIZATION = 0;
update Packing_Type set IS_SYNCHRONIZATION = 0;
update product set IS_SYNCHRONIZATION = 0;
update packing_product set IS_SYNCHRONIZATION = 0;
update packing_price set IS_SYNCHRONIZATION = 0;
update distributor set IS_SYNCHRONIZATION = 0;

SELECT * FROM packing_price
                    WHERE packing_product_id = 10
                          AND price_type = 1 AND from_date >= CURRENT_DATE()
                          AND (to_date IS NULL OR CURRENT_DATE() <= to_date);
select * from packing_product;
select * from product where distributor_id is not null;

select CODE, count(PACKING_PRODUCT_ID) from packing_product group by CODE 
having count(PACKING_PRODUCT_ID) > 1;

select * from packing_price where (packing_product_id, price_type, date(from_date)) = (158, 2, STR_TO_DATE('31/12/2019', '%d/%m/%Y'));
select * from packing_price where date(from_date) = STR_TO_DATE('31/12/2019', '%d/%m/%Y');
select STR_TO_DATE('31/12/2019', '%d/%m/%Y');


SELECT ppp.* FROM product_packing_price ppp WHERE (packing_product_id, price_type, date(from_date)) = (9, 1, STR_TO_DATE('13/12/2019', '%d/%m/%Y'));
