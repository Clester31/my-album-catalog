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
        } else  {
            console.error("Error signing in with email:", Error);
        }
    }

    const handleSignUp = async () => {
        if(password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }
        const user = await signUpWithEmail(email, password);
        if (user) {
            console.log("User signed up:", user);
            window.location.reload();
        } else  {
            console.error("Error signing up with email:", Error);
        }
    }

    return (
        <div className="absolute top-15 right-0 mx-4 border-white border-2">
            {
                signInType === 'signIn' ?
                <div className="flex flex-col p-4 gap-2">
                    <h1 className="text-lg font-semibold text-center">Sign In</h1>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-white rounded p-2" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-white rounded p-2" />
                    <button className="bg-white text-black px-4 rounded h-8" onClick={() => handleSignIn()}>Sign In</button>
                    <h1 className="font-semibold text-center text-blue-300 hover:text-blue-100 cursor-pointer" onClick={() => setSignInType('signUp')}>Sign Up for an account</h1>
                </div>
                :
                <div className="flex flex-col p-4 gap-2">
                    <h1 className="text-lg font-semibold text-center">Sign Up</h1>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-white rounded p-2" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-white rounded p-2" />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border-2 border-white rounded p-2" />
                    <button className="bg-white text-black px-4 rounded h-8" onClick={() => handleSignUp()}>Create Account</button>
                    <h1 className="font-semibold text-center text-blue-300 hover:text-blue-100 cursor-pointer" onClick={() => setSignInType('signIn')}>Sign In to Existing Account</h1>
                </div>
            }
        </div>
    )
}