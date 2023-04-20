import {  useSelector } from "react-redux";
import { useParams } from "react-router";
import { Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import moment from "moment";

import { Emojis } from "./Emojis";
import { selectPostById } from "./postSlice";
import { selectUserById } from "../users/usersSlice";
import { Loader } from "../../components/Loader";

export function ViewPost(){
    const { postId } = useParams();
    
    const post = useSelector( state => selectPostById(state, postId));
    const user = useSelector( state => post ? selectUserById(state, post.userId) : '');

    const [timeOut, setTimeOut] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!user || !post) {
            const timeout_ = setTimeout(() => setMessage('notfound'), 2000);
            setTimeOut(timeout_);
        };
    }, []);

    useEffect( () => () => {
        clearTimeout(timeOut);
    }, []);      // componentWillUnmount

    if (!user && !message) return <Loader />;
    if ( message ) return <Navigate to="/posts/404"/>;
    return (
        <div className="view__posts">
        <div className="post">
            <header>
                <h3 className="title">{post.title}</h3>
                <div className="subtitle">
                    <p>{'by ' + user.name}</p>
                    <time>{moment(post.time).fromNow()}</time>
                </div>
            </header>
            <article className="content">{post.body}</article>
            <footer>
                <Emojis postId={post.id}/>
                <Link className="edit-post" to={'/posts/edit/' + post.id}>Edit Post</Link>
            </footer>
        </div>
        </div>
    )
};
