from .app import db

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