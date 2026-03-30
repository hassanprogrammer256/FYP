import { FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { Button } from './button'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/authSlice'
import { useToast } from './toast-context'
import { useNavigate } from 'react-router-dom'

function Header({ open, toggleSidebar,supervisor }) {
const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToast } = useToast()

  const handleLogout = () => {
    const data = dispatch(logout())
    try {
      if (data) {
        navigate('/auth')
        return addToast({ message: data?.message || 'Logged out Successfully', variant: 'success' })
      } else {
        return addToast({ message: data?.message || 'Something went wrong', variant: 'destructive' })
      }
    } catch (error) {
      return addToast({ message: error?.error || 'Something went wrong', variant: 'destructive' })
    }
  }

  return (
    <header className={`flex items-center justify-between px-4 py-3 ${supervisor ? 'bg-header-admin':'bg-sidebar'} fixed top-0 w-full left-0 `}>
      {/* Toggle button visible only on small screens */}
      <Button className="lg:hidden sm:block" onClick={toggleSidebar}>
    <FaBars size={30} className='text-white' />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow bg-white text-black"
        >
          <FaUser size={30} color='black' />
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Header