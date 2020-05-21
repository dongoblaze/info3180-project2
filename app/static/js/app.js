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
      <div class="row">
        <div class="alert alert-success col-md-12" role="alert" v-if='success'>
          {{ notifs }}
        </div>
        <div class="col-sm-5 ml-5 mr-3 border-top rounded no-padding">
          <img src="/static/css/img.jpg" alt="Photogram homepage photo" class="img-responsive" width="100%"/>
        </div>
        <div class="col-sm-5 bg-white border-top rounded">
          <div>
            <div class="card-header text-center bg-white">
              <h3 class="title">
                <i class="fas fa-camera d-inline-block"></i>
                Photogram
              </h3>
            </div>
            <div class="card-body">
              <p> Share photos of your favourite moments with friends, family and around the world </p>
            </div>
            <router-link to="/register"><input type="submit" value="Register" class="btn btn-success ml-4 mr-2 col-lg-5 font-weight-bold"></router-link>
              <router-link to="/login"><input type="submit" value="Login" class="btn btn-primary col-lg-5 font-weight-bold"></router-link>
          </div>
        </div>
      </div>
    `,
    props: ['notifs', 'success'],
    data: function() {
      return {};
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
    created: function () {
        fetch("api/auth/logout", {
          method: "GET",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (jsonResponse) {
            console.log(js);
            localStorage.removeItem("current_user");
            router.go();
            router.push("/");
          })
          .catch(function (error) {
            console.log(error);
          });
      },
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
  <div class=" row bg-white d-flex flex-row justify-content-between bg-white rounded shadow-sm p-3 mb-3">
    <div class=" mr-2">
      <img :src="'../' + user.photo" alt="User profile photo" class="profilePic">
    </div>
    <div class="d-flex flex-column">
      <p class="font-weight-bold text-muted"> {{user.firstname}} {{user.lastname}} </p>
      <p class="text-muted"> 
        {{user.location}} <br>
        Member since {{user.joined_on}} 
      </p>
      <p class="text-muted"> {{user.biography}} </p>
    </div>
    <div class="d-flex flex-column justify-content-between">
      <div class="d-flex flex-row justify-content-between">
        <div class="d-flex flex-column justify-content-center align-items-center p-2">
          <span class="font-weight-bold text-muted">{{ numPosts }}</span>
          <p class="font-weight-bold text-muted">Posts</p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center p-2">
          <span class="font-weight-bold text-muted">{{ followers }}</span>
          <p class="font-weight-bold text-muted">Followers</p>
        </div>
      </div>
      <div v-if="!isUser">
        <button v-if="user.isFollowing" @click="follow" class="btn btn-success font-weight-bold w-100">Following</button>
        <button v-else v-on:click="follow" class="btn btn-primary font-weight-bold w-100">Follow</button>
      </div>
    </div>
  </div>
  <ul class="row list-inline">
    <li class="col-sm-4" v-for="post in userposts">
      <div class="card-body no-padding">
        <img :src="'../' + post.photo" alt="Post photo" class="img-fluid card-img-top postPics">
      </div>
    </li>
  </ul>
</div>
  `,
  created: function(){
    let self = this;
    let current_user = localStorage.getItem('current_user');
    self.isUser = current_user === self.$route.params.user_id;

    
    fetch(`/api/users/${self.$route.params.user_id}/posts`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.token}`
      },
      credentials: 'same-origin'
    })
    .then(function (response){
      return response.json();
    })
    .then(function (jsonResponse){
      console.log(jsonResponse);
      if(jsonResponse.hasOwnProperty("code")){
        router.replace('/login');
      }
      else{
        let posts = jsonResponse.posts;
        let uid = self.$route.params.user_id;
        self.getUser(uid);
        self.getFollowers(uid);
        self.numPosts = posts.length;
        self.userposts = posts;
      }
    })
    .catch(function (error){
      console.log(error);
    });
  },
  data: function(){
    return {
      user: {},
      isUser: false
    };
  },
  methods: {
    getUser: function(uid) {
      let self = this;
      
      fetch(`/api/users/${uid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.token}`
        },
        credentials: 'same-origin'
      })
      .then(resp => resp.json())
      .then(jsonResp => {
        
        if(jsonResp.hasOwnProperty("user")){
          
          self.user = jsonResp.user;
        }
      })
      .catch(err => console.log(err));
    },
    getFollowers: function(id) {
      let self = this;
      fetch(`/api/users/${id}/follow`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.token}`
        },
        credentials: 'same-origin'
      })
      .then(resp => resp.json())
      .then(jsonResp => {
        if(jsonResp.hasOwnProperty("followers")){
          self.followers = jsonResp.followers;
        }
      })
      .catch(err => console.log(err));
    },
    follow: function() {
      let self = this;

      fetch(`/api/users/${self.$route.params.user_id}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(resp => resp.json())
      .then(jsonResp => {
        if (jsonResp.hasOwnProperty("message")) {
          self.followers++;
          self.user.isFollowing = true;
        }
      })
      .catch(err => console.log(err));
    }
  },
  data: function(){
    return {
      user: {},
      userposts: [],
      following: false,
      followers: 0,
      numPosts: 0
    };
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