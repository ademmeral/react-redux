import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
// ***** CUSTOM ONES *****
import { 
    deleteMarkedNotification, deleteNotfs, fetchNotifications, 
    getNotfDelStatus, 
    getNotfFetchStatus, 
    selectCheckedNotifications, selectUncheckedNotifications
} from "./features/notifications/notificationSlice";
// ******
function NotificationCounter({amount}){
    const [cls, setClass] = useState('');

    useEffect(() => {
        if (amount > 0) setClass("notfs__count");
        else setClass("notfs__count hidden");
    }, [amount]);

    return (
        <span className={cls}>{amount}</span>
    )
};
function NotificationTab({content}){
    const notfs = useSelector(selectUncheckedNotifications);
    const fetchNotfStatus = useSelector(getNotfFetchStatus);

    const dpatch = useDispatch();

    useEffect(() => {
        if ( (fetchNotfStatus == 'idle') ) dpatch(fetchNotifications());
    }, []);

    return (
        <Link to={content.toLowerCase()} className="tab">
            <h3 className={"header__tab " + content.toLowerCase()}>{content}</h3>
            <NotificationCounter amount={notfs.length}/>
        </Link>
    )
}
function Tab( {url} ){
    
    return (
        <Link to={url.toLowerCase()} className="tab">
            <h3 className="header__tab">{url}</h3>
        </Link>
    )
}; 
function Tabs(){
    return (
        <div className="header__tabs">
            { ['Posts', 'Users'].map( (txt, i) => <Tab key={i} url={txt} /> ) }
            <NotificationTab content="Notifications"/>
        </div>
    )
};
function DelButton({content}){
    const uncheckedNotfs = useSelector(selectUncheckedNotifications)
    const checkedNotfs = useSelector(selectCheckedNotifications)

    const delNotfStatus = useSelector(getNotfDelStatus);
    
    const dpatch = useDispatch();

    function handleClick(){
        if (checkedNotfs.length > 0) {
            dpatch(deleteNotfs(uncheckedNotfs));
            if ( (delNotfStatus == 'idle') || (delNotfStatus == 'ok') ) {
                dpatch(deleteMarkedNotification(checkedNotfs));
            }
        };
    }; 

    return <button className="header__refresh" onClick={handleClick}>{content}</button>
};
export function Nav(){
    return (
        <>
            <header className="app__header">
                <h1 className="header__title">
                    <Link to="/">Redux Example Feed App</Link>
                </h1>
                <div className="header__btns">
                    <Tabs />
                    <DelButton content="Refresh Notifications"/>
                </div>
            </header>
            <Outlet />
        </>
        )
}