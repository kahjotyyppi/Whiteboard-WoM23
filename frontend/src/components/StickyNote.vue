<!-- Modified code from ChatGPTs generated code. -->
<template>
    <div>
      <div :style="noteStyle" class="sticky-note" @mousedown="startDrag">
        <div>
        <textarea
          :style="textareaStyle"
          @blur="saveText"
          @keyup.enter="saveText"
          ref="textInput"
          rows="4"
          cols="25"
          v-model="this.text"
        ></textarea>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      initialText: String,
      x: Number,
      y: Number,
    },
    data() {
      return {
        isEditing: false,
        text: this.initialText || 'Click to edit',
        isDragging: false,
        initialMouseX: 0,
        initialMouseY: 0,
        initialX: this.x || 0,
        initialY: this.y || 0,
      };
    },
    computed: {
      noteStyle() {
        return {
          backgroundColor: 'yellow',
          width: '240px',
          height: '240px',
          padding: '20px',
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
          backgroundColor: 'yellow',
          border: 'none',
          outline: 'none',
          width: '200px',
          height: '200px',
          resize: 'none',
          overflow: 'hidden', // Use auto for overflow to enable scrolling if needed
          opacity: '0.8',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          position: 'center', // Keep position absolute
          align: 'center',
          top: '0',
          left: '0',
          fontSize: '20px'
        };
      },
    },
    methods: {
      editText() {
        this.isEditing = true;
        this.$nextTick(() => {
          this.$refs.textInput.focus();
        });
      },
      saveText() {
        this.isEditing = false;
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
      },
      stopDrag() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.stopDrag);
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
  </style>