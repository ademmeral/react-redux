import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import moment from "moment/moment";

import  { postAdded, emojis } from './postSlice';
import { selectAllUsers, fetchUsers, getUsersStatus } from "../users/usersSlice";

export function AddPost(){
    const [title, setTitle] = useState('');
    const [authorId, setAuthorId] = useState(1);
    const [body, setBody] = useState('');

    const [disabled, setDisabled] = useState(true);

    const users = useSelector( selectAllUsers );
    const usersStatus = useSelector( getUsersStatus );
    
    const dpatch = useDispatch();

    useEffect(() => {
        if ((usersStatus === 'idle') && !users[0] ) dpatch(fetchUsers())
    }, []);

    useEffect(() => {
        if ( (body.length < 1) || (title.length < 1) ) setDisabled(true)
        else setDisabled(false)
    }, [title, body]);

    function onSavePost(){
        if (title && body && authorId) {
            const time_ = moment().format("YYYY/MM/DD HH:mm:ss");
            const newObj = {
                id : nanoid(), 
                title, 
                userId : authorId,
                body, 
                time : time_, 
                reactions : emojis.reactions,
            };
            dpatch( postAdded(newObj) );
        };
        setTitle('')
        setBody('')
        setAuthorId("---")
    };
    return (
        <section className="add-post">
            <h2 className="title">Add a New Post</h2>
            <form action="" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="post-title">
                    <h4>Title</h4>
                    <input 
                        type="text" 
                        id="post-title" 
                        maxLength={55} 
                        minLength={10} 
                        placeholder="Title"
                        value={title ? title : ''}
                        onChange={(e) => setTitle(e.target.value)}    
                    />
                </label>
                <label htmlFor="select">
                    <h4>Select Author</h4>
                    <select id="select" onChange={(e) => setAuthorId(e.target.value)} value={authorId}>
                        <option value="1">---</option>
                        { users.map( (usr, i) => (
                                <option key={i} value={usr.id}>{usr.name}</option>
                            )) }
                    </select>
                </label>
                <label htmlFor="content">
                    <h4>Content</h4>
                    <textarea 
                        id="content" 
                        placeholder="Content..."
                        value={body ? body : ''}
                        onChange={(e) => setBody(e.target.value) }>
                    </textarea>
                </label>
                <button 
                    type="submit" 
                    id="submit"
                    onClick={ onSavePost }
                    className={disabled ? 'disabled' : ''} // do not use disabled && 'disabled'
                >Submit
                </button>
            </form>
        </section>
    )
};
