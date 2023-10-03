import { createStore } from 'vuex';

const store = createStore({
  state: {
    loggedIn: false,
    storeSelectedBoardId: '',
    changeNotes: false,
    messages: [],
  },
  mutations: {
    toggleLoggedIn(state) {
      state.loggedIn = !state.loggedIn;
      console.log('mutation');
    },
    changeSelectedBoardId(state, id) {
      state.storeSelectedBoardId = id;
      console.log("Changed selected board id!");
    },
    // A change in changeNotes triggers a fetch to get notes
    changeNotes(state) {
      state.changeNotes = !state.changeNotes;
      console.log("Change in notes!");
    },
    addMessage(state, message) {
      state.messages = message;
    },
  },
});

export default store;