import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginstart: (state) => {
      state.loading = true;
    },
    loginsuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginfailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateuserstart: (state) => {
      state.loading = true;
    },
    updateusersuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateuserfailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteuserstart: (state) => {
      state.loading = true;
    },
    deleteuserfailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteusersuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signoutstart: (state) => {
      state.loading = true;
    },
    signoutfailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutsuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  loginstart,
  loginsuccess,
  loginfailure,
  updateuserfailure,
  updateuserstart,
  updateusersuccess,
  deleteuserfailure,
  deleteuserstart,
  deleteusersuccess,
  signoutfailure,
  signoutstart,
  signoutsuccess,
} = userSlice.actions;

export default userSlice.reducer;

/*Reducers are pure functions that take the current state and an action as arguments and return a new state. 
They decide how every action transforms the entire application's state. 
In a reducer, you would typically switch based on the action's type and handle each case by returning a new state object that incorporates the data from the action's payload (if any).
 */

/*
state and actions are objects that are used to check the state and update if needed
*/

/*
When an action is dispatched to the Redux store, reducers will use the action's payload to determine how to calculate the new state. 
For example, if your action's type is loginSuccess, the payload might be the user's profile data returned from a server.
*/
