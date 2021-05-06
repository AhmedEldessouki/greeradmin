import React, {useState} from 'react'
import styled from '@emotion/styled'

import {useDropzone} from 'react-dropzone'
import {ImportedImages} from '../lib/apiTypes'

const $Container = styled.div<{isDragActive: boolean}>`
  display: flex;
  place-items: center;
  place-content: center;
  border: 4px dashed
    ${({isDragActive}) => (isDragActive ? `var(--blue)` : `var(--black)`)};
  height: 200px;
  text-align: center;
  cursor: pointer;
  margin: 18px;
  padding: 0;
  :hover,
  :focus {
    border-color: var(--blue);
  }
`

function Dropzone({
  onAcceptedImages,
  onRejectedImages,
}: {
  onAcceptedImages: (arr: ImportedImages) => void
  onRejectedImages: (arr: ImportedImages) => void
}) {
  const [isDragActive, setIsDragActive] = useState(false)

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    maxFiles: 10,
    maxSize: 8000000,
    onDropAccepted: acceptedFiles => {
      setIsDragActive(!isDragActive)

      const newArr = acceptedFiles.map(file => {
        return {file, preview: URL.createObjectURL(file)}
      })
      onAcceptedImages([...newArr])
    },
    onDropRejected: rejectedFiles => {
      setIsDragActive(!isDragActive)

      const newArr = rejectedFiles.map(({file}) => {
        return {file, preview: URL.createObjectURL(file)}
      })
      onRejectedImages([...newArr])
    },
    onDragEnter: () => {
      setIsDragActive(!isDragActive)
    },
    onDragLeave: () => {
      setIsDragActive(false)
    },
    onFileDialogCancel: () => {
      setIsDragActive(false)
    },
  })

  return (
    <$Container isDragActive={isDragActive} {...getRootProps()}>
      <em>Image(s) Drop Zone</em>
      <input
        id="dropZone"
        type="file"
        name="projectLogo"
        aria-label="ImageDropZone"
        {...getInputProps()}
      />
    </$Container>
  )
}

export default Dropzone
