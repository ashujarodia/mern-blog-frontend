import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({ isAuthenticated: false });

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
	const [user, setUser] = useState({});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		localStorage.setItem('isAuthenticated', isAuthenticated);
	}, [isAuthenticated]);

	return <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading, setLoading, user, setUser }}>{children}</AuthContext.Provider>;
};
