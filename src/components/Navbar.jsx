import { Link } from 'react-router-dom';
import { MdAdd, MdPerson } from 'react-icons/md';

const Navbar = () => {
	return (
		<nav className='py-3 z-50 bg-gray-100'>
			<div className='mx-4 flex justify-between items-center'>
				<div className='flex items-center flex-shrink-0  mr-6'>
					<Link
						className='font-semibold text-xl tracking-tight uppercase active:scale-90 duration-300'
						to={'/'}
					>
						Blog .
					</Link>
				</div>
				<div className='flex justify-center items-center space-x-4'>
					<Link
						to={'/newBlog'}
						className=' hover:bg-gray-300 p-1 rounded-full active:scale-75 bg-gray-200 duration-300'
					>
						<MdAdd
							size={24}
							color='green'
						/>
					</Link>
					<Link
						className='hover:bg-gray-300 p-1 rounded-full active:scale-75 bg-gray-200 duration-300'
						to={'/profile'}
					>
						<MdPerson
							size={24}
							color='green'
						/>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
