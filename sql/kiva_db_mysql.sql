/*

Create table to store historical Kiva data, as well country information

*/

drop schema if exists kiva;
create scheme kiva;

use kiva;
create table lender (
    lender_id int not null primary key,
    permanent_name varchar(255) not null,
    display_name varchar(255),
    city varchar(255),
    state varchar(255),
    country_code varchar(255),
    member_since datetime not null,
    key (country_code),
    key (member_since)
);

create table loan (
    loan_id int not null primary key,
    loan_name varchar(255),
    loan_amount float not null,
    gender enum('f', 'm', 'u') not null,
    country_code char(2),
    posted_time datetime not null,
    key(country_code),
    key(posted_time)
);

create table loan_lender(
    loan_id int not null,
    lender_id int not null,
    primary key(loan_id, lender_id),
    key(lender_id)
);

create table country (
    country_code char(2) primary key,
    country_name varchar(255) not null,
    income_level varchar(255),
    longitude float,
    latitude float
);

create table country_gdp (
    country_code char(2),
    year int not null,
    gdp int not null,
    primary key(country_code, year)
);
