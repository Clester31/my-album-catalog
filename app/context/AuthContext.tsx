"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

interface AuthContextType {
    user: User | null;
    setCurrentCatalog: (catalog: string | null) => void;
    currentCatalog: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setCurrentCatalog: () => {},
    currentCatalog: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [currentCatalog, setCurrentCatalog] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setCurrentCatalog, currentCatalog }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);