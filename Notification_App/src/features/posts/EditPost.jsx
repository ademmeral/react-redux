import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import { postUpdated, selectPostById } from "./postSlice";
import { useEffect, useState } from "react";
import moment from "moment";

export function EditPost(){
    const {postId} = useParams();
    const {title, body : content} = useSelector( state => selectPostById(state, postId) );
    const dpatch = useDispatch();

    const [stt, setStt] = useState({
        done        : false,
        disabled    : null,
        timeout     : null,
        title,
        content, 
    });

    function onSavePost(e){
        const time = moment().format('YYYY/MM/DD HH:mm:ss');
        if ( stt.title.length > 0 || stt.content.length > 0 ) {
            const newObj = {
                id : postId, 
                title : stt.title, 
                content : stt.content, 
                time, 
            };
            dpatch( postUpdated(newObj) );

            const timeout = setTimeout( () => setStt({...stt, done : true}), 1000 );
            setStt({...stt, timeout});
            setStt({...stt, disabled : true});
        }
    };
    useEffect(() => {
        
        if( (stt.content.length > 0) && (stt.title.length > 0) ) setStt({...stt, disabled : false})
        else setStt({...stt, disabled : true});
        
    }, [stt.title, stt.content]);

    useEffect( () => () => {
        clearTimeout(stt.timeout);
    }, []);      // componentWillUnmount

    if (stt.done) return <Navigate to={`/posts/${postId}`} />;
    return (
        <div className="add-post" id="edit">
            <h2 className="title">Post Edit</h2>
            <form action="" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="post-title">
                    <h4>Title</h4>
                    <input
                        type="text"
                        id="post-title"
                        maxLength={70}
                        minLength={5}
                        placeholder="Title"
                        defaultValue={title}
                        onChange={(e) => setStt({...stt, title : e.target.value})}
                    />
                </label>
                <label htmlFor="content">
                    <h4>Content</h4>
                    <textarea
                        id="content"
                        placeholder="Content..."
                        defaultValue={content}
                        onChange={(e) => setStt({...stt, content : e.target.value})}>
                    </textarea>
                </label>
                <button
                    type="submit"
                    id="submit"
                    className={stt.disabled ? "disabled" : ''}
                    onClick={onSavePost}
                >Submit
                </button>
            </form>
        </div>
    )
};

