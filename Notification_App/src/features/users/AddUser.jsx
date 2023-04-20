import { useEffect, useState } from "react";
import { userAdded } from "./usersSlice";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { generateEmail } from "email-generator";
import { setGender, setRating } from "../../modules/modules";

export function AddUser(){
    const [name, setName] = useState('')
    const dpatch = useDispatch()
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (name.length > 0) setDisabled(false)
        else setDisabled(true);
    },[name]);
    
    function handleSubmit(){
        if(name){
            const infos = {
                name,
                id : nanoid(),
                email : generateEmail().split('"')[1],
                gender  : setGender(),
                rating : setRating(),
            }
            dpatch( userAdded( infos ) )
        }
        setName('')
    };
    function handleChange(e){
        setName(e.target.value)
    };

    return (
        <div className="add-user">
            <form onSubmit={(e) => e.preventDefault() }>
                <input 
                    type="text" 
                    maxLength={30} 
                    minLength={5} 
                    value={name}
                    name="name" 
                    placeholder="Add a user..."
                    onChange={handleChange}
                />
                <button 
                    type="submit" 
                    className={disabled ? 'add-user-btn disabled' : 'add-user-btn'} 
                    onClick={handleSubmit}
                >Submit
                </button>
            </form>
        </div>
    )
}