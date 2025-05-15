"use client";

import { useState } from "react";
import SignIn from "./SignIn";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../auth";

export default function Navbar() {
    const { user } = useAuth();
    const [showSignInPopup, setShowSignInPopup] = useState<boolean>(false);

    return (
        <div className="flex flex-row justify-between items-center border-b-2 border-white p-4 mx-4">
            <div className="w-1/3 flex justify-start items-center">
                <i className="fa-solid fa-circle-info text-2xl text-start"></i>
            </div>
            <div className="w-1/3 flex justify-center items-center">
                <h1 className="text-lg font-semibold">My Album Catalog</h1>
            </div>
            <div className="w-1/3 flex justify-end items-center">
                {user ? (
                    <button
                        className="bg-white text-black px-4 rounded"
                        onClick={() => {
                            signOut();
                            window.location.reload();
                        }}
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        className="bg-white text-black px-4 rounded"
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