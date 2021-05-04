import React from 'react'
import styled from '@emotion/styled'
import {XIcon} from './icons'

const $CloseButton = styled.button`
  position: relative;
  z-index: 999999;
  top: -44vh;
  right: -34vw;
  border: none;
  background: transparent;
`

function CloseButton({
  handleClick,
  ...overRides
}: {
  handleClick: () => void
  overRides?: React.ButtonHTMLAttributes<HTMLButtonElement>
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <$CloseButton onClick={handleClick} {...overRides}>
      <XIcon />
    </$CloseButton>
  )
}
const $Button = styled.button<{customBg?: string; customColor?: string}>`
  border: none;
  background: ${({customBg}) => customBg ?? `#10c110`};
  padding: 10px 28px;
  color: ${({customColor}) => customColor ?? `var(--lightGray)`};
  border-radius: calc(var(--roundness) * 2);
  font-weight: 900;
  font-size: 20px;
  letter-spacing: 0.5px;
`
function Button({
  handleClick,
  children,
  customBg,
  customColor,
  ...overRides
}: {
  handleClick?: () => void
  children: string
  customBg?: string
  customColor?: string
  overRides?: React.ButtonHTMLAttributes<HTMLButtonElement>
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <$Button
      customBg={customBg}
      customColor={customColor}
      onClick={handleClick}
      {...overRides}
    >
      {children}
    </$Button>
  )
}

export {CloseButton, Button}
