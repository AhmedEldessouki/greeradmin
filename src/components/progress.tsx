import React from 'react'
import styled from '@emotion/styled'
import LinearProgress from '@material-ui/core/LinearProgress'

const $Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 37px;
`
const $Box = styled.div`
  width: 100%;
`
const $Span = styled.span`
  margin-left: 10px;
`
function Progress({progress}: {progress: number}) {
  return (
    <$Container>
      <$Box>
        <LinearProgress variant="determinate" value={progress} />
      </$Box>
      <$Span>{`${progress}%`}</$Span>
    </$Container>
  )
}

export default Progress
