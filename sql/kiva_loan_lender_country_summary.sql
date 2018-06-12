/*

Create summary table 

*/

use kiva;

SET GLOBAL innodb_buffer_pool_size=402653184;

drop table if exists loan_lender_country_summary;
create table loan_lender_country_summary as 
select
   date(posted_time) as posted_date,
   loan.country_code,
   lender.country_code,
   count(distinct loan.loan_id) loan_count,
   count(distinct ll.lender_id) lender_count,
   sum(loan.loan_amount) loan_amount
from loan
inner join loan_lender as ll on ll.loan_id = loan.loan_id
inner join lender on lender.lender_id = ll.lender_id
group by 1,2, 3, 4;

alter table loan_lender_country_summary add key(posted_date);