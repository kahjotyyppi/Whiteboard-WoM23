<template>
<div v-if="loggedIn">
    <div v-for="note in notes" :key="note.id">
        <StickyNote :initialText="note.content" :x="note.positionX" :y="note.positionY" :noteId="note.id" :initialColor="note.color" />
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex';
import StickyNote from './StickyNote.vue';

export default {
    name: 'NoteBoard',
    computed: {
        ...mapState(['storeSelectedBoardId']),
        ...mapState(['changeNotes']),
        ...mapState(['loggedIn']),
        ...mapState(['messages']),
    },
    data() {
        return {
            notes: [],
            socket: null,
        };
    },
    watch: {
        storeSelectedBoardId() {
            if (this.storeSelectedBoardId.length < 1) return;
            this.notes = [];
            this.fetchNotes();
        },
        changeNotes(value) {
            if (value || !value) this.fetchNotes();
        },
        loggedIn(value) {
            if (!value) this.notes = [];
        },
        messages(value) {
            if (value.type == "updatePosition") this.handlePositionUpdate(value);
            if (value.type == "updateColor") this.handleColorUpdate(value);
            if (value.type == "updateContent") this.handleContentUpdate(value);
            if (value.type == "deletedNote") this.handleRemoveNote(value);
            if (value.type == "createNote") this.handleCreateNote(value);
            if (value.type == "deletedBoard") this.handleDeleteBoard(value);
            console.log(value.type)
        }
    },
    methods: {
        async fetchNotes() {
            if (!localStorage.getItem('jwt_token')) return;
            try {
                const res = await fetch(
                    //`https://lahepela-wom-project.azurewebsites.net/notes/${this.storeSelectedBoardId}`, {
                    `http://localhost:3030/notes/${this.storeSelectedBoardId}`, {
                        method: 'GET',
                        headers: {
                            authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
                        },
                    }
                );
                const resJson = await res.json();
                this.notes = resJson.note;
            } catch (e) {
                console.log(e);
            }

        const jwt = JSON.parse(atob(localStorage.getItem('jwt_token').split('.')[1]));
        const WS_TOKEN = jwt.ws_token;
        console.log('webtoken ' + WS_TOKEN)

        //const WS_URL = `wss:lahepela-wom-websocket.azurewebsites.net?token=${jwt.ws_token}&boardId=${this.storeSelectedBoardId}`;
        const WS_URL = `ws:localhost:5000?token=${jwt.ws_token}&boardId=${this.storeSelectedBoardId}`;

        if(this.socket) this.socket.close();
        // Create a WebSocket connection
        this.socket = new WebSocket(WS_URL);

        // Connection established
        this.socket.addEventListener('open', () => {
            console.log(`Connecting to board ${this.storeSelectedBoardId} WebSocket server`);
        });

        // Message listener
        this.socket.addEventListener('message', (event) => {
            console.log('Received message:', event.data);

            const message = JSON.parse(event.data);

            // Handle messages from the WebSocket server
            if (message.type === 'updatePosition') {
                // Update the position of the corresponding StickyNote
                const updatedNote = this.notes.find((note) => note.id === message.noteId);
                if (updatedNote) {
                    updatedNote.positionX = message.x;
                    updatedNote.positionY = message.y;
                } else console.log("cant find note")
            }
            if (message.type === 'updateContent') {
                // Update the content of the corresponding StickyNote
                const updatedNote = this.notes.find((note) => note.id === message.noteId);
                if (updatedNote) {
                    updatedNote.content = message.content;
                } else console.log("cant find note")
            }
            if (message.type === 'updateColor') {
                // Update the color of the corresponding StickyNote
                const updatedNote = this.notes.find((note) => note.id === message.noteId);
                if (updatedNote) {
                    updatedNote.color = message.color;
                    console.log(message.color)
                } else console.log("cant find note")
            }
            if (message.type === 'deleteNote') {
                //Delete corresponding StickyNote
                const updatedNote = this.notes.find((note) => note.id === message.noteId);
                if (updatedNote) {
                    if (updatedNote !== -1) {
                        this.notes.splice(this.notes.indexOf(updatedNote), 1);
                    }
                } else console.log("cant find note")
            }
            if (message.type === 'createNote') {
                //Create a new note
                const newNote = {
                    id: message.noteId,
                    content: message.content,
                    color: message.color,
                    positionX: message.x,
                    positionY: message.y,
                };
                console.log(newNote);
                this.notes.push(newNote);
            }
            if (message.type === 'deletedBoard') {
                if (this.storeSelectedBoardId == message.boardId) {
                    console.log("This board has got deleted");
                    this.$store.commit('addMessage', message);
                    this.$store.commit('changeSelectedBoardId', "");
                    this.notes = "";
                    this.socket.close();
                }
            }
        });

        // Connection closed
        this.socket.addEventListener('close', () => {
            console.log('Connection closed');
        });

        },
        handlePositionUpdate(positionData) {
            // Handle the position update from StickyNote component
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(
                    JSON.stringify({
                        type: 'updatePosition',
                        noteId: positionData.noteId,
                        x: positionData.x,
                        y: positionData.y,
                    })
                );
            }
        },
        handleContentUpdate(contentData) {
            // Handle the position update from StickyNote component
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(
                    JSON.stringify({
                        type: 'updateContent',
                        noteId: contentData.noteId,
                        content: contentData.content
                    })
                );
            }
        },
        handleColorUpdate(ColorData) {
            // Handle the color update from StickyNote component
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(
                    JSON.stringify({
                        type: 'updateColor',
                        noteId: ColorData.noteId,
                        color: ColorData.color,
                    })
                );
            }
        },
        handleRemoveNote(noteData) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(
                    JSON.stringify({
                        type: 'deleteNote',
                        noteId: noteData.noteId,
                    })
                );
            }
        },
        handleCreateNote(noteData) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(
                    JSON.stringify({
                        type: 'createNote',
                        noteId: noteData.noteId,
                        content: noteData.content,
                        color: noteData.color,
                        x: noteData.x,
                        y: noteData.y,
                    })
                );
            }
        },
        handleDeleteBoard(data) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(
                    JSON.stringify({
                        type: 'deletedBoard',
                        boardId: data.boardId,
                    })
                );
            }
        }
    },
    components: {
        StickyNote,
    },
};
</script>
