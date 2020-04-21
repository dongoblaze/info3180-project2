/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
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
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
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

const Logout= Vue.component('logout-form',{
    template:`<div> </div>
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

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here

        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

Vue.use(VueRouter);

const router = new VueRouter({
         routes: [
         { path: '/', component: Home },
         { path: '/register', component: Register},
         { path: '/explore', component: Explore},
         { path: '/login' , component: Login}, 
         { path: '/logout', component: Logout},
         { path: '/users/:user_id', component: Users},
         { path: '/post/new', component: Post}
         ]
    });

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});