/* eslint-disable react/prop-types */
import axios from 'axios';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Blog = ({ blog, fetchBlogs, profile }) => {
	const [comment, setComment] = useState('');

	const [blogUser, setBlogUser] = useState({});
	const [commentUsers, setCommentUsers] = useState([]);

	const { user } = useContext(AuthContext);
	const [showComments, setShowComments] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

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
		<div className='flex flex-col gap-3  bg-slate-100 text-black p-2 w-full  shadow-md py-5'>
			<div className='space-y-3 p-2'>
				<h2 className='font-bold text-xl text-center text-green-400'>{blog.title}</h2>
				<p className='text-justify text-gray-700'>{blog.content}</p>
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
									className='cursor-pointer active:scale-75 duration-300 '
									onClick={() => handleLike(blog._id)}
								/>
							)}
							<FaRegComment
								size={24}
								onClick={toggleComments}
								className='cursor-pointer active:scale-75 duration-300'
							/>
							{profile && (
								<MdDelete
									size={24}
									className='cursor-pointer active:scale-75 duration-300 '
									onClick={deleteBlog}
									color='red'
								/>
							)}
						</div>
						<span className='text-sm'>
							{blog?.likes?.length} {blog?.likes?.length > 1 ? 'likes' : 'like'}
						</span>
					</div>
					<span className='text-sm text-gray-800'>{moment(blog.createdAt).format('hh:mm A . DD MMM')}</span>
				</div>

				<div className='flex items-center justify-end'>
					Author -
					<Link
						to={user._id === blog.user ? '/profile' : `/user/${blog?.user}`}
						className='flex gap-2 items-center hover:underline rounded-full duration-300 active:scale-95 font-semibold pl-2'
					>
						{' '}
						{blogUser.name}
					</Link>
				</div>

				{/* Comments starts */}
				<div className='flex justify-center relative overflow-hidden'>
					<div
						className={`transition-transform ease-in-out duration-300 ${
							showComments ? 'translate-y-0' : 'translate-y-full hidden'
						} border border-gray-300 p-3 rounded-md w-full `}
					>
						<div className='space-y-3 '>
							<div className=' flex flex-col gap-3'>
								<h1 className='text-center'>Comments</h1>
								<button
									className='absolute right-2 top-2 font-bold text-lg'
									onClick={() => setShowComments(false)}
								>
									X
								</button>
								{blog.comments.length > 0 ? (
									blog.comments.map((comment, index) => (
										<div
											className='flex  items-center justify-between'
											key={comment._id}
										>
											<div className='flex flex-col my-1'>
												<Link
													to={`/user/${comment.author}`}
													className='text-sm font-semibold'
												>
													{commentUsers[index]?.name}
												</Link>
												<p className='font-bold text-gray-700'>{comment.content}</p>
											</div>
											{user._id === comment.author && (
												<button
													className='mr-4 hover:bg-gray-100 p-2 rounded-full active:scale-75 duration-300 hover:scale-90'
													onClick={() => deleteComment(comment._id)}
												>
													<MdDelete
														size={20}
														color='red'
													/>
												</button>
											)}
										</div>
									))
								) : (
									<div className='flex justify-center mb-5'>
										<span>No comments</span>
									</div>
								)}
							</div>

							<form
								className='flex gap-2 items-center '
								onSubmit={(e) => {
									handleComment(e, blog._id, comment);
									setComment('');
								}}
							>
								<input
									type='text'
									placeholder='Add a comment...'
									className=' p-2 rounded-lg border w-full border-gray-700'
									required
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
								<button
									className='bg-green-400 hover:bg-opacity-90 text-white  py-2 px-4 rounded-lg active:scale-75 duration-300'
									type='submit'
								>
									Add
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Blog;
