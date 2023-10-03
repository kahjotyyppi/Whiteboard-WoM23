<template>
<div>
    <div :style="noteStyle" class="sticky-note" @mousedown="startDrag">
        <div class="buttons">
            <button @click="changeColor('#f7ff8a')">Y</button>
            <button @click="changeColor('#fba2fc')">P</button>
            <button @click="changeColor('#a2cffc')">B</button>
            <button @click="changeColor('#a2fcb7')">G</button>
            <button class="delete-button" @click="deleteNote">×</button>
        </div>
        <div>
            <textarea :style="textareaStyle" @blur="saveText" @keyup="saveText" ref="textInput" rows="4" cols="25" v-model="text"></textarea>
        </div>
    </div>
</div>
</template>

  
<script>
export default {
    props: {
        initialColor: String,
        initialText: String,
        x: Number,
        y: Number,
        noteId: String,
    },
    data() {
        return {
            isEditing: false,
            backgroundColor: this.initialColor || '#f7ff8a',
            text: this.initialText || 'Click to edit',
            isDragging: false,
            initialMouseX: 0,
            initialMouseY: 0,
            initialX: this.x || 0,
            initialY: this.y || 0,
        };
    },
    watch: {
        x(newValue, oldValue) {
            if (newValue !== oldValue) {
                console.log('initialX has changed:', newValue);
            }
            this.$nextTick(() => {
                this.initialX = newValue;
            });
        },
        y(newValue, oldValue) {
            if (newValue !== oldValue) {
                console.log('initialY has changed:', newValue);
            }
            this.$nextTick(() => {
                this.initialY = newValue;
            });
        },
        initialText(newValue) {
            if (newValue) {
                console.log('text has changed:', newValue);
            }
            this.$nextTick(() => {
                this.text = newValue;
            });
        },
        initialColor(newValue) {
                console.log('color has changed:', newValue);
            this.$nextTick(() => {
                this.backgroundColor = newValue;
            });
        },
        },
        computed: {
            noteStyle() {
                return {
                    backgroundColor: this.backgroundColor,
                    width: '240px',
                    height: '240px',
                    paddingTop: '5px',
                    paddingRight: '5px',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: `${this.initialY}px`,
                    left: `${this.initialX}px`,
                    userSelect: 'none',
                };
            },
            textareaStyle() {
                return {
                    backgroundColor: this.backgroundColor,
                    border: 'none',
                    outline: 'none',
                    width: '220px',
                    height: '210px',
                    paddingTop: '20px',
                    paddingLeft: '15px',
                    paddingRight: '15px',
                    resize: 'none',
                    overflow: 'hidden',
                    opacity: '0.8',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap',
                    position: 'center',
                    align: 'center',
                    top: '0',
                    left: '0',
                    fontSize: '20px',
                };
            },
        },
        methods: {
            // noteStyle, textareaStyle, editText, saveText, startDrag, endDrag, handleDrag are modified code from ChatGPT.
            sendMessageToNoteBoard(message) {
                this.$store.commit('addMessage', message);
            },
            editText() {
                this.isEditing = true;
                this.$nextTick(() => {
                    this.$refs.textInput.focus();
                });
            },
            saveText() {
                this.isEditing = false;
                // Update text & position in database
                this.sendMessageToNoteBoard({
                    noteId: this.noteId,
                    type: 'updateContent',
                    content: this.text
                });
                this.updateNote();
            },
            startDrag(event) {
                this.isDragging = true;
                this.initialMouseX = event.clientX;
                this.initialMouseY = event.clientY;

                document.addEventListener('mousemove', this.handleDrag);
                document.addEventListener('mouseup', this.stopDrag);
            },
            handleDrag(event) {
                const deltaX = event.clientX - this.initialMouseX;
                const deltaY = event.clientY - this.initialMouseY;

                this.initialX += deltaX;
                this.initialY += deltaY;

                this.initialMouseX = event.clientX;
                this.initialMouseY = event.clientY;

                // Send position updates to the NoteBoard component
                this.sendMessageToNoteBoard({
                    noteId: this.noteId,
                    type: 'updatePosition',
                    x: this.initialX,
                    y: this.initialY,
                });
            },
            stopDrag() {
                this.isDragging = false;
                document.removeEventListener('mousemove', this.handleDrag);
                document.removeEventListener('mouseup', this.stopDrag);

                // Update position in database
                this.updateNote();
            },
            async updateNote(color) {
                try {
                    const res = await fetch(`https://lahepela-wom-project.azurewebsites.net/notes/${this.noteId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
                        },
                        body: JSON.stringify({
                            content: this.text,
                            positionX: this.initialX,
                            positionY: this.initialY,
                            color: color,
                        }),
                    });
                    const resJson = await res.json();
                    console.log(resJson);
                } catch (e) {
                    console.log(e);
                }
            },
            changeColor(color) {
                this.backgroundColor = color;
                console.log('change color');
                this.updateNote(color);
                this.sendMessageToNoteBoard({
                    noteId: this.noteId,
                    type: 'updateColor',
                    color: color,
                });
            },
            async deleteNote() {
                try {
                    const res = await fetch(`https://lahepela-wom-project.azurewebsites.net/notes/${this.noteId}`, {
                        method: 'DELETE',
                        headers: {
                            authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
                        },
                    });
                    const resJson = await res.json();
                    console.log(resJson);
                    this.$store.commit('changeNotes');

                    this.sendMessageToNoteBoard({
                    noteId: this.noteId,
                    type: 'deletedNote',
                });
                } catch (e) {
                    console.log(e);
                }
            },
        },
    };
</script>

  
<style scoped>
.sticky-note {
    cursor: pointer;
    overflow: hidden;
}

.typed-text {
    white-space: pre-wrap;
}

.buttons {
    text-align: right;
}
</style>
