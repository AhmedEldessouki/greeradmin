import React, {useState} from 'react'
import {useAuth} from '../../context/auth'
import NavItems from './navItems'

function NavBar() {
  const [isSubMenuOpen, setOpenSubMenu] = useState(false)
  const {user, signOut} = useAuth()

  return (
    <NavItems
      isSubMenuOpen={isSubMenuOpen}
      setOpenSubMenu={setOpenSubMenu}
      signOut={signOut}
      user={!!user}
    />
  )
}

export default NavBar
