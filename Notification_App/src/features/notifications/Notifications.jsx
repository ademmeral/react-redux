import moment from "moment"
import { useDispatch, useSelector } from "react-redux";
import { FaCheck } from 'react-icons/fa';
import { memo, useEffect } from "react";
// ***** CUSTOM ONES *****
import { 
    updateReadNotification, 
    getNotfUpdateStatus,
    updateNotf,
    selectNotificationById,
    fetchNotifications,
    getNotfFetchStatus,
    sortNotificationsByDate
} from "./notificationSlice";

function CheckMark ({ checked, id }) {

    const findById = useSelector(state => selectNotificationById(state, id));
    const notfsUpdateStatus = useSelector(getNotfUpdateStatus);

    const dpatch = useDispatch();

    function handleChange (e) {
        dpatch(updateNotf({ id, checked : e.target.checked }));
        if ( (notfsUpdateStatus == 'idle') || (notfsUpdateStatus == 'ok') ) {
            dpatch(updateReadNotification({ ...findById, checked : e.target.checked }))
        };
    };

    return (
        <div className="check">
            <input type="checkbox" onChange={handleChange} checked={checked} />
        </div>
    )
};
function Read(){
    return (
        <div className="notf__read">
            <span>
                <FaCheck />
            </span>
            <small>read</small>
        </div>
    )
};
let Notification = ({from, content, time, checked, id, to, name}) => {

    return(
        <div className={ checked ? "notf read" : "notf"}>
            <div className="notf__left">
                <header className="notf__header">
                    <h4>{from}</h4>
                    <p>{ ( (name == 'follow') || (name == 'chat') ) ? content + " " + to : content }</p>
                </header>
                <time><small>{moment(time).subtract(2, 'seconds').fromNow()}</small></time>
            </div>
            <div className="notf__right">
                <CheckMark id={id} checked={checked}/>
                { checked ? <Read/> : '' }
            </div>
        </div>
    )
};
Notification = memo(Notification);          // memoization

export function Notifications(){
    const notfs = useSelector(sortNotificationsByDate);
    const status = useSelector(getNotfFetchStatus);

    const dpatch = useDispatch();

    useEffect(() => {
        if ( (status == 'idle') || (status == 'ok') ) dpatch( fetchNotifications() );
    }, []);

    return(
        <div className="notifications">
            <h1 className="notifications__title">Notifications</h1>
            { notfs.map( (notf, i) => {
                const {content, id, from, time, checked, name, to} = notf;
                return (
                        <Notification 
                            key={i} from={from} 
                            content={content} time={time} 
                            checked={checked}
                            id={id}
                            name={name}
                            to={to}
                        />
                    )
                })
            }
        </div>
    )
};
