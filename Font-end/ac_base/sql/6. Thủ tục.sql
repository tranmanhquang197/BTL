DROP PROCEDURE IF EXISTS logistics.printPO;
CREATE PROCEDURE logistics.`printPO`( p_po_id INT )
BEGIN  
  select p.sku as article,
         p.code as barcode,
         NVL(pd1.name, p.name) as description,
         pd.quantity as quantity,
         pt.quantity as packsize, 
         (pd.quantity * pt.quantity) as quantityorder,
         ppud.name as uom,
         ppp.price as unitprice,
         (pd.quantity * ppp.price) as amount,
         pd.vat as vat,
         (pd.quantity * ppp.price * pd.vat)/100 as vatamount,
         (pd.quantity * ppp.price * (100 + pd.vat))/100 as totaliclvat
  from po_detail pd
       join product_packing_price ppp on pd.product_packing_price_id = ppp.id
       join product_packing pp on pd.product_packing_id = pp.id and ppp.product_packing_id = pp.id
       join product p on pd.product_id = p.id and pp.product_id = p.id
       join packing_type pt ON pp.packing_type_id = pt.id
       join product_packing_unit_description ppud ON pp.uom = ppud.product_packing_unit_id
                 AND ppud.language_id = (select id from language where code = 'EN' LIMIT 1)
       left join product_description pd1 on pd1.product_id = p.id
                 and pd1.language_id = (select id from language where code = 'EN' LIMIT 1)
  where pd.po_id = p_po_id;
END;


DROP FUNCTION IF EXISTS calcDistanceByLatLng;
DELIMITER //
CREATE FUNCTION calcDistanceByLatLng(lat1 DECIMAL(10, 8), lng1 DECIMAL(11, 8), lat2 DECIMAL(10, 8), lng2 DECIMAL(11, 8))
RETURNS DECIMAL DETERMINISTIC
BEGIN
  DECLARE distance_in_km DECIMAL;
  SET distance_in_km = 111.111 *
        DEGREES(ACOS(LEAST(COS(RADIANS(lat1))
         * COS(RADIANS(lat2))
         * COS(RADIANS(lng1 - lng2))
         + SIN(RADIANS(lat1))
         * SIN(RADIANS(lat2)), 1.0)));
  RETURN distance_in_km;
END; //
DELIMITER ;

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
CREATE FUNCTION first_day(dt DATETIME) RETURNS date
BEGIN
    RETURN DATE(DATE_ADD(DATE_ADD(LAST_DAY(dt), INTERVAL 1 DAY), INTERVAL - 1 MONTH));
END