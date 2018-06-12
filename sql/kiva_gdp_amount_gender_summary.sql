/*

Create summary table for scatter chart.

*/

SET GLOBAL innodb_buffer_pool_size=402653184;

drop table if exists daily_loan_summary;
create table daily_loan_summary as 
select
    country_code,
    gender,
    date(posted_time) as posted_date,
    sum(loan_amount) loan_amount,
    count(*) loan_count
from loan
group by 1,2;

alter table daily_loan_summary add key(posted_date);
alter table daily_loan_summary add key(country_code);

drop table if exists monthly_loan_summary;
create table monthly_loan_summary as 
select
    country_code,
    gender,
    last_day(posted_time) as last_day_of_month,
    sum(loan_amount) loan_amount,
    count(*) loan_count
from loan
group by 1,2;

alter table monthly_loan_summary add key(last_day_of_month);
alter table monthly_loan_summary add key(country_code);
