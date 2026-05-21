// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'

const Navbar = () => {
  return (
    <LayoutNavbar
      overrideStyles={{
        borderBottom: '1px solid var(--mui-palette-divider)'
      }}
    >
      <NavbarContent />
    </LayoutNavbar>
  )
}

export default Navbar
