import React from 'react'
import styled from '@emotion/styled'
import {Link} from 'react-router-dom'
import {mqMax} from '../../shared/utils'
import {Arrow} from '../icons'

const $BtnText = styled.span`
  color: var(--lightGray);
  font-size: var(--fontS);
  min-width: 25px;
`
const $BtnItem = styled('button')<{isBack: boolean}>`
  --bg: rgba(100, 100, 100, 0.7);
  display: flex;
  justify-content: ${({isBack}) => (isBack ? 'flex-end' : 'space-between')};
  align-items: center;
  flex-direction: ${({isBack}) => (isBack ? 'row-reverse' : 'row')};
  font-size: var(--fontS);
  width: 100%;
  padding: 10px 17px;
  gap: 10px;
  border: none;
  background: none;
  border-radius: var(--roundness);
  :hover,
  :focus-within,
  :focus-visible,
  :focus {
    outline: none;
    background: var(--bg);
  }
  ${mqMax.phoneLarge} {
    align-items: center;
  }
`
const $LinkItem = styled('div')`
  display: flex;
  justify-content: space-between;
  font-size: var(--fontS);
  height: 30px;
  padding: 10px;
  width: 100%;
  a {
    padding: 0 4px;
  }
`
function Item({
  onClick,
  href = '/',
  title,
  direction = 'down',
}: {
  onClick?: () => void
  href?: string
  direction?: 'left' | 'right' | 'down'
  title?: string
}) {
  // Checks If It's a Button
  if (!!onClick) {
    return (
      <$BtnItem isBack={title === 'Back'} onClick={onClick}>
        <$BtnText>{title}</$BtnText>
        <Arrow direction={direction} />
      </$BtnItem>
    )
  }
  return (
    <$LinkItem>
      <Link to={href}>{title}</Link>
    </$LinkItem>
  )
}

export default Item
