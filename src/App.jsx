import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import Profile from './pages/Profile';
import NewBlog from './pages/NewBlog';
import UserProfile from './pages/UserProfile';

const App = () => {
	const { setUser, setIsAuthenticated, setLoading } = useContext(AuthContext);
	useEffect(() => {
		setLoading(true);
		axios.get(`${import.meta.env.VITE_SERVER}/users/me`, { withCredentials: true })
			.then((res) => {
				setUser(res.data.user);
				setIsAuthenticated(true);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setUser({});
				setIsAuthenticated(false);
				setLoading(false);
			});
	}, []);
	return (
		<Router>
			<Toaster />
			<Navbar />
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/login'
					element={<Login />}
				/>
				<Route
					path='/register'
					element={<Register />}
				/>
				<Route
					path='/profile'
					element={<Profile />}
				/>
				<Route
					path='/newBlog'
					element={<NewBlog />}
				/>
				<Route
					path='/user/:id'
					element={<UserProfile />}
				/>
			</Routes>
			{/* <Footer /> */}
		</Router>
	);
};

export default App;
