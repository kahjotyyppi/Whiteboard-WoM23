<template>
<div v-if="loggedIn">
    <div v-for="note in this.notes.note" :key="note.id">
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
    },
    data() {
        return {
            notes: [],
        };
    },
    watch: {
        storeSelectedBoardId() {
            if (this.storeSelectedBoardId.length < 1)
                return;
            this.notes = [];
            this.fetchNotes();
        },
        changeNotes(value) {
            if (value || !value) this.fetchNotes();
        },
        loggedIn(value) {
            if (!value) this.notes = [];
        }
    },
    methods: {
        async fetchNotes() {
            if (!localStorage.getItem('jwt_token'))
                return;
            try {
                const res = await fetch(`http://localhost:3030/notes/${this.storeSelectedBoardId}`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                });
                const resJson = await res.json();
                //console.log(resJson);
                this.notes = resJson;
                console.log(this.notes.note[0]);
            } catch (e) {
                console.log(e);
            }
        },
    },
    components: {
        StickyNote
    }
}
</script>
