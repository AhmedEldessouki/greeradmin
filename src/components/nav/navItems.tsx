import React from 'react'
import styled from '@emotion/styled'

import {mqMax} from '../../shared/utils'
import Item from './item'

const $NavItemsContainer = styled.div`
  display: flex;
  gap: 50px;
  z-index: 200;
  position: relative;
  align-items: center;

  ${mqMax.phoneLarge} {
    max-height: 100vh;
    gap: 10px;
    justify-content: space-around;
    align-items: center;
  }
  ${mqMax.s} {
    gap: 10px;
  }
`

function NavItems({signOut}: {signOut: () => Promise<void> | null}) {
  return (
    <>
      <$NavItemsContainer>
        <Item href="/" title="Home" />
        <Item href="/control-unit" title="Control Unit" />
        <Item onClick={signOut} title="SignOut" />
      </$NavItemsContainer>
    </>
  )
}

export default NavItems
