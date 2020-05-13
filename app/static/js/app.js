/* Add your Application JavaScript */

let User_id='';
let other='';
let msg='';
Vue.component('app-header', {
    template:`
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="/">  <img class="icon" src="../static/css/pic.jpg" style="width:20px;height:20px;"/>Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
        </ul>
        <ul class="navbar-nav">
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            </li> 
            <li class="nav-item active">
                <router-link class="nav-link" to="/explore">Explore </router-link>
            </li> 
            <li class="nav-item active">
            <router-link to="/users/:user_id" class="nav-link">My Profile</router-link>
            </li> 
            <li class="nav-item active">
                <router-link class="nav-link" to="/logout">Logout </router-link>
            </li>  
        </ul>
      </div>
    </nav>
    `,
    methods:{
        check:function(){
            self=this;
            if(other==''){
                self.$router.push("/users/"+User_id);
            }
            else{
                other='';
                self.$router.push("/explore");
                setTimeout(function(){ self.$router.push("/users/"+User_id)},500);
            }
        }
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `,
    data: function() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = Vue.component('home', {
    template: `
    <div @mouseover="Reset">
          <h6 v-if="text=='User successfully logged out'" class="success">{{text}}</h6>
          
          <div v-if="uc!=''" id="home">
          
            <div class="float-">
                <h1>  Photogram </h1>
                    <p> Share Life experiences and moments.<br>So Please enjoy</p><br>
            </div>
          </div>
             
         <div v-else class="Frame">
         <div class="row mx-md-n5">
            <div class="homePic">
                <img class="rounded float-left" src="/static/css/img.jpg" alt="home page picture" style="width:400px;height:400px;"/>
            </div>
        </div>
            <div class="Welcome">
                <div class="padtext">
                    <h1> Photogram</h1>
                    </div>
                    <div class="pad">
                    <p> Share photos of your favourite moments with friends, family and the world.</p> 
                    </div>
            
                <div>   
                <router-link to="/register" class="btn btn-success">Register</router-link>&nbsp
                <router-link to="/login" class="btn btn-primary">Login</router-link>
                </div>
                </div> 
        </div>  
    </div>
     `,
data: function(){
    return{
        uc:User_id,
        text:msg
    };   
    },
 methods:{
      Reset:function ()
        {
            this.text="";
        }
   }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

const Login = Vue.component('login',{
    template:`
    
     <div class="d-flex justify-content-center">
        <h1> <strong>login</strong> </h1>
        <div id="form">
            <form action="/api/auth/login" method= "POST" enctype="multipart/form-data" id="login" @submit.prevent="LoginForm">
                <div class="form-group">
                    <label>Username</label>
                    <input name="username" type="username" class="form-control"/>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input name="password" type="password" class="form-control"/>
                </div>
                <button type="submit" class="btn btn-success">Login</button>
        
            </form>   
        </div>    
    </div>
    `,
     data: function(){
        return{
             msg:[],
             text:[]
        }
    },
    methods:{
        LoginForm: function(){
            let self = this;
            let loginForm= document.getElementById('login');
            let form_data = new FormData(loginForm);
    
            fetch("/api/auth/login",{
                method:'POST',
                body: form_data,
                headers:{
                    'X-CSRFToken':token
                },
                credentials: 'same-origin'
            })
              .then(function(response){
                  return response.json();
              })
              .then(function(jsonResponse){
                if(jsonResponse.response!=null)
                  {
                    User_id=jsonResponse.response["0"].user;
                    let jwt_token=jsonResponse.response["0"].token;
                    localStorage.setItem('token',jwt_token);
                    localStorage.setItem('userid',User_id);
                    self.$router.push("/explore");
                    msg="Login was successfully";
                    let logout= document.getElementById('logout'); 
                    logout.classList.remove('hid');
                  }
                  else{
                      self.msg=jsonResponse.errors['0'];
                  }
              })
              .catch(function(errors){
                  //console.log(errors);
              });
        },
    Reset:function (){
         this.text="";
         this.msg="";
     }
    },
    created: function(){
         this.text=msg;
    }
});

const Logout= Vue.component('logout-form',{
    template:`
    <div class="d-flex justify-content-center"> 
    <h2>Logout</h2>
    </div>
    `,
    created: function() {
        let self = this;
        fetch("/api/auth/logout", { 
             method: 'GET',
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                 'X-CSRFToken': token
            },
            credentials: 'same-origin' 
          })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse){
            // display a success message
            //console.log(jsonResponse);
                if(jsonResponse.response["0"].message=="User successfully logged out")
                 {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userid');
                    msg="User successfully logged out";
                    let logout= document.getElementById('logout'); 
                    logout.classList.add('hid');
                    User_id="";
                    self.$router.push('/');
                 }
            })
            .catch(function (error) {
            //console.log(error);
        });
    }
});

const Explore=Vue.component('explore',{
    template: `
   <div>
       <h6 class ="success">{{text}}</h6>
       <div v-if="uc==''" class="error">
           <p>Please login or sign-up to benefit from this Feature </p>
       </div>
       <div v-else @mouseover="Reset">
           <div>
                   <h2 ></h2>
                    <ul class="posts__list">
                       <li v-for="user in users"class="post_item" v-if="uc!=user.user_id">
                           <div>
                            <div class="space3">
                            <span @click="post(user.user_id)"><h6 class="fixme" ><img v-bind:src="user.userpro" alt="User Profile picture" style="width:20px;height:20px;"/> {{user.username}}</h6></span>
                            <img v-bind:src="user.postphoto" alt="Post image" style="width:800px;height:400px;"/>
                            <br>
                              <span class="fixme"> {{user.caption}}</span>
                            </div>
                            <div>
                              <span @click="Like(user.id)"> <img src="/static/uploads/like.jpg" alt="like icon" style="width:20px;height:20px;"/> <span v-bind:id="user.id">{{user.likes}}</span> Likes </span><span class="space2"> {{user.created_on}}</span>
                           </div>
                           </div>
                       </li>
               </ul>
            </div>
           <div class="post ">
               <router-link class="btn btn-primary butsize1" to="/post/new">New Post</router-link>
           </div>
         </div>
   </div>`,

   created: function(){
    let self =this;
    fetch('/api/posts',{
            method:'GET',
            'headers': {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
         .then(function(response){
              return response.json();
          })
          .then(function(jsonResponse){
              //display a success message
              self.users = jsonResponse.response['0'].post; 
              //console.log(jsonResponse);
          })
          .catch(function(error){
              //console.log(error);
          });
},
data: function(){
    return{
        users:[],
        uc:User_id,
        text:msg
    };   
    },
methods:{
    post:function(userp){
            let self=this;
            other=""+userp;
            self.$router.push("/users/"+other);
    },
    Like:function(postid){
        let self=this;
        let post=""+postid;
        let form_data = new FormData();
        let se=self.uc;
        form_data.append("user_id",se);
        form_data.append("post_id",post);
       
        fetch('/api/posts/'+post+'/like',{
                method:'POST',
                body: form_data,
                 'headers': {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'X-CSRFToken': token
                    },
                credentials: 'same-origin'
            })
             .then(function(response){
                  return response.json();
              })
              .then(function(jsonResponse){
                  //display a success message
                  //console.log(jsonResponse);
                  let loginForm= document.getElementById(postid).innerHTML=jsonResponse.response['0'].likes;
              })
              .catch(function(error){
                  //console.log(error);
              });
        },
    Reset: function(){
        this.text="";
    }
}
})

const Register = Vue.component('register',{
    template:`
    <div class="d-flex justify-content-center"> 
    
    <h1 class="display-1"> <strong> Registration</strong></h1>
    <div id="form">
        <form class="form" action="/api/users/register" method="POST" enctype="multipart/form-data" id="register"  @submit.prevent="UserRegistration">
        
        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
                    <label>Username</label>
                    <input name="username" type="text"class="form-control"/>
                </div>
            </div> 
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
                    <label>Password</label>
                    <input  name="password"type="password" class="form-control"/>
                </div>
            </div>
        </div>  

        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
                    <label>ConfrimPassword</label>
                    <input name="confirmpassword" type="password" class="form-control"/>
                </div>
            </div>
        </div> 
        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
            
                    <label>Firstname</label>
                    <input name="firstname" type= "text" class="form-control"/>
                </div>
            </div>
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
                   
                    <label>Lastname</label>
                    <input name="lastname" type="text"class="form-control"/>
                </div>
            </div>
        </div>

        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
                   
                    <label>Gender</label>
                    <input name="gender" type="text"class="form-control"/>
                </div>
            </div>
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
                    <label>Email</label>
                    <input name="email" type="email"class="form-control"/>
                </div>
            </div>   
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
                    
                    <label>Location</label>
                    <input name="location" type="text"class="form-control"/>
                    
                </div>
            </div> 
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-sm-10">
                    <label>Biography</label>
                    <textarea name="bio" class="form-control"> </textarea>
                </div>
            </div>  
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-lg-11">
                    <div class="form-group">
                        <label>Photo</label>
                        <input name="photo" type="file" accept="image/*" class="form-control-file"/>
                    </div>
                </div>
            </div>   
        </div>    
        
            <div class="col-lg-11">
                    <div class="form-group">  
                        <button type="submit" class="btn btn-success"> Submit</button>
                    </div>
            </div>
        </form>            
        </div>
    </div>
    </div>        
        

    `,
  data: function(){
        return{
            msg:[]
        }
    },
 methods:{
    UserRegistration: function(){
        let self = this;
        let registerForm= document.getElementById('register');
        let form_data = new FormData(registerForm);

        fetch("/api/users/register",{
            method:'POST',
            body: form_data,
            headers:{
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
          })
          .then(function(response){
              return response.json();
          })
          .then(function(jsonResponse){
              //display a success message
              if(jsonResponse.response!=null)
                  {
                    msg="User successfully registered. So login now and enjoy";
                    self.$router.push("/login");
                  }
               else{
                   self.msg=jsonResponse.errors['0'];
                  }
              //console.log(jsonResponse);
              
          })
          .catch(function(errors){
              //console.log(errors);
          });
    },
Reset:function ()
{
    this.msg="";
}
}

});

const Post= Vue.component('post',{
    template:`
    <div>
        <div v-if="uc==''" class="error">
           <p>Please login or sign-up to benefit from this Feature </p>
        </div>
       <div v-else class="Frame">
    <div class="d-flex justify-content-center"> 
    <div> 
    <h1>New Post</h1> 
 
     <form action="/api/users/user_id/posts" method="POST" id="post" enctype = "multipart/form-data" @submit.prevent="PostForm"> 
    <div class="form-group">
        <label>Photo</label>
        <input type="file" name=photo accept="image/*" class="form-control"/>
    </div>
    <div class="form-group">
        <label>Caption</label>
        <textarea name=caption placeholder="Write a Caption ..." class="form-control"></textarea>
    </div>
        <br>
    <router-link to="/explore"><button type="submit" class="btn btn-success">Submit</button></router-link>
    </form>
    </div>
    
    </div>
    </div>
    </div>`,

    data: function() {
        return {
            uc:User_id,
            error: []
        };
     },
       methods:{
         PostForm: function(){
             let self = this;
             let postForm= document.getElementById('post');
             let form_data = new FormData(postForm);
     
             let userid = ""+self.uc;
             fetch('/api/users/'+userid+'/posts',{
                 method:'POST',
                 body: form_data,
                 'headers': {
                 'Authorization': 'Bearer ' + localStorage.getItem('token'),
                 'X-CSRFToken': token
                  },
                 credentials: 'same-origin'
               })
               .then(function(response){
                   return response.json();
               })
               .then(function(jsonResponse){
                   //display a success message
                   //console.log(jsonResponse);
                   if(jsonResponse.response["0"].message=="Successfully created a new post")
                   {
                     msg="Successfully created a new post";
                     self.$router.push("/explore");
                   }
               })
               .catch(function(error){
                   //console.log(error);
               });
         }
     }
});

const Users =Vue.component('users',{
    template:`
    <div>
        <div v-if="uc==''" class="error">
                <p>Please login or sign-up to benefit from this Feature </p>
        </div>
        <div class="d-flex justify-content-center">
        <img v-bind:src="user.photo" alt="profile picture" style="width:200px;height:200px;padding-bottom:10px;padding-right:10px;">
        <div class="info">
        <h5>{{user.firstname}} {{user.lastname}}</h5>
        {{user.location}}
        <p>Member since: {{user.date}}</p>
        {{user.biography}}
        </div>
        <div class="">
        <span class="postscount"><h6>{{user.numpost}}</h6><br>Posts</span>
        <span class="followscount"><h6 id="follow">{{user.numfollower}}</h6><br>Followers</span>
        </div>
        <br>
        <span v-if="uc==user.id"><button class="btn btn-primary but butsize1 hid">Follow</button></span>
        <span v-else-if=" uc in user.follower"><button class="btn btn-primary but butsize1">Following</button></span>
        <button class="btn btn-success" v-on:click="follow" >Follow</button>

        <div class="userpic">
        <ul class="profilepost__list">
            <li v-for="post in user.posts"class="post_item" >
                <div class="">
                <img v-bind:src="post.photo" alt="Post image" style="width:340px;height:200px;"/>
                </div>
            </li>
        </ul>
        </div>
        </div>
        </div>
    </div>
    `,
    data: function() {
        return {
            user:[],
            uc:User_id,
            Other:other,
            post:[],
            follow:[]
        };
      },
      created: function(){
                  if (other==''){
                          let self =this;
                          let userid = ""+self.uc;
                          fetch('/api/users/'+userid+'/posts',{
                                  method:'GET',
                                  'headers': {
                                      'Authorization': 'Bearer ' + localStorage.getItem('token'),
                                      'X-CSRFToken': token
                                  },
                                  credentials: 'same-origin'
                              })
                               .then(function(response){
                                    return response.json();
                                })
                                .then(function(jsonResponse){
                                    //display a success message
                                    self.user= jsonResponse.response["0"]; 
                                    //console.log(jsonResponse);
                                })
                                .catch(function(error){
                                   // console.log(error);
                                });
                          }
                  else{
                       let self =this;
                       let userid = ""+self.Other;
                          fetch('/api/users/'+userid+'/posts',{
                                  method:'GET',
                                   'headers': {
                                             'Authorization': 'Bearer ' + localStorage.getItem('token'),
                                             'X-CSRFToken': token
                                      },
                                  credentials: 'same-origin'
                              })
                               .then(function(response){
                                    return response.json();
                                })
                                .then(function(jsonResponse){
                                    //display a success message
                                    self.user= jsonResponse.response["0"]; 
                                    //console.log(jsonResponse);
                                })
                                .catch(function(error){
                                   //console.log(error);
                                });
                      }
      },
      methods:{
          Follow:function(){
              let self = this;
              let userid = ""+self.Other;
              let form_data = new FormData();
              let se=self.uc;
              form_data.append("user_id",userid);
              form_data.append("follower_id",se);
                      
              fetch("/api/users/"+userid+"/follow", { 
              method: 'POST',
              body: form_data,
              headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                  'X-CSRFToken': token
              },
              credentials: 'same-origin'
              })
              .then(function (response) {
              return response.json();
              })
              .then(function (jsonResponse) {
              // display a success message
              //console.log(jsonResponse);
              let loginForm= document.getElementById('follow').innerHTML=jsonResponse.response['0'].follow;
              let log= document.getElementById('fo').innerText="following";
              })
              .catch(function (error) {
               //console.log(error);
              });
          }
      }

});


Vue.use(VueRouter);
// Define Routes
const router = new VueRouter({
         routes: [
         { path: '/', component: Home },
         { path: '/register', component: Register},
         { path: '/explore', component: Explore},
         { path: '/login' , component: Login}, 
         { path: '/logout', component: Logout},
         { path: '/users/:user_id', component: Users},
         { path: '/post/new', component: Post},
          // This is a catch all route in case none of the above matches
         { path: "*", component: NotFound}]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});