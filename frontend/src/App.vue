<template>
  <NavBar/>
  <NoteBoard/>
  <BoardControl/>
  <LoginForm/>
  <RegisterForm/>
</template>

<script>
import BoardControl from './components/BoardControl.vue';
import NoteBoard from './components/NoteBoard.vue';
import LoginForm from './components/LoginForm.vue';
import NavBar from './components/NavBar.vue';
import RegisterForm from './components/RegisterForm.vue';


export default {
  name: 'App',
  components: {
    NoteBoard,
    BoardControl,
    LoginForm,
    NavBar,
    RegisterForm
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
