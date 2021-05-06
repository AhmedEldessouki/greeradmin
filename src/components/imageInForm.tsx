import React, {useState} from 'react'
import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'

import DeleteFromDB from './deleteFromDB'
import {Arrow} from './icons'

const $ImageWrapper = styled.div<{imgSrc: string}>`
  width: 250px;
  height: 150px;
  overflow: hidden;
  border: 20px solid var(--black);
  border-radius: var(--roundness);
  margin: 10px;
  background: url(${({imgSrc}) => imgSrc}) no-repeat center center;
  background-size: cover;
`
const $ImageDialogWrapper = styled.div`
  width: 300px;
  margin: 1px;
  display: flex;
  flex-direction: column;
  background: white;
  button {
    width: 100%;
    background: var(--black);
    border-color: black;
    border-radius: var(--roundness);
    display: flex;
    justify-content: center;
    :hover {
      background: rgba(var(--rgbBlack), 0.79);
    }
    div {
      height: 31px;
    }
  }
`
const $ChildWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
  overflow-y: scroll;
`

function ImageDialog({
  children,
  title,
  showDialog,
  changeShowDialog,
}: {
  children: React.ReactNode
  title: string
  showDialog: boolean
  changeShowDialog: () => void
}) {
  return (
    <$ImageDialogWrapper>
      <span style={{textAlign: 'center', padding: '5px'}}>{title}</span>
      <Button variant="contained" onClick={changeShowDialog}>
        <Arrow direction={showDialog ? 'up' : 'down'} />
      </Button>
      {showDialog && <$ChildWrapper>{children}</$ChildWrapper>}
    </$ImageDialogWrapper>
  )
}

function ImageInForm({src}: {src: string}) {
  return <$ImageWrapper imgSrc={src} />
}

function MultipleImageDialog({
  onDelDialogOne,
  onCleanDialogTwo,
  titleOne,
  titleTwo,
  dialogOneArr,
  dialogTwoArr,
}: {
  onDelDialogOne: (index: number) => void
  onCleanDialogTwo: () => void
  titleOne: string
  titleTwo: string
  dialogOneArr: Array<{[key: string]: unknown; preview: string}>
  dialogTwoArr: Array<{[key: string]: unknown; preview: string}>
}) {
  const [showDialogOne, setShowDialogOne] = useState(false)
  const [showDialogTwo, setShowDialogTwo] = useState(false)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '20px',
      }}
    >
      <ImageDialog
        title={titleOne}
        showDialog={showDialogOne}
        changeShowDialog={() => {
          setShowDialogTwo(false)
          setShowDialogOne(!showDialogOne)
        }}
      >
        {dialogOneArr.map(({preview}, index) => (
          <DeleteFromDB
            key={preview}
            dialogLabelledBy={preview}
            deleteFn={() => onDelDialogOne(index)}
            dialogDeleting={`this image`}
          >
            <ImageInForm src={preview} />
          </DeleteFromDB>
        ))}
      </ImageDialog>
      <ImageDialog
        title={titleTwo}
        showDialog={showDialogTwo}
        changeShowDialog={() => {
          setShowDialogOne(false)
          setShowDialogTwo(!showDialogTwo)
        }}
      >
        <DeleteFromDB
          dialogLabelledBy="reject images"
          deleteFn={onCleanDialogTwo}
          dialogDeleting={`all rejected images`}
        >
          <div />
        </DeleteFromDB>
        {dialogTwoArr.map(({preview}) => (
          <ImageInForm key={preview} src={preview} />
        ))}
      </ImageDialog>
    </div>
  )
}

export default MultipleImageDialog
