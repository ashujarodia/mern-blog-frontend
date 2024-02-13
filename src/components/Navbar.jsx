import { Link } from 'react-router-dom';
import { MdAdd, MdPerson } from 'react-icons/md';

const Navbar = () => {
	return (
		<nav className='border-b border-b-gray-600 p-4 z-50'>
			<div className='container mx-auto flex justify-between items-center'>
				<div className='flex items-center flex-shrink-0 text-white mr-6'>
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
						className=' hover:bg-red-500 p-2 rounded-full active:scale-75 bg-gray-900 duration-300'
					>
						<MdAdd size={24} />
					</Link>
					<Link
						className=' hover:bg-red-500 p-2 rounded-full active:scale-75 bg-gray-900 duration-300'
						to={'/profile'}
					>
						<MdPerson size={24} />
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
