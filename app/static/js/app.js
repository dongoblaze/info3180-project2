/* Add your Application JavaScript */

let User_id='';
let other='';
let msg='';
Vue.component('app-header', {
    template:`
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="/"><i class="fa fa-instagram" >Photogram</i></a>
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
                <router-link class="nav-link" to="">My Profile</router-link>
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
    `
});

const Home = Vue.component('home', {
    template: `
    <div @mouseover="Reset">
          <h6 v-if="text=='User successfully logged out'" class="success">{{text}}</h6>
          
          <div v-if="uc!=''" id="home">
           <h1>  Photogram </h1>
            <p> Share Life experiences and moments.<br>So Please enjoy</p><br>
        
          </div>
             
         <div v-else class="Frame">
          
             <router-link to="/register" class="btn btn-primary greenbut">Register</router-link>&nbsp
             <router-link to="/login" class="btn btn-primary butsize">login</router-link>
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
    <h2>Login </h2>
    <form action="/api/auth/login" method= "POST" enctype="multipart/form-data" @submit.prevent="LoginForm">
    <div class="">
    <label>Username</label>
    <input type="text"/>
    <label>Password</label>
    <input type="password"/>
    <button type="submit" class="btn btn-success">Login</button>
    </div>
    </form>
    </div>
     `,
    //  data: function(){
    //     return{
    //          msg:[],
    //          text:[]
    //     }
    // },
    // methods:{
    //     LoginForm: function(){
    //         let self = this;
    //         let loginForm= document.getElementById('login');
    //         let form_data = new FormData(loginForm);
    
    //         fetch("/api/auth/login",{
    //             method:'POST',
    //             body: form_data,
    //             headers:{
    //                 'X-CSRFToken':token
    //             },
    //             credentials: 'same-origin'
    //         })
    //           .then(function(response){
    //               return response.json();
    //           })
    //           .then(function(jsonResponse){
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
           <div class="postbut ">
               <router-link class="btn btn-primary butsize1" to="/post/new">New Post</router-link>
           </div>
         </div>
   </div>`
})

const Register = Vue.component('register',{
    template:`
    <div class="d-flex justify-content-center"> 
    <h2>Register</h2>
    <form action="/api/users/register" method="POST" enctype="multipart/form-data" @submit.prevent="UserRegistration">
    <label>Username</label>
    <input type="text"/>
    <label>Password</label>
    <input type="password"/>
    <label>Firstname</label>
    <input type= "text"/>
    <label>Lastname</label>
    <input type="text"/>
    <label>Email</label>
    <input type="email"/>
    <label>Location</label>
    <input type="text"/>
    <label>Biography</label>
    <textarea></textarea>
    <label>Photo</label>
    <input type="file" accept="image/*"/>
    <br>
    <button type="submit" class="btn btn-success">
    </form>
    </div>
    `
})

const Post= Vue.component('post',{
    template:`
    <div class="d-flex justify-content-center"> 
    <div> 
    <h2>New Post</h2> 
    <form action="/api/users/user_id/posts" method="POST" enctype = "multipart/form-data" @submit.prevent="PostForm"> 
    <label>Photo</label>
    <input type="file" accept="image/*">
    <div>
    <label>Caption</label>
    <textarea placeholder="Write a Caption ..."></textarea>
    <br>
    <router-link to="/explore"><button type="submit" class="btn btn-success">Submit</button></router-link>
    </div>
    <div>
    </form>
    `
})

const Users =Vue.component('user_profile',{
    template:`
    <div class="d-flex justify-content-center">
    <img class: "uphoto" v-bind:src=" "/>
    <div class="info">
       <h5>{{user.firstname}} {{user.lastname}}</h5>
       {{user.location}}
       <p>Member since: {{user.date}}</p>
       {{user.bio}}
       <button class="btn btn-success" v-on:click="follow" >Follow</button>
    </div>
    </div>
    `,
})


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