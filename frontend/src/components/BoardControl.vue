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
            <b-button class="btn btn-primary" v-b-modal.manage>Manage Boards</b-button>
            <b-button v-if="selectedBoardId.length > 1" @click="newNote()" class="btn btn-primary" type="button">New Note</b-button>
        </div>
    </div>
</div>

<!-- Manage boards modal -->

<div class="container">
    <div>
        <b-modal hide-footer="true" id="manage" title="Board Management">
            <!-- Your login message -->
            <div v-if="this.warnMsg" class="alert alert-danger" role="alert">{{ this.warnMsg }}</div>
            <div v-if="this.succMsg" class="alert alert-success" role="alert">{{ this.succMsg }}</div>

            <div class="modal-content">
                <div class="modal-body" style="padding: 40px 50px;">
                    <h4>Your Boards</h4>
                    <ul>
                        <li v-for="board in userBoards.boards" :key="board.id">
                            {{ board.name }}
                            <button @click="deleteBoard(board.id)">Delete</button>
                            <button @click="showAddCollaboratorInput(board.id)">Add Collaborator</button>
                        </li>
                    </ul>

                    <div v-if="showCollaboratorInput">
                        <input type="text" v-model="collaboratorEmail" placeholder="Enter email">
                        <b-button @click="addCollaborator">Add</b-button>
                    </div>

                    <b-button @click="showCreateBoardInput = !showCreateBoardInput">Create New Board</b-button>
                    <div v-if="showCreateBoardInput">
                        <input type="text" v-model="newBoardName" placeholder="Enter board name">
                        <b-button @click="createNewBoard">Create</b-button>
                    </div>
                </div>
            </div>
        </b-modal>
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
        ...mapState(['storeSelectedBoardId']),
        ...mapState(['messages']),
    },
    // To get the boards immediately after logging in
    watch: {
        loggedIn(value) {
            if (value) this.fetchUserBoards();
        },
        messages(value) {
            if (value.type == "deletedBoard") {
                this.fetchUserBoards();
            }
        },
    },
    data() {
        return {
            selectedBoardId: '',
            userBoards: [],
            showCollaboratorInput: false,
            collaboratorEmail: "",
            showCreateBoardInput: false,
            newBoardName: "",
            warnMsg: "",
            succMsg: "",
            selectedBoardCollab: "",
        };
    },
    methods: {
        sendMessageToNoteBoard(message) {
            this.$store.commit('addMessage', message);
        },
        logout() {
            this.$store.commit('toggleLoggedIn');
            localStorage.removeItem('jwt_token');
        },
        async fetchUserBoards() {
            if (!localStorage.getItem('jwt_token')) return;
            try {
                const res = await fetch("https://lahepela-wom-project.azurewebsites.net/boards/", {
                //const res = await fetch("http://localhost:3030/boards/", {
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
            this.$store.commit('changeSelectedBoardId', this.selectedBoardId);
        },
        async newNote() {
            console.log("new note");
            try {
                const res = await fetch(`https://lahepela-wom-project.azurewebsites.net/notes/`, {
                //const res = await fetch(`http://localhost:3030/notes/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                    },
                    body: JSON.stringify({
                        content: 'Click here to edit',
                        color: '#f7ff8a',
                        positionX: 750,
                        positionY: 250,
                        boardId: this.selectedBoardId,
                    })
                });
                const resJson = await res.json();
                this.notes = resJson;
                this.$store.commit('changeNotes');

                this.sendMessageToNoteBoard({
                    type: 'createNote',
                    noteId: this.notes.id,
                    content: 'Click here to edit',
                    color: '#f7ff8a',
                    x: 750,
                    y: 250,
                });
            } catch (e) {
                console.log(e);
            }
        },
        async deleteBoard(boardId) {
            if (this.storeSelectedBoardId === boardId) {
                this.succMsg = "";
                this.warnMsg = `Cannot delete the board that you currently are on.`;
                return;
            }
            try {
                const res = await fetch(`https://lahepela-wom-project.azurewebsites.net/boards/${this.boardId}`, {
                //const res = await fetch(`http://localhost:3030/boards/${boardId}`, {
                    method: 'DELETE',
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
                    },
                });
                const resJson = await res.json();
                console.log(resJson);
                if (resJson.msg !== "ERROR") {
                    this.warnMsg = "";
                    this.succMsg = `${resJson.msg} "${resJson.name}"`;
                    console.log(this.storeSelectedBoardId)
                    console.log(boardId)
                    this.fetchUserBoards();

                    // Send to websocket
                    this.sendMessageToNoteBoard({
                    type: 'deletedBoard',
                    boardId: boardId,
                });
                } else {
                    this.warnMsg = `${resJson.msg} ${resJson.error}`;
                    this.succMsg = "";
                }
            } catch (e) {
                this.succMsg = "";
                this.warnMsg = e;
            }
        },
        showAddCollaboratorInput(boardId) {
            console.log(boardId)
            // Implement logic to show the collaborator input for the selected board
            this.showCollaboratorInput = true;
            this.selectedBoardCollab = boardId;
        },
        async addCollaborator() {
            console.log("new collaborator");
            try {
                const res = await fetch(`https://lahepela-wom-project.azurewebsites.net/boards/${this.selectedBoardCollab}`, {
                //const res = await fetch(`http://localhost:3030/boards/${this.selectedBoardCollab}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                    },
                    body: JSON.stringify({
                        username: this.collaboratorEmail,
                    })
                });
                const resJson = await res.json();
                this.warnMsg = "";
                this.succMsg = `${resJson.msg} "${resJson.collaborator}".`;
            } catch (e) {
                console.log(e);
                this.succMsg = "";
                this.warnMsg = e;
            }
        },
        async createNewBoard() {
            console.log("new board");
            try {
                const res = await fetch(`https://lahepela-wom-project.azurewebsites.net/boards`, {
                //const res = await fetch(`http://localhost:3030/boards`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                    },
                    body: JSON.stringify({
                        boardName: this.newBoardName,
                    })
                });
                const resJson = await res.json();
                this.warnMsg = "";
                this.succMsg = `"${resJson.name}" ${resJson.msg}`;
                this.fetchUserBoards();
            } catch (e) {
                console.log(e);
                this.succMsg = "";
                this.warnMsg = e;
            }
        }
    }
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

.custom-select {
    width: 200px;
}
</style>
