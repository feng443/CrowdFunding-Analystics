# Rutgers Data Science Bootcamp - Project 2
Mapping the Crowd Funding

Chan * Shikha *Philips

**TODO**: 

- PPT:
 - Flow Map with ref to: https://github.com/jwasilgeo/Leaflet.Canvas-Flowmap-Layer
 - Clean up Chord and make it more modular




-----------------------------------------


As a warm hearted philanthropist, and a windfall from my recent company outing drawing, I would like to put my $500 into good use.

When Googling, I found Kiva, which is a crowdfunding company provide finance to people who want to expand their business to get better education in developing countries.

I also found that Kiva provide an excellent API (https://build.kiva.org/), I would like take advantage of this finding, combined with newly acquired Python, D3, MySQL and MongoDB skill set to find where should I extend my good will.

In order to achieve that, I will map the lender and loans in following views, with ability to be filtered by gender, use of loan etc.

1. Map view of loans (Philips)
2. Scatter chart show correlation of average loan amount, per capita GDP, loan volume and gender. 
3. A sankey chart showing relationship between lender and borrowers with load total amount and volume

Time permit, we will also add following:

Change of above metrics over time
Add real time lenders and loans on Map layers 

Other Data sources: 
country code, country GDP, World Bank API.

# Set up instructions

## Database

To export country and summary tables:
```bash
mysqldump -u chan --password=*ORkM}c_3PqY2if kiva country country_gdp > sql/mysql_dump_country.sql
mysqldump -u chan --password=*ORkM}c_3PqY2if kiva monthly_loan_summary > sql/mysql_dump_monthly_loan_summary.sql
mysqldump -u chan --password=*ORkM}c_3PqY2if kiva monthly_loan_lender_summary > sql/mysql_dump_monthly_loan_lender_summary.sql
```

To import country and summary tables:

```bash
mysql -u chan -p < sql/mysql_dump*.sql
```

Or use MySQL workbench.

1. Set default schema to kiva. Create kiva schema if not exists.
2. Load and run sql/mysql_dump*.sql

## Flask App

```bash
python app.py

or 

SET FLASK_APP=app.py
flask run

```

TODO: Break model/view

## HTML Templates
under /templats/

## JavaScript

under statis/js

## CSS

under static/css

