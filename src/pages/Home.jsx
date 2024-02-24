import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate } from 'react-router-dom';
import image from '../assets/bgimage.jpg';
import Blog from '../components/Blog';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchBlogs = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/blogs/getAllBlogs`, { withCredentials: true });
			setBlogs(data?.blogs.reverse());
			setLoading(false);
		} catch (error) {
			console.error(error);
			toast.error(error?.response?.data?.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			fetchBlogs();
		}
	}, []);

	if (!isAuthenticated) {
		return <Navigate to={'/login'} />;
	}

	return (
		<div className='mx-auto'>
			<div className='w-full relative'>
				<img
					src={image}
					alt=''
					className='w-full object-cover'
					style={{ maxHeight: '90vh' }}
				/>
				<div className='absolute mt-10 top-1/4 left-8'>
					<h1 className='md:text-7xl text-2xl text-green-300 font-bold'>
						Welcome to
						<br /> <span className='text-green-400'>Blog.</span>
					</h1>
				</div>
			</div>

			<div className='md:mx-8 mx-2'>
				<h1 className='text-3xl font-semibold mt-6 border-b border-b-green-400 pb-2 text-green-400'>Latest Blogs </h1>
				<div className='my-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
					{blogs.length > 0 &&
						blogs?.map((blog) => (
							<Blog
								key={blog._id}
								blog={blog}
								fetchBlogs={fetchBlogs}
							/>
						))}
				</div>
			</div>
			<div className='text-center w-full py-8 '>
				<Link
					className='text-green-400 font-bold hover:underline text-xl '
					to={'/newBlog'}
				>
					Add a new blog +
				</Link>
			</div>
		</div>
	);
};

export default Home;
