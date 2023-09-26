<template>
<div v-if="loggedIn">
    <div class="input-group">
        <div class="input-group-append">
    <label class="input-group-text" for="inputGroupSelect02">Board:</label>
  </div>
        <select v-model="selectedBoardId" @change="loadNotes" class="custom-select" id="inputGroupSelect04">
            <option value="">Select a board</option>
            <option v-for="boards in userBoards.boards" :key="boards.id" :value="boards.id">{{ boards.name }}</option>
        </select>
        <div class="input-group-append">
            <!-- Only show the new note button if a board is selected. -->
            <button v-if="selectedBoardId.length > 1" @click="newNote()" class="btn btn-primary" type="button">New Note</button>
        </div>
    </div>

</div>
</template>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'BoardControl',
    computed: {
        ...mapState(['loggedIn']),
    },
    // To get the boards immediately after logging in
    watch: {
        loggedIn(value)  {
            if(value) this.fetchUserBoards();
        }
    },
    data() {
        return {
            selectedBoardId: '',
            userBoards: [],
        };
    },
    created() {
        this.fetchUserBoards();
    },
    methods: {
        logout() {
            this.$store.commit('toggleLoggedIn');
            localStorage.removeItem('jwt_token');
        },
        async fetchUserBoards() {
            if (!localStorage.getItem('jwt_token')) return;
            try {
                const res = await fetch("http://localhost:3030/boards/", {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                })
                const resJson = await res.json();
                console.log(resJson);
                this.userBoards = resJson;
                console.log(this.userBoards);

                //Checks if the JWT token is still valid, if response is invalid token, it logs out.
                if (this.userBoards.error == "invalid token") {
                    this.logout();
                }
            } catch (error) {
                console.error('Error fetching user boards:', error);
            }
        },
        loadNotes() {
            // When the user selects a board, you can handle it here
            // Use this.selectedBoardId to identify the selected board
            // Fetch and display notes for the selected board
        },
        newNote() {
            console.log("new note");

            // Needs to emit the boardID to stickynote.vue with the command to create a new note
        }
    },
};
</script>

<style scoped>
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
