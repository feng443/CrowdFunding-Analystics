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

@app.route('/data/country_gdp', defaults={'cc': '', 'year': ''}) # All countries, all years
@app.route('/data/country_gdp/', defaults={'cc': '', 'year': ''}) # All countries, all years
@app.route('/data/country_gdp/<cc>', defaults={'year': ''})
def data_country_gdp(cc, year):
    #for row in db.session.query(Country):
    #    print(row.country_code)
    q = country_gdp.select()
    # A little hacky here but handle passing either year or country code
    # Treate cc as year if year = 0 and cc is digit
    if year == '':
        if year_re.match(cc):
            q = q.where(country_gdp.c.year == cc)
        elif cc != '':
            q = q.where(country_gdp.c.country_code == cc)
    elif cc != '':
        q = q.where(country_gdp.c.year == year)
        q = q.where(country_gdp.c.country_code == cc)

    df = pd.read_sql(q, engine)
    return jsonify(df.to_dict(orient='records'))

@app.route('/data/monthly_loan_summary', defaults={'year': '', 'month': ''}) # Full data set
@app.route('/data/monthly_loan_summary/', defaults={'year': '', 'month': ''}) # Full data set
@app.route('/data/monthly_loan_summary/<year>', defaults={'month': ''}) # All months
@app.route('/data/monthly_loan_summary/<year>/<month>')
def data_monthly_loan_summary(year, month):
    q = monthly_loan_summary.select()

    # TODO: convert to last_day_of_month like 'year-month%'
    year_month = year
    if month != '':
        year_month = year_month + '-' + month
    if year != '':
        q = q.where(monthly_loan_summary.c.last_day_of_month.like(year_month +'%'))

    df = pd.read_sql(q, engine)
    return jsonify(df.to_dict(orient='records'))

@app.route('/data/monthly_loan_lender_summary/<year>', defaults={'month': ''}) # All months
@app.route('/data/monthly_loan_lender_summary/<year>/<month>')
def data_monthly_loan_lender_summary(year, month):
    q = monthly_loan_lender_summary.select()

    # TODO: convert to last_day_of_month like 'year-month%'
    year_month = year
    if month != '':
        year_month = year_month + '-' + month
    if year != '':
        q = q.where(monthly_loan_lender_summary.c.last_day_of_month.like(year_month +'%'))

    df = pd.read_sql(q, engine)
    return jsonify(df.to_dict(orient='records'))

@app.route('/data/year_month')
@app.route('/data/year_month/')
def data_year_month():
    data = pd.read_sql(
                select([monthly_loan_summary.c.year,
                        monthly_loan_summary.c.month]
                ).distinct().order_by(
                    'year, month'),
                    engine
                ).to_dict(orient='records')
    # numpy int64 cannot be jsonified
    data = [{y: int(z) for y, z in x.items()} for x in data]
    return jsonify(data)


@app.route('/chord_view')
def flow_view():
    return render_template('chord_view.html')

@app.route('/map_view')
def map_view():
    return render_template('map_view.html')

@app.route('/scatter_view')
def scatter_view():
    return render_template('scatter_view.html')

if __name__ == '__main__':
   app.run(debug=True, extra_files=[

   ])
