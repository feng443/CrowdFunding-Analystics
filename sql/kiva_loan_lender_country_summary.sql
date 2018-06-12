/*

Create summary table 

Note: total amount is not calculated as it is impossible to break up loan amount by lender. 
    Simply sum() will cause same amount be counted multiple times, thus incorrect.
    The visulization will show number of loan or lender counts.

*/

use kiva;

SET GLOBAL innodb_buffer_pool_size=402653184;

drop table if exists daily_loan_lender_summary;
create table daily_loan_lender_summary as 
select
   date(posted_time) as posted_date,
   loan.country_code as loan_country_code,
   lender.country_code as lender_country_code,
   count(distinct loan.loan_id) loan_count,
   count(distinct ll.lender_id) lender_count
from loan
inner join loan_lender as ll on ll.loan_id = loan.loan_id
inner join lender on lender.lender_id = ll.lender_id
group by 1,2, 3;

alter table daily_loan_lender_summary add key(posted_date);