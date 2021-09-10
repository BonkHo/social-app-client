// JSX & Hooks
import React, { createContext, useReducer } from "react";
// jwt Token decoder
import jwtDecode from "jwt-decode";

const initialState = {
	user: null,
};

// Checks to see if 'jwtToken' item exists in local storage
if (localStorage.getItem("jwtToken")) {
	const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
	// Checks to see if the decoded token is expired
	if (decodedToken.exp * 1000 < Date.now()) {
		localStorage.removeItem("jwtToken");
	} else {
		initialState.user = decodedToken;
	}
}

const AuthContext = createContext({
	user: null,
	login: (userData) => {},
	logout: () => {},
});

// Reducer recieves an action with a type and a payload and decides what to do

function authReducer(state, action) {
	switch (action.type) {
		case "LOGIN":
			return {
				...state,
				user: action.payload,
			};
		case "LOGOUT":
			return {
				...state,
				user: null,
			};
		default:
			return state;
	}
}

function AuthProvider(props) {
	const [state, dispatch] = useReducer(authReducer, initialState);
	function login(userData) {
		// Stores the user token in local storage
		localStorage.setItem("jwtToken", userData.token);
		dispatch({
			type: "LOGIN",
			payload: userData,
		});
	}

	function logout() {
		// Removes the user token in local storage
		localStorage.removeItem("jwtToken");
		dispatch({
			type: "LOGOUT",
		});
	}

	return (
		<AuthContext.Provider
			value={{ user: state.user, login, logout }}
			{...props}
		/>
	);
}

export { AuthContext, AuthProvider };
