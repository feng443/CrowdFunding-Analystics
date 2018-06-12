/*

Create summary table for scatter chart.

*/

SET GLOBAL innodb_buffer_pool_size=402653184;

drop table if exists gdp_amount_gender_summary;
create table gdp_amount_gender_summary as 
select
	l.country_code,
	year(posted_time) as year,
    avg(loan_amount) avg_loan_amount,
    sum(loan_amount) total_loan_amount,
    count(*) loan_count
from loan as l
group by 1,2;

alter table gdp_amount_gender_summary add key(year);
alter table gdp_amount_gender_summary add key(country_code);
