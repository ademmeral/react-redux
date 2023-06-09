import { configureStore } from "@reduxjs/toolkit";

import postsReducer from '../features/posts/postSlice';
import usersReducer from '../features/users/usersSlice';
import notificationsReducer from "../features/notifications/notificationSlice";

export const store = configureStore({
    reducer : {
        posts         : postsReducer,
        users         : usersReducer,
        notifications : notificationsReducer
    }
})