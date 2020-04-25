"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os
import jwt

 

from app import app, db, login_manager,token_key
from flask import render_template, request, redirect, url_for, flash, jsonify,json, session , _request_ctx_stack 
from flask_login import login_user, logout_user, current_user, login_required
from.forms import UserRegistration, LoginForm, PostForm 
from .models import Users,Posts,Follows, Likes
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash,generate_password_hash
###
# Routing for your application.
###


# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')


@app.route('/')
def home():
    form=UserRegistration()
    """Render website's initial page and let VueJS take over."""
    return render_template('home.html', form=form)

@app.route('/api/users/register', methods=['POST'])
def register():
    """accepts user information and save it to the database"""
    form=UserRegistration()
    # now = datetime.datetime.now()
    if request.method == 'POST' and form.validate_on_submit():
        username= form.username.data
        password = form.password.data
        confirmpassword = form.confirmpassword.data
        firstname = form.firstname.data
        lastname = form.lastname.data
        gender = form.gender.data
        email = form.email.data
        location = form.location.data
        bio=form.bio.data
        photo=form.photo.data
        filename = secure_filename(photo.filename)

        photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        photo='/static/uploads/'+ filename
        # date=now.strftime("%B %d, %Y")
        
        user = Users.query.filter_by(username=username).first()

        if user is None :
        
            if password == confirmpassword:
                user=Users(username, password, firstname, lastname, gender, location, email, bio, photo, date)
                db.session.add(user)
                db.session.commit()
                flash('You are now registered', 'success')
                return jsonify(response=[{"message":"User successfully registered"}])
            else:
                flash("Password and Confirmpassword don't match", 'danger')
                return jsonify(response=[{"message":"Password and Confirmpassword don't match"}])

                 
        elif user is not None:
            flash("already a member", 'danger')
            return jsonify(errors=[{"error":"You are already a member"}])
    return jsonify(errors=[{"errors":form_errors(form)}])


# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))


@app.route('/api/auth/login',methods=['POST'])
def login():
    # Here we use a class of some kind to represent and validate our
    # client-side form data. For example, WTForms is a library that will
    # handle this for us, and we use a custom LoginForm to validate.
    form = LoginForm()
    # Login and validate the user.
    if request.method == 'POST' and form.validate_on_submit():
        # Query our database to see if the username and password entered
        # match a user that is in the database.
        username = form.username.data
        password = form.password.data
        
        user = Users.query.filter_by(username=username).first()
        
        if user is not None and check_password_hash(user.password, password):
            remember_me = False
            
            if 'remember_me' in request.form:
                remember_me = True
        
            # If the user is not blank, meaning if a user was actually found,
            # then login the user and create the user session.
            # user should be an instance of your `User` class
            #login_user(user, remember=remember_me)
            
            payload = {'user_id': user.id}
            token = jwt.encode(payload,token_key)
            session['userid']=user.id
            return jsonify(response=[{"token":token,"message":"login was successfully","user":user.id}])
            
        else:
            flash('Username or Password is incorrect.', 'danger')
            return jsonify(errors=[{"errors":"Username or Password is incorrect."}])

    return jsonify(errors=[{"errors":form_errors(form)}])

@app.route('/api/auth/logout',methods=['GET']) 
# @requires_auth
def logout():
    """logout users"""
    g.currrent_user=None
    if session['userid']:
        session.pop('userid')  
        logout={"message":"User successfully logged out"}
        return jsonify(response=[logout])
    return jsonify(errors=[{"errors":"not logout"}])


@app.route('/api/posts/<post_id>/like',methods=['POST'])
#@login_required
# @requires_auth
def like(post_id):
    """ set a like on the current post by the logged in user"""
    if request.method == 'POST':
        user_id=int(request.form['user_id'])
        post=int(request.form['post_id'])
        like = Likes(user_id,post)
        db.session.add(like)
        db.session.commit()
        total_likes = len(Likes.query.filter_by(post_id=post).all())
        return jsonify (response=[{'message': 'You liked a user post','likes':total_likes}])
    return jsonify (error=[{'error': 'unable to create link'}])

@app.route('/api/users/<user_id>/follow',methods=['POST'])
#@login_required
# @requires_auth
def follow(user_id): 
    """create a follow relationship between the current user and the target user."""
    if request.method == 'POST':
        target_user=int(request.form['user_id'])
        current_user=int(request.form['follower_id'])
        follows=Follows.query.filter_by(user_id=target_user).all()
        check=''
        for follow in follows:
            if current_user==follow.follower_id:
                check=1
                
        if check!=1:
            follow =Follows(target_user,current_user)
            db.session.add(follow)
            db.session.commit()
            user = Users.query.filter_by(id=target_user).first()
            msg="You are now following that user."+ user.username
            numfollow=len(Follows.query.filter_by(user_id=target_user).all())
            return jsonify (response=[{"message":msg,"follow":numfollow}]) 
        else:
            numfollow=len(Follows.query.filter_by(user_id=target_user).all())
            return jsonify (response=[{"message":"You are already following that user.","follow":numfollow}]) 
    else:
        return jsonify (errors=[{'error': 'unable to create link'}])


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
