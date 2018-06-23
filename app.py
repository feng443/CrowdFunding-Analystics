# Flask App to provide data end points

from flask import Flask, render_template, jsonify, make_response
from config import MYSQL_URL
from flask_sqlalchemy import SQLAlchemy

import re
import pandas as pd
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.sql import select
import pymysql

pymysql.install_as_MySQLdb()
from config import MYSQL_URL
engine = create_engine(MYSQL_URL, encoding='utf-8')

# @TODO: Initialize your Flask app here
# CODE GOES HERE
app = Flask(__name__)
#app.config['SQLALCHEMY_DATABASE_URI'] = MYSQL_URL
#db = SQLAlchemy(app)

metadata = MetaData()
country = Table('country', metadata, autoload=True, autoload_with=engine)
country_gdp = Table('country_gdp', metadata, autoload=True, autoload_with=engine)
monthly_loan_summary = Table('monthly_loan_summary', metadata, autoload=True, autoload_with=engine)
monthly_loan_lender_summary =  Table('monthly_loan_lender_summary', metadata, autoload=True, autoload_with=engine)

year_re = re.compile('^\d{4}$')

#from .models import Country
"""
class Country(db.Model):
    __tablename__ = 'country'

    country_code = db.Column(db.String(255), primary_key=True)
    country_name = db.Column(db.String(255))
    income_level = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    region = db.Column(db.String(255))

    def __repr__(self):
        return '<Country %r>' % (self.name)

"""

# @TODO:  Create a route and view function that takes in a list of dictionaries and renders an index.html template
# CODE GOES HERE

@app.route('/')
def index():
    api = """
    <table border = 1>
    <thead> <tr> <th>URL</th><th>Purpose</th> </tr></thead>
    <tr><td><a href='/data/country/'>/data/country/&lt;CC&gt;</a>. </td><td>CC is optional. All countries if empty.</a></td><tr>
    <tr><td><a href='/data/country_gdp/'>/data/country_gdp/&lt;CC|year&gt;.</a></td><td> If pass four digits will treat as year, otherwise CC. All if empty </td></tr>
    <tr><td> <a href='/data/monthly_loan_summary/'>/data/monthly_loan_summary/&lt;year&gt;/&lt;month&gt;</a></td><td>Year or month is reaquired as data size is large.</td></tr>
    <tr><td><a href='/data/monthly_loan_lender_summary/2016/12'>/data/monthly_loan_lender_summary/&lt;year&gt;/&lt;month&gt;. </a></td><td>Year or month is reaquired as data size is large.</td></tr>
    <tr><td><a href='/data/year_month/'>/data/year_month/</a></td><td>Return list of year and month in the data</td></tr>
    <tr><td><a href='/data/year/'>/data/year/</a></td><td>Return list of year and month in the data</td></tr>
    <tr><td><a href='/data/scatter/2016/f'>/data/scatter/</a></td><td>Return list of year and month in the data</td></tr>
    <tr><td><a href='/data/chord/2016'>/data/chord/</a></td><td>Return list of year and month in the data</td></tr>
    <tr><td><a href='/data/region'>/data/region></td><td>Return list of regions</td></tr>
    </table>
        
    """
    return render_template('index.html', api=api)

# Technique to handle return single country or all countries with same URL

@app.route('/data/country', defaults={'cc': ''})
@app.route('/data/country/', defaults={'cc': ''})
@app.route('/data/country/<cc>')
def data_country(cc):
    #for row in db.session.query(Country):
    #    print(row.country_code)
    q = country.select()
    if cc:
        q = q.where(country.c.country_code == cc)
    df = pd.read_sql(q, engine).dropna()
    return jsonify(df.to_dict(orient='records'))

@app.route('/data/country_gdp', defaults={'cc': '', 'region': ''}) # All countries, all regions
@app.route('/data/country_gdp/', defaults={'cc': '', 'region': ''}) # All countries, all regions
@app.route('/data/country_gdp/<cc>', defaults={'region': ''})
def data_country_gdp(cc, region):
    #for row in db.session.query(Country):
    #    print(row.country_code)
    q = country_gdp.select()
    # A little hacky here but handle passing either region or country code
    # Treate cc as region if region = 0 and cc is digit
    if region == '':
        if region_re.match(cc):
            q = q.where(country_gdp.c.region == cc)
        elif cc != '':
            q = q.where(country_gdp.c.country_code == cc)
    elif cc != '':
        q = q.where(country_gdp.c.region == region)
        q = q.where(country_gdp.c.country_code == cc)

    df = pd.read_sql(q, engine)
    return jsonify(df.to_dict(orient='records'))

@app.route('/data/monthly_loan_summary', defaults={'region': '', 'month': ''}) # Full data set
@app.route('/data/monthly_loan_summary/', defaults={'region': '', 'month': ''}) # Full data set
@app.route('/data/monthly_loan_summary/<region>', defaults={'month': ''}) # All months
@app.route('/data/monthly_loan_summary/<region>/<month>')
def data_monthly_loan_summary(region, month):
    q = monthly_loan_summary.select()

    # TODO: convert to last_day_of_month like 'region-month%'
    region_month = region
    if month != '':
        region_month = region_month + '-' + month
    if region != '':
        q = q.where(monthly_loan_summary.c.last_day_of_month.like(region_month +'%'))

    df = pd.read_sql(q, engine)
    return jsonify(df.to_dict(orient='records'))

@app.route('/data/monthly_loan_lender_summary/<region>', defaults={'month': ''}) # All months
@app.route('/data/monthly_loan_lender_summary/<region>/<month>')
def data_monthly_loan_lender_summary(region, month):
    q = monthly_loan_lender_summary.select()

    # TODO: convert to last_day_of_month like 'region-month%'
    region_month = region
    if month != '':
        region_month = region_month + '-' + month
    if region != '':
        q = q.where(monthly_loan_lender_summary.c.last_day_of_month.like(region_month +'%'))

    df = pd.read_sql(q, engine)
    return jsonify(df.to_dict(orient='records'))

@app.route('/data/region_month')
@app.route('/data/region_month/')
def data_region_month():
    data = pd.read_sql(
                select([monthly_loan_summary.c.region,
                        monthly_loan_summary.c.month]
                ).distinct().order_by(
                    'region, month'),
                    engine
                ).to_dict(orient='records')
    # numpy int64 cannot be jsonified
    data = [{y: int(z) for y, z in x.items()} for x in data]
    return jsonify(data)

@app.route('/data/year')
@app.route('/data/year/')
# TODO: Only take year with > 11 month of data
def data_year():
    data = pd.read_sql(
     #   select([monthly_loan_summary.c.year])
     #         .distinct().order_by(
     #       'year'),
    ''' -- Only show years with at least 9 month of data
    select
        year,
        count(distinct month)
    from monthly_loan_summary
    group by year
    having count(distinct month) > 9
    order by year
    
    ''',
        engine
    )['year'].tolist()
    # numpy int64 cannot be jsonified
    #data = [{y: int(z) for y, z in x.items()} for x in data]
    return jsonify(data)

@app.route('/data/region')
@app.route('/data/region/')
def data_region():
    data = pd.read_sql(
        select([country.c.region])
            .distinct().order_by(
            'region'),
        engine
    )['region'].tolist()
    return jsonify(data)

@app.route('/data/chord/<year>')
def data_chord(year):
    data = pd.read_sql("""
    select
	lc.region lender_region,
    bc.region loan_region,
    sum(lender_count) count
from monthly_loan_lender_summary as s
inner join country as lc on s.lender_country_code = lc.country_code
inner join country as bc on s.loan_country_code = bc.country_code
where s.year = {}
group by 1,2
    """.format(year),
        engine
    ).to_dict(orient='records')
    return jsonify(data)

@app.route('/data/map/<year>/<gender>')
@app.route('/data/map/<year>/', defaults={'gender': ''})
@app.route('/data/scatter/<year>/<gender>')
@app.route('/data/scatter/<year>/', defaults={'gender': ''})
def data_scatter(year, gender):
    gender_str = "and s.gender = '{}'".format(gender) if gender else  ''

    data = pd.read_sql("""
 select
        s.country_code,
        c.longitude,
        c.latitude,
        c.country_name,
        s.gender,
        min(g.gdp) as gdp,
        sum(loan_amount) loan_amount,
        sum(loan_count) loan_count
from monthly_loan_summary as s
inner join country as c on s.country_code = c.country_code
inner join country_gdp as g on g.country_code = s.country_code
where 
    s.year = {}
    {}
group by 1,2,3,4, 5
    """.format(year, gender_str),
        engine
    ).dropna().to_dict(orient='records')
    return jsonify(data)

@app.route('/chord_view')
def flow_view():
    return render_template('chord_view.html')

@app.route('/map_view')
def map_view():
    return render_template('map_view.html')

@app.route('/flow_map_view')
def flow_map_view():
    return render_template('flow_map_view.html')

@app.route('/scatter_view')
def scatter_view():
    return render_template('scatter_view.html')

if __name__ == '__main__':
   app.run(debug=True, extra_files=[

   ])
