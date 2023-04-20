import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";
// ***** SPECIFIC ONES *****
import { getAllPostsByUserId, selectUserById } from "./usersSlice";
import { emojis } from "../posts/postSlice";
import { addNotf, addNotification, getNotfAddStatus } from "../notifications/notificationSlice";
import { Loader } from "../../components/Loader";
//import hell :')

function SocialIcons(){
    return (
        <ul className="social-links">
            <li>
                <Link to={''}>
                    <FaFacebook className="facebook" />
                </Link>
            </li>
            <li>
                <Link to={''}>
                    <FaInstagram className="instagram" />
                </Link>
            </li>
            <li>
                <Link to={''}>
                    <FaTwitter className="twitter" />
                </Link>
            </li>
            <li>
                <Link to={''}>
                    <FaLinkedin className="linkedin" />
                </Link>
            </li>
        </ul>
    )
};

function SocialStatusInfo( {user, countArticles} ){
    const [followers, setFollowers] = useState( (Math.floor(Math.random() * 20) + 1) + 'K' )
    return (
        <ul className="social-info">
            <li className="user__followers">
                <p>Followers</p>
                <h3>{followers}</h3>
            </li>
            <li className="user__post__info">
                <p>Posts</p>
                <h3>{countArticles}</h3>
            </li>
            <li className="user__rating">
                <p>Rating</p>
                <h3>{user.rating}</h3>
            </li>
        </ul>
    )
};
function UserCardHeader( {user} ){
    return (
        <header>
            <h3>{user.name}</h3>
            <address>{user.email}</address>
        </header>
    )
};
function FooterButtons(){
    const [notificationName, setNotificationName] = useState('');
    const addNotfStatus = useSelector( getNotfAddStatus );

    const dpatch = useDispatch();

    useEffect(() => {
        if (notificationName.length > 0) {
            const time = moment().format('YYYY/MM/DD HH:mm:ss');
            const obj_ = {
                id: nanoid(),
                time,
                checked: false,
                from: 'A user',
                to: 'You',
                name: notificationName,
                content: emojis.content[notificationName]
            };
            dpatch(addNotf(obj_));
            if ( (addNotfStatus == 'idle') || (addNotfStatus == 'ok') )
                dpatch(addNotification(obj_));
        };
        setNotificationName('');
    }, [notificationName]);

    return(
        <div className="user__footer-btns">
            <button id="chat" onClick={(e) => setNotificationName(e.target.id) } className="chat-btn">CHAT</button>
            <button id="follow" onClick={(e) => setNotificationName(e.target.id)} className="follow-btn">FOLLOW</button>
        </div>
    )
};
export function ShowUser(){
    const { userId } = useParams();

    const user = useSelector( state => selectUserById(state, userId) );
    const postsOfUser = useSelector( state => getAllPostsByUserId(state, userId) );

    const [src, setSrc] = useState('');

    const [timeOut, setTimeOut] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            const randomIndex = Math.floor(Math.random() * 75) + 1
            const photo = 
                "https://xsgames.co/randomusers/assets/avatars/" + 
                user.gender + 
                "/" + 
                randomIndex.toString() + ".jpg";
            setSrc(photo);
        };
    }, [user]);
    
    useEffect(() => {
        if (!user) {
            const timeout_ = setTimeout(() => setMessage('notfound'), 2000);
            setTimeOut(timeout_);
        };
    }, []);

    useEffect( () => () => {
        clearTimeout(timeOut);
    }, []);      // componentWillUnmount

    if (!user && !message) return <Loader />;
    if ( message ) return <Navigate to="/users/404"/>;
    return (
        <section className="user-card">
            <div className="user__wrapper">
                <figure className="user__avatar">
                    <img src={src ? src : ''} alt="random_user_photo"/>
                </figure>
                <main className="user__info">
                    <UserCardHeader user={user} />
                    <SocialIcons />
                    <SocialStatusInfo user={user} countArticles={postsOfUser}/>
                    <FooterButtons />
                </main>
            </div>
        </section>
    );
}

