import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Blog from '../components/Blog';

const Home = () => {
	const { isAuthenticated, user } = useContext(AuthContext);
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchBlogs = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/blogs/getAllBlogs`, { withCredentials: true });
			setBlogs(data?.blogs);
			setLoading(false);
		} catch (error) {
			console.error(error);
			toast.error(error?.response?.data?.message);
			setLoading(false);
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
			<h1 className='text-3xl font-bold mb-8 text-center'>Welcome to Blog .</h1>
			<div className='grid grid-cols-1 md:grid-cols-2  gap-6 mx-2'>
				{blogs.length > 0 &&
					blogs?.map((blog) => (
						<Blog
							key={blog._id}
							blog={blog}
							fetchBlogs={fetchBlogs}
						/>
					))}
			</div>
			{blogs.length < 1 && (
				<div className='text-center w-full'>
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

export default Home;
