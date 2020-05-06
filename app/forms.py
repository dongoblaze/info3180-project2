from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField,TextAreaField, PasswordField,SelectField,BooleanField
from wtforms.validators import InputRequired,DataRequired, Email

class UserRegistration(FlaskForm):
    username= StringField('Username', validators=[InputRequired()])
    password= PasswordField("Password", validators=[InputRequired()])
    confirmpassword = PasswordField('ConfirmPassword', validators=[DataRequired()])
    firstname= StringField("Firstname", validators=[InputRequired()])
    lastname= StringField("Lastname", validators=[InputRequired()])
    gender=SelectField('Gender', choices=[('Male','Male'), ('Female', 'Female')])
    email= StringField("Email", validators=[InputRequired(), Email()])
    location= StringField("Location", validators=[InputRequired()])
    bio= TextAreaField("Biography", validators=[InputRequired()])
    photo= FileField("Photo", validators=[FileRequired(), FileAllowed(["png", "jpg", "jpeg","Images only"])])

class LoginForm(FlaskForm):
    username= StringField("Username", validators=[InputRequired()])
    password= PasswordField("Password", validators=[InputRequired()])
   

class PostForm(FlaskForm):
   
    photo= FileField("Photo", validators=[FileRequired(), FileAllowed(["png", "jpg", "jpeg","Image Only"])])
    caption= TextAreaField("Caption", validators=[InputRequired()])
