import { memo, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import {  useDispatch, useSelector } from "react-redux";
// ***** SPECIFIC ONES *****
import {getPostsStatus, sortPostsByDate } from "./postSlice";
import { selectUserById } from "../users/usersSlice";
import { Emojis } from "./Emojis";

import { fetchPosts } from "./postSlice";

let Post = ( {postId, usrId, content, title, time} ) => {
    const user = useSelector(state => selectUserById(state, usrId));
    
    return(
        <div className="post">
            <header>
                <h3 className="title">{title}</h3>
                <div className="subtitle">
                    <p>{ 'by ' + user?.name }</p>
                    <time>{time}</time>
                </div>
            </header>
            <article className="content">{content.length > 150 ? content.substring(0, 150) + "..." : content}</article>
            <footer>
                <Emojis postId={postId} />
                <Link className="view-post" to={'/posts/' + postId}>View Post</Link>
            </footer>
        </div>
    )
};
Post = memo(Post);          // memoization

export function Posts (){
    const posts = useSelector(sortPostsByDate);
    
    const postsFetchStatus = useSelector(getPostsStatus);

    const dpatch = useDispatch();
    useEffect(() => {
        if( (postsFetchStatus == 'idle') && !posts[0] ) dpatch(fetchPosts());
    }, []);
    return(
        <div className="posts">
            <h2 className="title">Posts</h2>
            {   
                posts.map( (post, i) => (
                    <Post 
                        key={i}
                        postId={post.id}
                        usrId={post.userId}
                        content={post.body} 
                        title={post.title} 
                        time={ moment(post.time).fromNow() } 
                    />
                ) )
            }
        </div>
    )
};

