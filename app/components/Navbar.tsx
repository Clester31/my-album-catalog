"use client";

import { useState } from "react";
import SignIn from "./SignIn";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../auth";

export default function Navbar() {
    const { user } = useAuth();
    const [showSignInPopup, setShowSignInPopup] = useState<boolean>(false);
    const [showHelp, setShowHelp] = useState<boolean>(false);

    return (
        <div className="flex flex-row justify-between items-center p-2 bg-gradient-to-b from-gray-100 to-gray-200 text-blue-800 border-b-4 border-gray-200">
            {/* Help Icon */}
            <div className="w-1/3 flex justify-start items-center">
                <i
                    className="fa-solid fa-circle-info text-3xl text-start cursor-pointer hover:text-blue-600 hover:scale-105 transition 150-ease-in-out"
                    onClick={() => setShowHelp(true)}
                ></i>
            </div>

            {/* Title */}
            <div className="w-1/3 flex justify-center items-center">
                <h1 className="text-2xl font-semibold">My Album Catalog</h1>
            </div>

            {/* Authentication Buttons */}
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
                        className="bg-blue-800 text-white px-4 py-1 text-lg rounded cursor-pointer hover:bg-blue-600 transition duration-150 ease-in-out"
                        onClick={() => setShowSignInPopup(!showSignInPopup)}
                    >
                        Sign In
                    </button>
                )}
            </div>

            {/* Sign In Popup */}
            {showSignInPopup && <SignIn />}

            {/* Help Modal */}
            {showHelp && (
                <div className="w-full h-full text-black absolute top-0 left-0 bg-black/50 flex flex-col items-center justify-center z-50">
                    <div className="bg-white p-8 flex flex-col gap-4 border-4 border-gray-300 rounded w-1/3 rounded-4xl items-center justify-center text-center">
                        <h1 className="text-xl font-semibold">Welcome to My Album Catalog!</h1>
                        <p>
                            The right side of the app is your catalog. This is where all your album
                            ratings/reviews will appear. Start by clicking the + button in the
                            controls section to create a new catalog. After you've added some items,
                            you can apply different filters and view your items in a yearly/monthly
                            format. The view catalog button will allow you and others to view your
                            catalog with editing restricted.
                        </p>
                        <p>
                            The left side of this page is where you will search for and rate/review
                            albums. You can collapse the view by clicking the caret icon on the far
                            left of the page. Anything you rate will be added to the catalog you
                            have currently selected in the controls area.
                        </p>
                        <p className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-400 text-xl font-bold">
                            Happy catalogging!
                        </p>
                        <button
                            className="px-4 py-2 bg-red-600 hover:bg-red-400 transition 150 ease-in-out text-white rounded-4xl cursor-pointer w-1/6 m-auto"
                            onClick={() => setShowHelp(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}