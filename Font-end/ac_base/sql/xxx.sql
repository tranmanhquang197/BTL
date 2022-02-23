select * from store_product_packing where store_id = 1;

SELECT spp.store_id + spp.product_packing_id id, spp.store_id,  spp.product_packing_id, spp.product_id, sum(spp.total_quantity),
       null expire_date, null create_date, null create_user, null update_date, null update_user
FROM store_product_packing spp JOIN product_packing pp ON pp.id = spp.product_packing_id  AND (? is null OR LOWER(pp.code) like LOWER(CONCAT('%',?,'%')) OR LOWER(pp.name) like LOWER(CONCAT('%',?,'%')) )
WHERE spp.store_id = ? AND spp.product_packing_id NOT IN (?)  GROUP BY spp.store_id, spp.product_packing_id, spp.product_id  limit ?;

select * from store_product_packing_detail;

select * from import_statement;

select * from export_statement;

select * from pallet;

select * from pallet_detail;

select * from import_po_detail_pallet where pallet_detail_id not in (select id from pallet_detail);

delete from pallet_detail where id not in (select pallet_detail_id from import_po_detail_pallet);

select * from import_po_detail_pallet;

select * from merchant_order;

select * from product_packing;

select * from product_packing_price where product_packing_id in (69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86);

SELECT DISTINCT pp.*  
FROM product_packing pp join product p on pp.product_id = p.id 
     join manufacturer m on p.manufacturer_id = m.id join product_packing_price ppp on pp.id = ppp.product_packing_id
     left join product_description pd on pd.product_id = p.id left join product_type pt on p.product_type_id = pt.id
WHERE pt.status = 1 and p.available = 1 -- and pp.id not in (?) 
      and m.id = 5 
      -- and ( ? is null or     LOWER(pt.code) like LOWER(CONCAT('%',?,'%')) or LOWER(pt.name) like LOWER(CONCAT('%',?,'%'))  or LOWER(p.code) like LOWER(CONCAT('%',?,'%')) or LOWER(p.name) like LOWER(CONCAT('%',?,'%'))  or LOWER(pp.code) like LOWER(CONCAT('%',?,'%')) or LOWER(pp.name) like LOWER(CONCAT('%',?,'%'))  or LOWER(m.code) like LOWER(CONCAT('%',?,'%')) or LOWER(m.name) like LOWER(CONCAT('%',?,'%'))  or LOWER(pd.code) like LOWER(CONCAT('%',?,'%')) or LOWER(pd.name) like LOWER(CONCAT('%',?,'%')) )
ORDER BY p.sort_order, p.is_hot, p.is_popular, p.quantity_ordered, p.code;

SELECT DISTINCT pp.*
  FROM product_packing pp
       JOIN product p ON pp.product_id = p.id
--        JOIN manufacturer m ON p.manufacturer_id = m.id
       LEFT JOIN product_description pd ON pd.product_id = p.id
       LEFT JOIN product_type pt ON p.product_type_id = pt.id
       JOIN product_packing_price ppp ON pp.id = ppp.product_packing_id
 WHERE     pt.status = 1
       AND p.available = 1
       AND pp.id NOT IN (-1)
--        AND m.id = 1
--        AND (   ? IS NULL
--             OR LOWER(pt.code) LIKE LOWER(CONCAT('%', ?, '%'))
--             OR LOWER(pt.name) LIKE LOWER(CONCAT('%', ?, '%'))
--             OR LOWER(p.code) LIKE LOWER(CONCAT('%', ?, '%'))
--             OR LOWER(p.name) LIKE LOWER(CONCAT('%', ?, '%'))
--             OR LOWER(m.code) LIKE LOWER(CONCAT('%', ?, '%'))
--             OR LOWER(m.name) LIKE LOWER(CONCAT('%', ?, '%'))
--             OR LOWER(pd.code) LIKE LOWER(CONCAT('%', ?, '%'))
--             OR LOWER(pd.name) LIKE LOWER(CONCAT('%', ?, '%')))
ORDER BY p.sort_order,
         p.is_hot,
         p.is_popular,
         p.quantity_ordered,
         p.code;

select * 
from po
where status = 0 and (
  (status = 0 and create_date >= Date(STR_TO_DATE('12,08,2019','%d,%m,%Y')))
  or
  (status = 1 and printed_date = Date(STR_TO_DATE('13,08,2019','%d,%m,%Y')))
  or
  (status = 2 and import_date = Date(STR_TO_DATE('14,08,2019','%d,%m,%Y')))
);

select * from po_detail;

select
        *  
    FROM
        po 
    WHERE
        (
            '' is null 
            or LOWER(manufacturer_code) like LOWER(CONCAT('%','','%'))  
            or LOWER(manufacturer_name) like LOWER(CONCAT('%','','%')) 
            or LOWER(code) like LOWER(CONCAT('%','','%'))  
            or LOWER(description) like LOWER(CONCAT('%','','%')) 
        )  
        and status = 0 and (
            (
                0 = 0 
                and create_date >= Date(STR_TO_DATE('14,08,2019','%d,%m,%Y')) 
                and create_date < Date(DATE_ADD(STR_TO_DATE('14,08,2019','%d,%m,%Y'), INTERVAL 1 DAY))
            )    
            or (
                0 = 1 
                and printed_date >= Date(STR_TO_DATE('13,08,2019','%d,%m,%Y')) 
                and printed_date < Date(DATE_ADD(STR_TO_DATE('13,08,2019','%d,%m,%Y'), INTERVAL 1 DAY))
            )    
            or (
                0 = 2 
                and import_date >= Date(STR_TO_DATE('13,08,2019','%d,%m,%Y')) 
                and import_date < Date(DATE_ADD(STR_TO_DATE('13,08,2019','%d,%m,%Y'), INTERVAL 1 DAY))
            ) 
        )  
    order by
        create_date,
        printed_date,
        import_date,
        code;
        
select * from po;
select * from import_po;
        
select * from repacking_planning;
select * from repacking_planning_detail;
select * from repacking_planning_detail_pallet;
select * from repacking_planning_detail_repacked;

select * from pallet_detail;

select rp.code, rp.description, rp.planning_date, rp.repacked_date,
       rpd.product_packing_id, rpd.expire_date, rpd.quantity,
       rpdr.pallet_detail_id, quantity
from repacking_planning rp
	   join repacking_planning_detail rpd on rpd.repacking_planning_id = rp.id
     join repacking_planning_detail_pallet rpdl on rpdl.repacking_planning_detail_id = rpd.id
	   join repacking_planning_detail_repacked rpdr on rpdr.repacking_planning_detail_id = rpd.id
where rp.id = 19;

call printPO(30);


call calcDistanceByLatLng(21.00566000, 105.85481100, 21.01716200, 105.78370900);

select calcDistanceByLatLng(21.00566000, 105.85481100, s.lat, s.lng), s.address, s.lat, s.lng, nvl(spp.total_quantity, 0);

SELECT spp.*
  FROM store_product_packing spp
       JOIN store s ON s.id = spp.store_id
       JOIN product_packing pp ON pp.id = spp.product_packing_id
 WHERE     calcDistanceByLatLng(21.00566,
                                105.85481,
                                s.lat,
                                s.lng) < 6
       AND (null IS NULL OR pp.code = null)
 LIMIT 20;


select pp.code, sum(modx.quantity), DATE(mo.order_date)
from merchant_order_detail modx
     join merchant_order mo ON mo.id = modx.merchant_order_id
     join product_packing pp ON pp.id = modx.product_packing_id
group by pp.code, DATE(mo.order_date)
order by DATE(mo.order_date);

SELECT distinct es.* FROM export_statement es 
JOIN store_user su ON LOWER(su.username) = LOWER('Fc_admin') AND (es.from_store_id = su.store_id OR es.to_store_id = su.store_id) 
WHERE ('' is null OR LOWER(es.code) like LOWER(CONCAT('%','','%'))) AND (0 is null OR es.status = 0);

SELECT cast_to_bit(COUNT(su.id))
  FROM store_user su
 WHERE     su.username = 'fc_admin'
       AND (   su.store_id = 11
            OR EXISTS
                  (SELECT 1
                     FROM store ps
                    WHERE ps.provide_store_id = su.store_id AND ps.id = 11));

select * from store s where s.id in (1,2,3)
and exists(select 1 from merchant_order mo where mo.from_store_id = s.id and mo.status = 0);

select * from merchant_order where status = 0;
