

import sqlalchemy.engine.url as url

MYSQL_URL = url.URL(
    drivername='mysql',
    host='localhost',
    port=3306,
    username='root',
    password='Anything@123',
    database='kiva',
    query={'charset': 'utf8'} # Handle issue with Univode
)