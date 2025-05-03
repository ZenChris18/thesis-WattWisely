import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginWithLocalStorage() {
    const username = useRef();
    const password = useRef();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("usernameData") && localStorage.getItem("passwordData");
        if (isAuthenticated) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.current.value === "WWuser" && password.current.value === "userWW") {
            localStorage.setItem("usernameData", "WWuser");
            localStorage.setItem("passwordData", "userWW");
            navigate("/");
        }
    }; 

    return(
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <div>
                    <input 
                        type="text" 
                        ref={username} 
                        className="h-[30px] w-64 text-[18px] border border-gray-300 px-2 rounded"
                        placeholder="Username"
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        ref={password} 
                        className="h-[30px] w-64 text-[18px] border border-gray-300 px-2 rounded"
                        placeholder="Password"
                    />
                </div>
                <button 
                    type="submit"
                    className="h-[30px] w-64 text-[20px] border border-gray-300 px-2 rounded bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                    Log In
                </button>
            </form>
        </div>
    );
}

export default LoginWithLocalStorage;