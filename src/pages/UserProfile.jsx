import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Blog from '../components/Blog';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const UserProfile = () => {
	const [blogUser, setBlogUser] = useState({});
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(false);

	const { isAuthenticated } = useContext(AuthContext);

	const { id } = useParams();
	const fetchUserDetail = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/users/getUserProfile/${id}`, { withCredentials: true });
			setBlogUser(data?.user);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const fetchBlogs = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/blogs/getUserBlogs/${id}`, { withCredentials: true });
			setBlogs(data.blogs);
			setLoading(false);
		} catch (error) {
			toast.error(error.response?.data?.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserDetail();
		fetchBlogs();
	}, [id]);

	if (!isAuthenticated) {
		return <Navigate to={'/login'} />;
	}

	if (loading) {
		return <Loader />;
	}

	return (
		<div className='flex flex-col items-center justify-center h-full my-8 mx-4'>
			<div className='max-w-md w-full bg-gray-100 rounded-lg overflow-hidden'>
				<div className='p-4'>
					<h2 className='text-2xl font-semibold mb-2 text-center text-green-400'>{blogUser.name}</h2>
				</div>
			</div>
			<h2 className='text-center font-semibold text-2xl mt-8'> Blogs</h2>
			<div className='grid grid-cols-1 md:grid-cols-2  gap-6 mx-2 mt-4'>
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

export default UserProfile;
