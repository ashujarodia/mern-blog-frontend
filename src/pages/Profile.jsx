import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import Blog from '../components/Blog';

const Profile = () => {
	const { user, setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
	const [blogs, setBlogs] = useState([]);

	const handleLogout = async () => {
		try {
			const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/users/logout`, { withCredentials: true });
			toast.success(data.message);
			setIsAuthenticated(false);
		} catch (error) {
			toast.error(error.response?.data?.message || 'Error while logging out');
			console.error('Error while logout:', error);
			setIsAuthenticated(true);
		}
	};
	const fetchBlogs = async () => {
		try {
			const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/blogs/getMyBlogs`, { withCredentials: true });
			setBlogs(data.blogs);
			setBlogs(data.blogs);
		} catch (error) {
			toast.error(error.response?.data?.message);
			console.error(error);
		}
	};

	useEffect(() => {
		fetchBlogs();
	}, []);
	if (!isAuthenticated) {
		return <Navigate to={'/login'} />;
	}

	return (
		<div className='container mx-auto py-8'>
			<div className='border-b mb-4'>
				<div className='p-4 flex justify-between'>
					<div>
						<h2 className='text-2xl font-semibold mb-2'>Hello {user.name}!</h2>
						<p className='mb-2'> {user.email}</p>
					</div>
					<div>
						<button
							onClick={handleLogout}
							className='py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
						>
							Logout
						</button>
					</div>
				</div>
			</div>
			<h2 className='text-center font-semibold text-2xl mt-8'>Your Blogs</h2>
			<div className='grid grid-cols-1 md:grid-cols-2  gap-6 mx-2 mt-4'>
				{blogs.length > 0 &&
					blogs?.map((blog) => (
						<Blog
							key={blog._id}
							blog={blog}
							fetchBlogs={fetchBlogs}
							profile={true}
						/>
					))}
			</div>
			{blogs.length < 1 && (
				<div className='text-center'>
					<p className='text-xl mb-4'>No blogs found</p>
					<Link
						className='text-blue-600 font-bold hover:underline'
						to={'/newBlog'}
					>
						Add a new blog
					</Link>
				</div>
			)}
		</div>
	);
};

export default Profile;
