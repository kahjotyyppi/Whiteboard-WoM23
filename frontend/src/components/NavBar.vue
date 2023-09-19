<template>
    <nav class="navbar navbar-expand-lg pt-5">
        <div class="container-fluid">
            <a class="navbar-brand">Aboard</a>
            <h1 class="display-5 text-success d-flex justify-center-content" id="header">RECIPE RANGER</h1>
            <div class="d-flex" v-bind="logger" v-if="this.logger.loggedOut">
                <input type="text" name="username" v-model="input.username" placeholder="Username" />
                <input type="password" name="password" v-model="input.password" placeholder="Password" />
                <b-button type="button" @click="login()" class="btn btn-success btn-md">Login</b-button>
            </div>
            <div v-bind="logger" v-if="this.logger.loggedIn">
                <h2>Welcome back {{account.username}}! Happy cooking! :)</h2>
                <b-button type="button" @click="logout()">Logout</b-button>
            </div>
        </div>
    </nav>
</template>
  
  <script>
  export default {
    name: 'NavBar',
    props: {
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .navbar {
    margin: auto;
    padding: 20px;
  }
  .loginregister {
    align-content: center;
  }
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  </style>
  