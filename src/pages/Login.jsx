import { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_SERVER}/users/login`,
				{ email, password },
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);
			localStorage.setItem('token', data.token);
			setIsAuthenticated(true);
			toast.success(data.message);
			navigate('/');

			setLoading(false);
		} catch (error) {
			console.error('Login failed!', error);
			toast.error(error?.response?.data?.message || 'Invalid Credentials');

			setLoading(false);
		}
	};

	if (isAuthenticated) {
		return <Navigate to={'/'} />;
	}

	return (
		<div className='flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold'>Login</h2>
				</div>
				<form
					onSubmit={handleSubmit}
					className='mt-8 space-y-6'
				>
					<input
						type='hidden'
						name='remember'
						value='true'
					/>
					<div className='shadow-sm -space-y-px '>
						<div>
							<label
								htmlFor='email'
								className='sr-only'
							>
								Email address
							</label>
							<input
								id='email'
								name='email'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-transparent '
								placeholder='Email address'
							/>
						</div>
						<div>
							<label
								htmlFor='password'
								className='sr-only'
							>
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-transparent '
								placeholder='Password'
							/>
						</div>
					</div>

					<div>
						<button
							type='submit'
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white'
							disabled={loading}
						>
							{loading ? 'Logingg in ...' : 'Login'}
						</button>
					</div>
				</form>
				<div className=''>
					Dont have an account?{' '}
					<Link
						className='font-semibold border-b'
						to={'/register'}
					>
						Register
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
