import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { useEffect } from "react";
//*** */
import { AddUser } from "./AddUser"
import { fetchUsers, getUsersStatus, selectAllUsers } from "./usersSlice"
import { Loader } from '../../components/Loader';

function User( {id, name} ){
    return (
        <li className="user">
            <Link to={"/users/" + id}>{name}</Link>
        </li>
    )
};
export function Users(){
    const users = useSelector( selectAllUsers );
    const status = useSelector(getUsersStatus);
    const dpatch = useDispatch();
    
    useEffect(() => {
        if (status == 'idle') dpatch( fetchUsers() );
    }, [])

    if (status == 'loading') return <Loader />;
    return(
        <div className="users">
            <AddUser />
            <h1 className="users__title">Users</h1>
            <ul>
                { users.map((usr, i) => <User key={i} id={usr.id} name={usr.name}/>) }
            </ul>
        </div>
    )
}
//