/*

Create table to store historical Kiva data, as well country information

*/
drop table if exists lender;
create table lender (
    lender_id int not null,
    permanent_name varchar(255) not null,
    display_name varchar(255),
    city varchar(255),
    state varchar(255),
    country_code varchar(255),
    member_since datetime not null
);
create unique index lender_idx on lender(lender_id);
create index lender_cc_idx on lender(country_code);
create index lender_ms_idx on lender(member_since);

drop table if exists loan;
create table loan (
    loan_id int not null,
    loan_name varchar(255),
    loan_amount float not null,
    gender varchar(1) not null,
    country_code char(2),
    posted_time datetime not null
);
create unique index loan_idx on loan(loan_id);
create index loand_country_code_idx on loan(country_code)
create index loan_time_idx on loan(posted_time);

create table loan_lender(
    loan_id int not null,
    lender_id int not null
); 
create unique index load_lender_idx on loan_lender(loan_id, lender_id);
create index loan_lender_idx1 on loan_lender(loan_id);
create index loan_lender_idx2 on loan_lender(lender_id);

create table country (
    country_code char(2),
    country_name varchar(255) not null,
    income_level varchar(255),
    longitude float,
    latitude float
);
create unique index country_idx on country(country_code);

create table country_gdp (
    country_code char(2),
    year int not null,
    gdp int not null
);
create unique index country_gdp_idx on country_gdp(country_code, year);
