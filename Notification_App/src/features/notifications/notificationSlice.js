import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    data : [],
    addStatus : 'idle',
    fetchStatus : 'idle',
    updateStatus : 'idle',
    delStatus : 'idle',
    postErr :null, 
    fetchErr :null, 
    updateErr :null, 
    delErr :null,
};

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
    const GET_NOTIFICATIONS = 'http://localhost:3005/notifications';
    const { data } = await axios.get(GET_NOTIFICATIONS);
    return data;
});
export const updateReadNotification = createAsyncThunk(
    'notifications/updateReadNotification', async (payload, {getState}) => {
        const URL = 'http://localhost:3005/notifications/' + payload.id;
        const { data } = await axios.put(URL, payload);
        return data;

});
export const addNotification = createAsyncThunk(
    'notifications/addNotification', async (payload,) => {
        const URL = 'http://localhost:3005/notifications/';
        const { data } = await axios.post(URL, payload);
        return data;
    }
);
export const deleteMarkedNotification = createAsyncThunk(
    'notifications/deleteNotification', async (payload, {getState}) => {
        async function looping() {
            for (let notf of payload) {
                const URL = 'http://localhost:3005/notifications/' + notf.id;
                await axios.delete(URL)
            }
            return;
        }
        await looping();
    }
);
export const notificationsSlice = createSlice({
    name : 'notifications',
    initialState,
    reducers : {
        addNotf(state, {payload}){
            state.data.unshift(payload);
        },
        updateNotf(state, {payload}){
            state.data.find(notf => notf.id == payload.id).checked = payload.checked;
        },
        deleteNotfs(state, {payload}){
            // for (let obj of payload) {
            //     const findObj = state.data.find(obj_ => obj.id == obj_.id);
            //     const index = state.data.indexOf(findObj)
            //     state.data.splice(index, 1);
            //     console.log(obj, index);
            // }
            state.data = payload;
            // DO NOT RETURN ANYTHING IN A SYNCHRONOUS REDUCER
        }
     },
    extraReducers : (builder) => {
        //----------------- GET ----------
        builder.addCase(fetchNotifications.pending, (state) => {
            state.fetchErr = false;
            state.fetchStatus = 'loading';
        } );
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            state.fetchErr =false;
            state.fetchStatus = 'ok';
            state.data = action.payload;
        } );
        builder.addCase(fetchNotifications.rejected, (state) => {
            state.fetchErr = true;
            state.fetchStatus = 'rejected';
        } );
        //------- UPDATE -------
        builder.addCase(updateReadNotification.fulfilled, (state, {payload}) => {
            state.updateErr =false;
            state.updateStatus = 'ok';
        } );
        builder.addCase(updateReadNotification.rejected, (state) => {
            state.updateErr = true;
            state.updateStatus = 'rejected';
        } );
        builder.addCase(updateReadNotification.pending, (state) => {
            state.updateErr = false;
            state.updateStatus = 'saving';
        } );
        //------- ADD NOTF -------
        builder.addCase(addNotification.fulfilled, (state, {payload}) => {
            state.postErr =false;
            state.addStatus = 'ok';
        } );
        builder.addCase(addNotification.rejected, (state) => {
            state.postErr = true;
            state.addStatus = 'rejected';
        } );
        builder.addCase(addNotification.pending, (state) => {
            state.postErr = false;
            state.addStatus = 'saving';
        } );
        //------- DELETE NOTF -------
        builder.addCase(deleteMarkedNotification.fulfilled, (state) => {
            state.delErr =false;
            state.delStatus = 'ok';
        } );
        builder.addCase(deleteMarkedNotification.rejected, (state) => {
            state.delErr = true;
            state.delStatus = 'rejected';
        } );
        builder.addCase(deleteMarkedNotification.pending, (state) => {
            state.delErr = false;
            state.delStatus = 'deleting';
        } );
    }
});
// ****** MAIN EXPORTATION *******
export default notificationsSlice.reducer;
export const {addNotf, updateNotf, deleteNotfs } = notificationsSlice.actions;                  
// ****** ALL NOTFS *******
export const selectAllNotifications = state => state.notifications.data;
// ****** FOR SPECIFIC NOTFS *******
export const selectNotificationById = (state, notfId) => state.notifications.data
    .find( notf => notf.id == notfId)
export const sortNotificationsByDate = state => [...state.notifications.data]
    .sort( (a,b) => b.time.localeCompare(a.time) )
export const selectCheckedNotifications = state => state.notifications.data
    .filter( notf => notf.checked == true )
export const selectUncheckedNotifications = state => state.notifications.data
    .filter( notf => notf.checked == false )
// ***** STATUS & ERROR *****
export const getNotfAddStatus = state => state.notifications.addStatus;
export const getNotfAddError = state => state.notifications.addErr;
export const getNotfFetchStatus = state => state.notifications.fetchStatus;
export const getNotfFetchError = state => state.notifications.fetchErr;
export const getNotfUpdateStatus = state => state.notifications.updateStatus;
export const getNotfUpdateError = state => state.notifications.updateErr;
export const getNotfDelStatus = state => state.notifications.delStatus;
export const getNotfDelError = state => state.notifications.delErr;