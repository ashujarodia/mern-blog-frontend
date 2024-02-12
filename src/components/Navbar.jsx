import { Link } from 'react-router-dom';
import { MdAdd, MdPerson } from 'react-icons/md';

const Navbar = () => {
	return (
		<nav className='border-b p-4 z-50'>
			<div className='container mx-auto flex justify-between items-center'>
				<div className='flex items-center flex-shrink-0 text-white mr-6'>
					<Link
						className='font-semibold text-xl tracking-tight uppercase'
						to={'/'}
					>
						Blog .
					</Link>
				</div>
				<div className='flex justify-center items-center space-x-4'>
					<Link to={'/newBlog'}>
						<MdAdd size={24} />
					</Link>
					<Link to={'/profile'}>
						<MdPerson size={24} />
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
