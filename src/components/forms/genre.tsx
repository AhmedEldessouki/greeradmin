import React, {useCallback, useEffect, useRef, useState} from 'react'
import {keyframes} from '@emotion/react'

import styled from '@emotion/styled'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import {nanoid} from 'nanoid'
import {CSSTransition} from 'react-transition-group'
import {postTwoLevelDeep} from '../../lib/post'
import {getTwoLevelDeep} from '../../lib/get'
import {$Warning, mqMax} from '../../shared/utils'
import {deleteTwoLevelDeep} from '../../lib/delete'
import {notify} from '../../lib/notify'
import {useAsync} from '../../lib/useAsync'
import DeleteFromDB from '../deleteFromDB'

import type {GenreCollection} from '../../lib/dbTypes'
import type {GenreType, GenreTypeGroup} from '../../lib/apiTypes'
import {$Field} from './sharedCss/field'

type GenreDisplayPropType = {
  genreName: string
  children: JSX.Element
  genreType?: GenreCollection
  onError: (error: Error) => void
  onSuccess: () => void
}

const $Container = styled.div`
  --borderWidth: 4px;
  --width: 400px;
  svg {
    fill: var(--black);
  }
  ${mqMax.s} {
    --width: 300px;
  }
  ${mqMax.xs} {
    --width: 262px;
  }
`
const slideIn = keyframes`
from {
  height: 0;
  overflow: hidden;
}
to {
  height: 23px;
}
`

const $CloseButtonContainer = styled.div`
  width: var(--width);
  display: flex;
  justify-content: flex-end;
  margin-left: 24px;
  animation: ${slideIn} 500ms ease-in;
`
const $AddGenre = styled.div`
  display: flex;
  padding-top: 10px;
  button {
    border-start-start-radius: 0px !important;
    border-end-start-radius: 0px !important;
    margin-bottom: 5px;
    min-height: 20px;
  }
`
const $SelectedContainer = styled.div`
  z-index: 10;
  background: var(--lightGray);
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(50px, 1fr));
  grid-template-columns: repeat(auto-fit, 130px);
  align-items: center;
  border: var(--borderWidth) solid var(--black);
  border-radius: var(--roundness);
  transition: height 500ms ease-in-out;
  grid-auto-rows: 55px;
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    transition: height 500ms ease-in-out;
  }
  ${mqMax.xs} {
    grid-template-columns: repeat(auto-fit, 81px);
  }
`
const $SelectLabel = styled.span`
  color: var(--lightGray);
  background: var(--black);
  padding: 18px;
  cursor: pointer;
  ${mqMax.xs} {
    padding: 18px 6px;
  }
`
const $ChoiceContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  margin: 10px;
  transition: height 500ms ease-in-out;
  button {
    margin: 0px auto;
    background: #6376dd59;
    opacity: 0.7;
  }
  ${mqMax.xs} {
    gap: 10px;
  }
`
const $FirstContainer = styled.div`
  border: var(--borderWidth) solid var(--black);
  border-radius: var(--roundness);
  overflow: hidden;
  padding: 6px;
  border-bottom: none;
  border-end-end-radius: 0px !important;
  border-end-start-radius: 0px !important;
  width: var(--width);
  transition: height 500ms ease-in-out;
`
const $SecondContainer = styled.div<{hide: boolean}>`
  transition: height 500ms ease-in-out;
  border: var(--borderWidth) solid var(--black);
  border-radius: var(--roundness);
  ${({hide}) => (hide ? `padding: 6px;` : `padding: 0 6px;`)}
  overflow: hidden;
  border-top: none;
  border-start-start-radius: 0;
  width: var(--width);
  border-start-end-radius: 0;
  display: flex;
  flex-direction: column;
  justify-content: end;
`

function GenreDisplay({
  genreName,
  children,
  genreType,
  onError,
  onSuccess,
}: GenreDisplayPropType) {
  async function deleteGenre() {
    if (!genreType) return
    const {isSuccessful, error} = await deleteTwoLevelDeep({
      collection: 'other',
      doc: 'genre',
      subCollection: genreType,
      subDoc: genreName,
    })
    if (isSuccessful) {
      notify('👍🏻', `${genreName} Deleted!`, {
        color: 'var(--green)',
      })
      onSuccess()
    } else if (error) {
      notify('👎🏻', `something went wrong!`, {
        color: 'var(--red)',
      })
      onError(error)
    }
  }
  return (
    <DeleteFromDB
      dialogDeleting={`${genreName} from ${genreType}`}
      dialogLabelledBy={`deleting ${genreName} from ${genreType}`}
      deleteFn={deleteGenre}
    >
      {children}
    </DeleteFromDB>
  )
}

function Genre({
  onChange,
  selectedGenres,
}: {
  onChange: (arg: GenreTypeGroup) => void
  selectedGenres: GenreTypeGroup
}) {
  const {status, dispatch} = useAsync()
  const [genres, setGenres] = useState<GenreTypeGroup>([])
  const [newGenre, setNewGenre] = useState('')
  const [genreError, setGenreError] = useState('')
  const [genreType, setGenreType] = useState<GenreCollection>()
  const [newGenreValidation, setNewGenreValidation] = useState<ValidityState>()
  const [height, setHeight] = useState<number>(0)

  const [show, setShow] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const secondRef = useRef<HTMLDivElement | null>(null)
  const thirdRef = useRef<HTMLDivElement | null>(null)
  const fourthRef = useRef<HTMLSpanElement | null>(null)

  function adjustHeight(): void {
    setHeight(
      () =>
        (secondRef.current?.offsetHeight ?? 0) +
        (thirdRef.current?.offsetHeight ?? 0) +
        40,
    )
  }

  useEffect(() => {
    if (!genreError) return
    fourthRef.current &&
      setHeight(no => no + (fourthRef.current?.offsetHeight ?? 0) + 14)
  }, [genreError])

  const handleSubmit = async () => {
    setGenreError('')
    if (!genreType) return
    if (newGenre.length <= 2) return
    const newGenresArray = genres.concat(selectedGenres)

    if (newGenresArray?.filter(item => item.name === newGenre).length > 0) {
      setGenreError('Already exists')
      return
    }

    dispatch({type: 'pending'})
    setIsPending(true)

    const newData = {name: newGenre, id: nanoid()}

    const {isSuccessful, error} = await postTwoLevelDeep<GenreType>({
      collection: 'other',
      doc: 'genre',
      subCollection: genreType,
      subDoc: newData.name,
      data: newData,
    })

    if (isSuccessful) {
      notify('👍🏻', `${newData.name} Added!`, {
        color: 'var(--green)',
      })
      setGenres(genres.concat(newData))
      setNewGenre('')
      dispatch({type: 'resolved'})
      adjustHeight()
    } else if (error) {
      notify('👎🏻', `something went wrong!`, {
        color: 'var(--red)',
      })
      setGenreError(error.message)
      dispatch({type: 'rejected'})
    }

    setIsPending(false)
  }

  const fetchData = useCallback(async () => {
    if (!genreType) return
    const {data, error} = await getTwoLevelDeep<GenreType>({
      collection: 'other',
      doc: 'genre',
      subCollection: genreType,
    })
    if (data) {
      setGenres(data.sort((a, b) => a.name.localeCompare(b.name)))
    } else if (error) {
      setGenreError(error.message)
    }
  }, [genreType])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!secondRef.current?.offsetHeight) return
    adjustHeight()
  }, [selectedGenres])

  return (
    <$Container>
      {genreType && (
        <$CloseButtonContainer>
          <IconButton
            aria-label="exit genre"
            size="small"
            onClick={() => {
              setShow(false)
              setGenreType(undefined)
            }}
          >
            <CloseIcon />
          </IconButton>
        </$CloseButtonContainer>
      )}
      <$FirstContainer>
        {!genreType && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
            }}
          >
            <Button
              onClick={() => {
                setGenreType('music')
              }}
              variant="outlined"
              color="primary"
            >
              music
            </Button>
            <Button
              onClick={() => {
                setGenreType('movie')
              }}
              style={{borderColor: 'var(--black)', color: 'var(--black)'}}
              variant="outlined"
            >
              movie
            </Button>
          </div>
        )}
        {genreType && (
          <$SelectedContainer>
            <$SelectLabel
              role="button"
              onClick={() => {
                setShow(!show)
              }}
            >
              Select Genre
            </$SelectLabel>

            {selectedGenres.length > 0 &&
              selectedGenres?.map((genre, i) => (
                <GenreDisplay
                  key={genre.id}
                  genreName={genre.name}
                  genreType={genreType}
                  onError={err => setGenreError(err.message)}
                  onSuccess={() => {
                    selectedGenres.splice(i, 1)
                    onChange([...selectedGenres])
                    // setSelectedGenres([...selectedGenres])
                    setHeight(0)
                    adjustHeight()
                  }}
                >
                  <Button
                    type="button"
                    style={{
                      marginRight:
                        i !== selectedGenres.length - 1 ? '10px' : '0',
                    }}
                    onClick={() => {
                      selectedGenres.splice(i, 1)
                      // setSelectedGenres([...selectedGenres])
                      onChange([...selectedGenres])
                      setGenres([...genres, genre])
                      adjustHeight()
                    }}
                  >
                    {genre.name}
                  </Button>
                </GenreDisplay>
              ))}
          </$SelectedContainer>
        )}
      </$FirstContainer>
      <$SecondContainer
        ref={containerRef}
        hide={show}
        style={{height: `${height}px`}}
      >
        <CSSTransition
          in={show}
          timeout={500}
          onEntering={adjustHeight}
          onExit={() => setHeight(0)}
          unmountOnExit
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <$ChoiceContainer ref={secondRef}>
              {status === 'pending' ? (
                <span>loading</span>
              ) : (
                genres?.map((genre, i) => (
                  <GenreDisplay
                    key={genre.id}
                    genreName={genre.name}
                    genreType={genreType}
                    onError={err => setGenreError(err.message)}
                    onSuccess={() => {
                      genres.splice(i, 1)
                      setGenres([...genres])
                    }}
                  >
                    <Button
                      type="button"
                      style={{
                        marginRight: i !== genres.length - 1 ? '10px' : '0',
                      }}
                      onClick={() => {
                        genres.splice(i, 1)
                        setGenres([...genres])
                        // setSelectedGenres([...selectedGenres, genre])
                        onChange([...selectedGenres, genre])
                        adjustHeight()
                      }}
                    >
                      {genre.name}
                    </Button>
                  </GenreDisplay>
                ))
              )}
            </$ChoiceContainer>
            <$AddGenre ref={thirdRef}>
              <$Field style={{marginTop: '0.2em'}}>
                <input
                  type="text"
                  name="genre"
                  id="genre"
                  value={newGenre}
                  minLength={3}
                  onChange={e => {
                    setGenreError('')
                    const {value, validity} = e.target
                    setNewGenre(value)
                    setNewGenreValidation(validity)
                  }}
                  onKeyDown={e => {
                    if (e.code === 'Enter') {
                      e.preventDefault()
                      if (newGenreValidation) {
                        handleSubmit()
                      }
                    }
                  }}
                  placeholder="add new genre"
                />
                <label htmlFor="genre">Add Genre</label>
              </$Field>
              <Button
                style={{
                  background: newGenreValidation?.valid
                    ? 'var(--green)'
                    : 'var(--red)',
                  color: 'var(--lightGray)',
                }}
                variant="contained"
                type="button"
                onClick={handleSubmit}
                disabled={!newGenreValidation?.valid || isPending}
              >
                Add
              </Button>
            </$AddGenre>
            {genreError && (
              <$Warning marginBottom="10px" ref={fourthRef}>
                {genreError}
              </$Warning>
            )}
          </div>
        </CSSTransition>
      </$SecondContainer>
    </$Container>
  )
}

export default Genre
