import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { setGender, setRating } from '../../modules/modules';

const initialState = {
  data : [],
  status : 'idle',
  error : null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const GET_USERS = 'https://jsonplaceholder.typicode.com/users'
  const resp = await axios.get(GET_USERS);
  const dataWithGender = resp.data.map( obj => {
    return {...obj, gender : setGender(), rating : setRating()};
  } );
  return [...dataWithGender];
} );
export const fetchUserWithParam = createAsyncThunk("users/fetchUserWithParam", async(payload, {getState}) =>{
  const URL = 'https://jsonplaceholder.typicode.com/users/' + payload;
  const resp = await axios.get(URL);
  return resp.data;
});
const usersSlice = createSlice({
    name : 'users',
    initialState,
    reducers : {
      userAdded(state, {payload}){
        state.data.push(payload);
      }
    },
    extraReducers : (builder) => {
      builder.addCase(fetchUsers.rejected, (state) => {
        state.error = true;
        state.status = 'failed';
      } );
      builder.addCase(fetchUsers.fulfilled, (state, {payload}) => {
          state.error = false;
          state.status = 'ok';
          state.data = payload;
      } );
      builder.addCase(fetchUsers.pending, (state) => {
          state.status = 'loading';
          state.error = false;
      } );

      builder.addCase(fetchUserWithParam.rejected, (state) => {
        state.error = true;
        state.status = 'failed';
      } );
      builder.addCase(fetchUserWithParam.fulfilled, (state, {payload}) => {
          state.error = false;
          state.status = 'ok';
          state.data.push(payload);
      } );
      builder.addCase(fetchUserWithParam.pending, (state) => {
          state.status = 'loading';
          state.error = false;
      } );
    }
});

export const { userAdded } = usersSlice.actions;
export default usersSlice.reducer;

// ***** MULTIPLE *****
export const selectAllUsers = (state) => state.users.data
export const getUsersStatus = state => state.users.status;
export const getUsersError = state => state.users.error;
// ***** SPECIFIC *****
export const selectUserById = (state, userId) => state.users.data
  .find( user => user.id == userId)
export const getAllPostsByUserId = (state, userId) => state.posts.data
  .filter( post => post.userId == userId ).length
