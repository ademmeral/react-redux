import { useDispatch, useSelector } from "react-redux";
import { memo } from "react";
import moment from "moment";
import { nanoid } from "@reduxjs/toolkit";

import { addNotf, addNotification, getNotfAddStatus } from "../notifications/notificationSlice";
import { reactionAdded, emojis, selectPostById } from "./postSlice";

let Emoji = ( {name_, obj, postId, content} ) => {
    const post = useSelector(state => selectPostById(state, postId));

    const notfAddStatus = useSelector(getNotfAddStatus);

    const dpatch = useDispatch();

    function handleClick(e){
        dpatch( reactionAdded({postId, name_}) );
        const time = moment().format('YYYY/MM/DD HH:mm:ss');
        const obj_ = {
            id : nanoid(), 
            time, 
            checked : false, 
            name_, 
            content, 
            from : 'A user', 
            to : 'You'
        };
        dpatch(addNotf(obj_));
        if ( (notfAddStatus == 'idle') || (notfAddStatus == 'ok') ) dpatch( addNotification(obj_) );
    };

   return(
        <div className="icon" onClick={handleClick}>
            <span>{obj}</span>
            <span className="count">{post.reactions[name_]}</span>
        </div>
    )
};
Emoji = memo(Emoji);        // memoization

export function Emojis( {postId} ){
    const keys = Object.keys(emojis.emoji);
    const {emoji, content} = emojis;
    return(
        <div className="icons">
            { keys.map((name_, i) => (
                <Emoji 
                    key={i} 
                    obj={emoji[name_]} 
                    name_={name_}
                    postId={postId} 
                    content={content[name_]}
                />
                )
            ) }
        </div>
    )
};