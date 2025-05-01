import React, { useRef } from "react";
import App from "../../App.jsx";
//import "./LoginWithLocalStorage.css";

function LoginWithLocalStorage() {
    const username = useRef();
    const password = useRef();

    const getUsername = localStorage.getItem("usernameData");
    const getPassword = localStorage.getItem("passwordData");

    const handleSubmit =()=>{
        if(username.current.value === "WWuser" && password.current.value === "userWW"){
            localStorage.setItem("usernameData", "WWuser");
            localStorage.setItem("passwordData", "userWW");
        }
    } 

    return(
        <div className="flex justify-center items-center min-h-screen">
            {
                getUsername && getPassword?
                <App/>:
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <div>
                    <input type="text" 
                    ref={username} 
                    className="h-[30px] w-64 text-[18px] border border-gray-300 px-2 rounded"/>
                </div>
                <div>
                    <input type="password" 
                    ref={password} 
                    className="h-[30px] w-64 text-[18px] border border-gray-300 px-2 rounded"/>
                </div>
                <button 
                className="h-[30px] w-64 text-[20px] border border-gray-300 px-2 rounded">Log In</button>
            </form>
            }
        </div>
    );
}

export default LoginWithLocalStorage;