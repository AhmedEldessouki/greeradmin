import React, {useState} from 'react'
import styled from '@emotion/styled'

import {mqMax} from '../../shared/utils'
import Item from './item'

const $NavItemsContainer = styled.div`
  display: flex;
  gap: 50px;
  z-index: 200;
  position: relative;

  ${mqMax.phoneLarge} {
    max-height: 100vh;
    flex-direction: column;
    align-items: flex-start !important;
    gap: 10px;
    justify-content: space-around;
    padding: 0 20px;
    align-items: center;
  }
  ${mqMax.s} {
    gap: 10px;
  }
`

function NavItems({
  isSubMenuOpen,
  setOpenSubMenu,
  signOut,
  user,
}: {
  isSubMenuOpen: boolean
  setOpenSubMenu: React.Dispatch<React.SetStateAction<boolean>>
  signOut: () => Promise<void> | null
  user: boolean
}) {
  const [menuHeight, setMenuHeight] = useState(0)

  return (
    <>
      <$NavItemsContainer>
        <Item href="/" title="Home" />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Item
            onClick={() => {
              setOpenSubMenu(!isSubMenuOpen)
              setMenuHeight(0)
            }}
            title="Works"
            direction={isSubMenuOpen ? 'down' : 'left'}
          />
        </div>
        <Item href="/" title="Reels" />
        <Item href="/" title="Contact" />
        {user && <Item onClick={signOut} title="SignOut" />}
      </$NavItemsContainer>
    </>
  )
}

export default NavItems
