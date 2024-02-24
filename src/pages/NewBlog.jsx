import axios from 'axios';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const NewBlog = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);

	const { isAuthenticated } = useContext(AuthContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER}/blogs/newBlog`,
				{ title, content },
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);
			toast.success(data.message);
			setTitle('');
			setContent('');
			setLoading(false);
		} catch (error) {
			toast.error(error.response.data.message);
			console.error(error);
			setLoading(false);
		}
	};

	if (!isAuthenticated) {
		return <Navigate to={'/login'} />;
	}

	return (
		<div className='my-8 mx-4 min-h-[70vh]'>
			<h1 className='text-2xl font-bold mb-4 text-center'>New Blog</h1>
			<form
				onSubmit={handleSubmit}
				className='max-w-md mx-auto mt-6'
			>
				<div className='mb-4'>
					<input
						type='text'
						id='title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className='w-full mt-1 p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:border-green-500'
						required
						placeholder='Add title here...'
					/>
				</div>
				<div className='mb-4'>
					<textarea
						id='title'
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className='w-full mt-1 p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:border-green-500'
						required
						placeholder='Add content here...'
					/>
				</div>
				<div className='flex w-full'>
					<button
						type='submit'
						className='w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600 active:scale-95 duration-300'
						disabled={loading}
					>
						{loading ? 'Posting ...' : 'Post'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewBlog;
