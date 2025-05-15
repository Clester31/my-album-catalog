import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        console.error("Error signing in with email:", error);
        return null;
    }
}

export const signUpWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // add user to users collection
        try {
            await setDoc(doc(db, "users", user.uid), {
                id: user.uid,
                email: user.email,
                catalogs: [],
            });
        } catch (error) {
            console.error("unable to update user collection:", error);
        }

        return user;
    } catch (error) {
        console.error("Error signing up with email:", error);
        return null;
    }
}

export const signOut = async () => {
    try {
        await auth.signOut();
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Error signing out:", error);
    }
}
