from . import db
from werkzeug.security import generate_password_hash


#Create Posts database
class Posts(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    photo = db.Column(db.String(150))
    caption = db.Column(db.String(150))
    created_on = db.Column(db.Date)

    def __init__(self,user_id, photo, caption, created_on):
        self.user_id=user_id
        self.photo=photo
        self.caption=caption
        self.created_on=created_on

#Create Users database
class Users(db.Model):
    __tablename__='users'

    id=db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(80))
    password=db.Column(db.String(150))
    firstname=db.Column(db.String(150))
    lastname=db.Column(db.String(150))
    gender=db.Column(db.String(80))
    email=db.Column(db.String(150))
    location=db.Column(db.String(150))
    biography=db.Column(db.String(250))
    photo=db.Column(db.String(150))
    joined_on=db.Column(db.Date)

    def __init__(self, username, password, firstname, lastname, email, location, biography, photo, joined_on):
        self.username=username
        self.password=generate_password_hash(password, method='pbkdf2:sha256')
        self.firstname=firstname
        self.lastname=lastname
        self.gender=gender
        self.email=email
        self.location=location
        self.biography=bio
        self.photo=photo
        self.joined_on=date

#Create Likes database
class Likes(db.Model):
    __tablename__='likes'

    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer)
    post_id=db.Column(db.Integer)

    def __init__(self, user_id, post_id):
        self.user_id=user_id
        self.post_id=post_id

#Create Follows database
class Follows(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer)
    follower_id=db.Column(db.Integer)

    def __init__(self, user_id, follower_id):
        self.user_id=user_id
        self.follower_id=follower_id


    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)