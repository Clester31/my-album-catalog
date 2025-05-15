"use client";

import { useState } from "react";
import SignIn from "./SignIn";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../auth";

export default function Navbar() {
    const { user } = useAuth();
    const [showSignInPopup, setShowSignInPopup] = useState<boolean>(false);

    return (
        <div className="flex flex-row justify-between items-center p-2 bg-gradient-to-b from-gray-100 to-gray-200 shadow-lg text-blue-800">
            <div className="w-1/3 flex justify-start items-center">
                <i className="fa-solid fa-circle-info text-3xl text-start"></i>
            </div>
            <div className="w-1/3 flex justify-center items-center">
                <h1 className="text-2xl font-semibold">My Album Catalog</h1>
            </div>
            <div className="w-1/3 flex justify-end items-center">
                {user ? (
                    <button
                        className="bg-blue-800 text-white px-4 text-lg rounded cursor-pointer hover:bg-blue-600 transition duration-150 ease-in-out"
                        onClick={() => {
                            signOut();
                            window.location.reload();
                        }}
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        className="bg-blue-800 px-4 rounded"
                        onClick={() => setShowSignInPopup(!showSignInPopup)}
                    >
                        Sign In
                    </button>
                )}
            </div>
            {showSignInPopup && <SignIn />}
        </div>
    );
}