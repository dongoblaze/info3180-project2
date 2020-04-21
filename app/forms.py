from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField,TextAreaField, PasswordField
from wtforms.validators import InputRequired, Email

class UserRegistration(FlaskForm):
    username= StringField('Username', validators=[InputRequired()])
    password= PasswordField("Password", validators=[InputRequired()])
    firstname= StringField("Firstname", validators=[InputRequired()])
    lastname= StringField("Lastname", validators=[InputRequired()])
    email= StringField("Email", validators=[InputRequired(), Email()])
    location= StringField("Location", validators=[InputRequired()])
    bio= TextAreaField("Biography", validators=[InputRequired()])
    profile_photo= FileField("Photo", validators=[FileRequired(), FileAllowed(["png", "jpg", "jpeg","Images only"])])

class LoginForm(FlaskForm):
    username= StringField("Username", validators=[InputRequired()])
    password= PasswordField("Password", validators=[InputRequired()])

class PostForm(FlaskForm):
    photo= FileField("Photo", validators=[FileRequired(), FileAllowed(["png", "jpg", "jpeg","Image Only"])])
    caption= TextAreaField("Caption", validators=[InputRequired()])

