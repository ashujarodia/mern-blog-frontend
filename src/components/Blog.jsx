/* eslint-disable react/prop-types */
import moment from 'moment';
import { useContext, useEffect, useMemo, useState } from 'react';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import toast from 'react-hot-toast';

const Blog = ({ blog, fetchBlogs, profile }) => {
	const [comment, setComment] = useState('');

	const [blogUser, setBlogUser] = useState({});
	const [commentUsers, setCommentUsers] = useState([]);

	const { user } = useContext(AuthContext);
	const randomColor = useMemo(() => {
		const colors = [
			'#f44336',
			'#e91e63',
			'#9c27b0',
			'#673ab7',
			'#3f51b5',
			'#2196f3',
			'#03a9f4',
			'#00bcd4',
			'#009688',
			'#4caf50',
			'#8bc34a',
			'#cddc39',
			'#ffeb3b',
			'#ffc107',
			'#ff9800',
			'#ff5722',
			'#795548',
			'#607d8b',
		];
		return colors[Math.floor(Math.random() * colors.length)];
	}, []);
	const [showComments, setShowComments] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	const firstLetter = useMemo(() => {
		return blogUser.name ? blogUser.name.charAt(0).toUpperCase() : '';
	}, [blogUser.name]);

	const toggleComments = () => {
		setShowComments(!showComments);
	};

	const fetchUserDetail = async (user) => {
		try {
			const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/users/getUserProfile/${user}`, { withCredentials: true });
			setBlogUser(data?.user);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchCommentUsers = async (comments) => {
		try {
			const userIds = comments.map((comment) => comment.author);
			const usersPromises = userIds.map(async (userId) => {
				const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/users/getUserProfile/${userId}`, { withCredentials: true });
				return data.user;
			});
			const users = await Promise.all(usersPromises);
			setCommentUsers(users);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteComment = async (commentId) => {
		try {
			const { data } = await axios.delete(`${import.meta.env.VITE_SERVER}/blogs/deleteComment/${blog._id}/${commentId}`, { withCredentials: true });
			toast.success(data.message);
			fetchBlogs();
		} catch (error) {
			console.error(error);
		}
	};

	const handleLike = async (id) => {
		try {
			await axios.post(`${import.meta.env.VITE_SERVER}/blogs/likeBlog/${id}`, {}, { withCredentials: true });
			fetchBlogs();
		} catch (error) {
			console.error(error);
			toast.error(error.response.data.message);
		}
	};

	const deleteBlog = async () => {
		try {
			const { data } = await axios.delete(`${import.meta.env.VITE_SERVER}/blogs/deleteBlog/${blog._id}`, { withCredentials: true });
			toast.success(data.message);
			fetchBlogs();
		} catch (error) {
			console.error(error);
			toast.error(error.response.data.message);
		}
	};

	const handleComment = async (e, id, comment) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(`${import.meta.env.VITE_SERVER}/blogs/addComment/${id}`, { content: comment }, { withCredentials: true });
			toast.success(data.message);
			fetchBlogs();
		} catch (error) {
			console.error(error);
			toast.error(error.response.data.message);
		}
	};

	useEffect(() => {
		setIsLiked(blog.likes.includes(user._id));
	}, [blog.likes, user._id]);

	useEffect(() => {
		fetchUserDetail(blog.user);
	}, []);

	useEffect(() => {
		fetchCommentUsers(blog.comments);
	}, [blog.comments]);

	return (
		<>
			<div className='flex flex-col gap-3  bg-gray-900 p-2 rounded-md w-full'>
				<div className='flex gap-2 items-center justify-between'>
					<Link
						to={user._id === blog.user ? '/profile' : `/user/${blog?.user}`}
						className='flex gap-2 items-center hover:bg-black w-full p-2 rounded-md duration-300 active:scale-95'
					>
						<div
							className='w-8 h-8 rounded-full flex items-center justify-center'
							style={{ backgroundColor: randomColor }}
						>
							<span className='text-white'>{firstLetter}</span>
						</div>
						<span>{blogUser.name}</span>
					</Link>
					{profile && (
						<button
							className='mr-4 hover:bg-black p-2 rounded-full active:scale-75 duration-300'
							onClick={deleteBlog}
						>
							<MdDelete size={20} />
						</button>
					)}
				</div>
				<div className='space-y-3 p-2'>
					<h2 className='font-bold text-xl'>{blog.title}</h2>
					<p>{blog.content}</p>
					<div className='flex justify-between items-end'>
						<div className='flex flex-col gap-1'>
							<div className='flex gap-4'>
								{isLiked ? (
									<FaHeart
										size={24}
										onClick={() => handleLike(blog._id)}
										className='cursor-pointer active:scale-75 duration-300 '
										color='red'
									/>
								) : (
									<FaRegHeart
										size={24}
										className='cursor-pointer active:scale-75 duration-300 hover:text-red-500'
										onClick={() => handleLike(blog._id)}
									/>
								)}
								<FaRegComment
									size={24}
									onClick={toggleComments}
									className='cursor-pointer active:scale-75 duration-300 hover:text-red-500'
								/>
							</div>
							<span className='text-sm'>
								{blog?.likes?.length} {blog?.likes?.length > 1 ? 'likes' : 'like'}
							</span>
						</div>
						<span className='text-sm text-gray-300'>{moment(blog.createdAt).format('hh:mm A . DD MMM')}</span>
					</div>
				</div>
			</div>
			{/* Comments modal */}
			<div
				className={`fixed inset-0 bg-black opacity-40 ${showComments ? '' : 'hidden'}`}
				onClick={() => setShowComments(false)}
			></div>
			<div className='flex justify-center'>
				<div
					className={`fixed bottom-0   w-full transition-transform bg-gray-800 rounded-t-xl ease-in duration-300 transform px-3 max-h-96 overflow-y-auto z-50 ${
						showComments ? 'translate-y-0' : 'translate-y-full'
					} md:max-w-[768px]`}
				>
					<button
						className='absolute top-3 right-3 active:scale-75 hover:bg-gray-900 rounded-full p-1 duration-300'
						onClick={() => setShowComments(false)}
					>
						<IoMdClose size={22} />
					</button>
					<div className='space-y-3'>
						<div className='py-14 flex flex-col gap-3'>
							{blog.comments.length > 0 ? (
								blog.comments.map((comment, index) => (
									<div
										className='flex  items-center justify-between'
										key={comment._id}
									>
										<Link
											to={`/user/${comment.author}`}
											className='flex gap-2 hover:bg-gray-900 duration-300 p-2 rounded-md w-full'
										>
											<div
												className='w-6 h-6 rounded-full flex items-center justify-center'
												style={{ backgroundColor: randomColor }}
											>
												<span className='text-white'>
													{commentUsers[index]?.name.charAt(0).toUpperCase()}
												</span>
											</div>
											<div className='flex flex-col'>
												<span className='text-xs font-bold'>{commentUsers[index]?.name}</span>
												<p className='text'>{comment.content}</p>
											</div>
										</Link>
										{user._id === comment.author && (
											<button
												className='mr-4 hover:bg-gray-900 p-2 rounded-full active:scale-75 duration-300'
												onClick={() => deleteComment(comment._id)}
											>
												<MdDelete size={20} />
											</button>
										)}
									</div>
								))
							) : (
								<div className='flex justify-center'>
									<span>No comments</span>
								</div>
							)}
						</div>

						<form
							className='flex gap-2 items-center sticky bottom-4 left-0 w-full'
							onSubmit={(e) => {
								handleComment(e, blog._id, comment);
								setComment('');
							}}
						>
							<input
								type='text'
								placeholder='Add a comment...'
								className='bg-gray-800 p-2 rounded-lg border w-full'
								required
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
							<button
								className='bg-white hover:bg-gray-300 text-black  py-2 px-4 rounded-lg active:scale-75 duration-300'
								type='submit'
							>
								Add
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Blog;
