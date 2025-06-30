import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMyData } from '../services/storageService';

const MyAuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [loggedInUser, setLoggedInUser] = useState(null);

	useEffect(() => {
		// check localStorage for existing session
		const existingUser = localStorage.getItem('myLoggedUser');
		if (existingUser) {
			try {
				const userData = JSON.parse(existingUser);
				setLoggedInUser(userData);
			} catch (e) {
				// invalid JSON in localStorage, clear it
				localStorage.removeItem('myLoggedUser');
			}
		}
	}, []);

	const performLogin = (email, password) => {
		const appData = getMyData();
		const allUsers = appData.users;
		
		// manually find user instead of using .find()
		let foundUser = null;
		for (let i = 0; i < allUsers.length; i++) {
			const u = allUsers[i];
			if (u.email === email && u.password === password) {
				foundUser = u;
				break;
			}
		}

		if (foundUser) {
			const userInfo = { 
				email: foundUser.email, 
				role: foundUser.role, 
				id: foundUser.id, 
				name: foundUser.name,
				patientId: foundUser.patientId 
			};
			
			setLoggedInUser(userInfo);
			localStorage.setItem('myLoggedUser', JSON.stringify(userInfo));
			
			return userInfo;
		}
		
		return null;
	};

	const performLogout = () => {
		setLoggedInUser(null);
		localStorage.removeItem('myLoggedUser');
	};

	return (
		<MyAuthContext.Provider value={{ 
			user: loggedInUser, 
			login: performLogin, 
			logout: performLogout 
		}}>
			{children}
		</MyAuthContext.Provider>
	);
};

export const useAuth = () => useContext(MyAuthContext);