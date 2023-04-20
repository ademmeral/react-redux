import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setRandomHour } from "../../modules/modules";

const initialState = {
    data : [],
    status : 'idle',
    error : null,
};
export const emojis = {
    reactions : {
        thumbUp : 0, 
        hooray  : 0, 
        heart   : 0,
        rocket  : 0,
        eyes    : 0
    },
    emoji : {
        thumbUp : '👍', 
        hooray  : '🎉', 
        heart   : '❤️',
        rocket  : '🚀',
        eyes    : '👀'
    },
    content : {
        thumbUp   : 'gave your post the thumbs up', 
        hooray    : 'celebrated your post', 
        heart     : 'liked your post',
        rocket    : 'launched a rocket for your post',
        eyes      : 'watches your post',
        follow    : 'follows',
        chat      : 'wants to chat with'
    }
};
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const GET_POSTS = 'https://jsonplaceholder.typicode.com/posts';
    const { data } = await axios.get(GET_POSTS)
    const result = await data.map(obj => {
        const time = setRandomHour();
        const userId = () => Math.floor(Math.random() * 10) + 1;
        return { ...obj, reactions : emojis.reactions, time, userId : userId() };
    });
    const sliced = await result.slice(0, 10);
    return sliced;

});
export const fetchPostWithParam = createAsyncThunk("posts/fetchPostWithParam", async(payload, {getState}) => {
    const URL = 'https://jsonplaceholder.typicode.com/posts/' + payload;
    const resp = await axios.get(URL);
    return {...resp.data, reactions : emojis.reactions};
})
const postsSlice = createSlice({
    name : 'posts',
    initialState,
    reducers : {    
        postAdded(state, {payload}) {
            state.data.unshift(payload);
        },
        postUpdated(state, action){
            const {id : postId, title, content, time} = action.payload;
            const currPost = state.data.find( post => post.id == postId )

            if (currPost) {
                currPost.title = title;
                currPost.body = content;
                currPost.time = time;
            }
        },
        reactionAdded(state, action){
            const {postId, name_} = action.payload;
            const currPost = state.data.find( post => postId == post.id)
            if (currPost) currPost.reactions[name_] = currPost.reactions[name_] + 1
        },
    },
    extraReducers : (builder) => {
        builder.addCase(fetchPosts.rejected, (state) => {
            state.error = true;
            state.status = 'failed'; 
        } );
        builder.addCase(fetchPosts.fulfilled, (state, {payload}) => {
            state.error = false;
            state.status = 'ok';
            state.data = payload;
        });
        builder.addCase(fetchPosts.pending, (state) => {
            state.status = 'loading';
            state.error = false;
        } );

        builder.addCase(fetchPostWithParam.rejected, (state) => {
            state.error = true;
            state.status = 'failed'; 
        } );
        builder.addCase(fetchPostWithParam.fulfilled, (state, action) => {
           state.error = false;
           state.status = 'ok';
           state.data.push(action.payload);
        } );
        builder.addCase(fetchPostWithParam.pending, (state) => {
            state.status = 'loading';
            state.error = false;
        } );
    },
});

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;

export const selectAllPosts = state => state.posts.data
export const selectPostById = (state, postId) => state.posts.data.find( post => post.id == postId )
export const sortPostsByDate = (state) => [...state.posts.data].sort((a,b) => b.time?.localeCompare(a.time))

export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
