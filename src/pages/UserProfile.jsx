import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
	const [blogUser, setBlogUser] = useState({});
	const { id } = useParams();
	const fetchUserDetail = async () => {
		try {
			const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/users/getUserProfile/${id}`, { withCredentials: true });
			setBlogUser(data?.user);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchUserDetail();
	}, []);
	return (
		<div className='flex flex-col items-center justify-center h-full my-8 mx-4'>
			<div className='max-w-md w-full bg-gray-800 shadow-md rounded-lg overflow-hidden'>
				<div className='p-4'>
					<h2 className='text-2xl font-semibold mb-2'>Profile</h2>
					<div className='mb-4'>
						<p>Name - {blogUser.name}</p>
						<p>Email - {blogUser.email}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
