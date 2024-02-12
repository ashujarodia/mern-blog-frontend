import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const NewBlog = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

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
		} catch (error) {
			toast.error(error.response.data.message);
			console.error(error);
		}
	};

	return (
		<div className='mt-8 mx-4'>
			<h1 className='text-2xl font-bold mb-4 text-center'>New Blog</h1>
			<form
				onSubmit={handleSubmit}
				className='max-w-md mx-auto mt-6'
			>
				<div className='mb-4'>
					<label
						htmlFor='caption'
						className='block text-gray-200 font-semibold'
					>
						Title -
					</label>
					<input
						type='text'
						id='title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className='w-full mt-1 p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
						required
					/>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='image'
						className='block text-gray-200 font-semibold'
					>
						Content -
					</label>
					<input
						type='text'
						id='title'
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className='w-full mt-1 p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
						required
					/>
				</div>
				<div className='flex w-full'>
					<button
						type='submit'
						className='w-full mt-7 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
					>
						Post
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewBlog;
