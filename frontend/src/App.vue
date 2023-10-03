<template>
<b-container class="bv-example-row">
    <b-row>
        <b-col></b-col>
        <b-col>
            <BoardControl />
        </b-col>
        <b-col>
            <RegisterComponent />
            <LoginComponent />
        </b-col>
    </b-row>
    <NoteBoard />
</b-container>
</template>

<script>
import BoardControl from './components/BoardControl.vue';
import NoteBoard from './components/NoteBoard.vue';
import LoginComponent from './components/LoginComponent.vue';
import RegisterComponent from './components/RegisterComponent.vue';

export default {
    name: 'App',
    components: {
        NoteBoard,
        LoginComponent,
        RegisterComponent,
        BoardControl,
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
