#MYSQL_URL =  "mysql://chan:*ORkM}c_3PqY2if@localhost:3306/kiva"

import sqlalchemy.engine.url as url

MYSQL_URL = url.URL(
    drivername='mysql',
    host='localhost',
    port=3306,
    username='chan',
    password='*ORkM}c_3PqY2if',
    database='kiva',
    query={'charset': 'utf8'} # Handle issue with Univode
)