import { useState } from "react";
import { signInWithEmail, signUpWithEmail } from "../auth";

export default function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [signInType, setSignInType] = useState<string>('signIn');

    const handleSignIn = async () => {
        const user = await signInWithEmail(email, password);
        if (user) {
            console.log("User signed in:", user);
            window.location.reload();
        } else {
            console.error("Error signing in with email:", Error);
        }
    };

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }
        const user = await signUpWithEmail(email, password);
        if (user) {
            console.log("User signed up:", user);
            window.location.reload();
        } else {
            console.error("Error signing up with email:", Error);
        }
    };

    return (
        <div className="absolute top-15 right-0 mx-4 bg-gray-200 rounded-lg shadow-lg">
            {signInType === 'signIn' ? (
                <div className="flex flex-col p-4 gap-2">
                    <h1 className="text-lg font-semibold text-black text-center">Sign In</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-black border-2 border-gray-300 bg-white rounded-4xl px-4 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-black border-2 border-gray-300 bg-white rounded-4xl px-4 py-2"
                    />
                    <button
                        className="bg-blue-800 hover:bg-blue-600 transition 150 ease-in-out text-white px-4 rounded-xl h-8 cursor-pointer"
                        onClick={handleSignIn}
                    >
                        Sign In
                    </button>
                    <h1
                        className="font-semibold text-center text-blue-800 hover:text-blue-600 cursor-pointer"
                        onClick={() => setSignInType('signUp')}
                    >
                        Sign Up for an account
                    </h1>
                </div>
            ) : (
                <div className="flex flex-col p-4 gap-2">
                    <h1 className="text-lg font-semibold text-black text-center">Sign Up</h1>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-black border-2 border-gray-300 bg-white rounded-4xl px-4 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-black border-2 border-gray-300 bg-white rounded-4xl px-4 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="text-black border-2 border-gray-300 bg-white rounded-4xl px-4 py-2"
                    />
                    <button
                        className="bg-blue-800 hover:bg-blue-600 transition 150 ease-in-out text-white px-4 rounded-xl h-8 cursor-pointer"
                        onClick={handleSignUp}
                    >
                        Create Account
                    </button>
                    <h1
                        className="font-semibold text-center text-blue-800 hover:text-blue-600 cursor-pointer"
                        onClick={() => setSignInType('signIn')}
                    >
                        Sign In to Existing Account
                    </h1>
                </div>
            )}
        </div>
    );
}