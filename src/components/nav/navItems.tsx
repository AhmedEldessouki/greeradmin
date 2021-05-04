import React from 'react'
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
  signOut,
  user,
}: {
  signOut: () => Promise<void> | null
  user: boolean
}) {
  return (
    <>
      <$NavItemsContainer>
        <Item href="/" title="Home" />
        {user && (
          <>
            <Item href="/control-unit" title="Control Unit" />
            <Item onClick={signOut} title="SignOut" />
          </>
        )}
      </$NavItemsContainer>
    </>
  )
}

export default NavItems
