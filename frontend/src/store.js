import { createStore } from 'vuex';

const store = createStore({
  state: {
    loggedIn: false,
  },
  mutations: {
    toggleLoggedIn(state) {
      state.loggedIn = !state.loggedIn;
      console.log('mutation');
    },
  },
});

export default store;