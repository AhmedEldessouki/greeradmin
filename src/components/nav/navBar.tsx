import React from 'react'
import {useAuth} from '../../context/auth'
import NavItems from './navItems'

function NavBar() {
  const {user, signOut} = useAuth()

  return <NavItems signOut={signOut} user={!!user} />
}

export default NavBar
