/* eslint-disable prefer-promise-reject-errors */
import React, {useState} from 'react'
import {css} from '@emotion/react'
import styled from '@emotion/styled'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import RemoveIcon from '@material-ui/icons/Remove'
import {nanoid} from 'nanoid'
import {$Warning, mqMax} from '../../shared/utils'
import {dashify} from '../../lib/dashify'
import {spacefy} from '../../lib/spacefy'
import {
  handleDBCall,
  handleDBFetch,
  handleImageCalls,
} from '../../lib/submitDataPost'
import Dropzone from '../dropzone'
import Progress from '../progress'
import MultipleImageDialog from '../imageInForm'
import type {ImportedImages} from '../../lib/apiTypes'
import type {MyResponseType} from '../../../types/api'
import {$Field} from './sharedCss/field'

// We Need this work around to avoid reTyping... {Important}!!
type CleaningType = {
  [key: string]: string | undefined | {[key: string]: string}
}

function clean(
  someData: CleaningType,
): {[key: string]: string | {[key: string]: string}} {
  for (const key in someData) {
    if (Object.prototype.hasOwnProperty.call(someData, key)) {
      const element: string | undefined | {[key: string]: string} =
        someData[key]
      if (typeof element === 'object') {
        clean(element)
      } else if (typeof element === 'undefined' || element.length < 1) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete someData[key]
      }
    }
  }

  return someData as {[key: string]: string | {[key: string]: string}}
}

const flexCol = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const $SubmitDataContainer = styled.div`
  min-height: 95vh;
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  ${mqMax.s} {
    flex-wrap: wrap;
  }
`

const $CollectDataForm = styled.form`
  width: 300px;
  ${flexCol}
  label {
    ${flexCol}
  }
  select {
    display: block;
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 700;
    color: var(--black);
    line-height: 1.3;
    padding: 0.6em 1.4em 0.5em 0.8em;
    width: 100%;
    max-width: 100%; /* useful when width is set to anything other than 100% */
    box-sizing: border-box;
    margin: 0;
    border: 1px solid var(--blackShade);
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
    border-radius: var(--roundness);
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: var(--lightGray);
    :not([id='genre']) {
      background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
        linear-gradient(
          to bottom,
          var(--lightGray) 0%,
          var(--lightGrayShade) 100%
        );
      background-repeat: no-repeat, repeat;
      /* arrow icon position (1em from the right, 50% vertical) , then gradient position*/
      background-position: right 0.7em top 50%, 0 0;
      /* icon size, then gradient */
      background-size: 0.65em auto, 100%;
    }
    :hover {
      border-color: #888;
    }
    :focus {
      border-color: #aaa;
      /* It'd be nice to use -webkit-focus-ring-color here but it doesn't work on box-shadow */
      box-shadow: 0 0 1px 3px var(--blue);
      //   box-shadow: 0 0 0 3px -moz-mac-focusring;
      color: #222;
      outline: none;
    }
    option {
      :hover {
        background-color: var(--blue);
      }
      :focus {
        box-shadow: 0 0 1px 3px var(--blue);
        color: #222;
        outline: none;
      }
      font-weight: normal;
    }
    option:disabled {
      font-size: 1.2rem;
      font-style: italic;
      color: var(--black);
      background: var(--blackShade);
    }
  }
  textarea {
    background: transparent;
    border: none;
    border-bottom: 2px solid var(--black);
    :focus-within,
    :focus {
      outline: none;
      border-bottom-width: 3px;
      border-color: var(--blackShade);
    }
    :valid {
      color: var(--green);
    }
    :invalid {
      color: var(--red);
    }
  }
`
const $BtnGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
`

function UrlInput({
  urlName,
  handleBlur,
}: {
  urlName: string
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}) {
  const [state, setState] = useState('')

  return (
    <$Field>
      <input
        placeholder="this is to help control label"
        type="url"
        name="url"
        value={state}
        onChange={e => setState(e.target.value)}
        onBlur={handleBlur}
        id="url"
      />
      <label htmlFor="url">{urlName} Url</label>
    </$Field>
  )
}

function NewUrl({
  urlName,
  urlArray,
  setArrayChange,
}: {
  urlName: string
  urlArray: string[]
  setArrayChange: React.Dispatch<React.SetStateAction<Array<string>>>
}) {
  return (
    <>
      <div style={{margin: '5px auto'}}>
        <ButtonGroup variant="contained" color="primary">
          <Button
            aria-label="remove last image url"
            onClick={() => {
              urlArray.pop()
              setArrayChange([...urlArray])
            }}
          >
            <RemoveIcon />
          </Button>
          <Button
            variant="outlined"
            style={{background: 'transparent', color: 'var(--black)'}}
          >
            Add {urlName} Url
          </Button>
          <Button
            aria-label={`add a new ${urlName} url`}
            onClick={() => setArrayChange([...urlArray.concat('')])}
          >
            <AddIcon />
          </Button>
        </ButtonGroup>
      </div>
      {urlArray.length > 0 &&
        urlArray.map((item, i) => {
          return (
            <UrlInput
              key={nanoid()}
              handleBlur={e => {
                urlArray[i] = e.target.value
                setArrayChange([...urlArray])
              }}
              urlName={urlName}
            />
          )
        })}
    </>
  )
}

// TODO: We Need to Stop the Submitting if the doc already exist. So IMPORTANT
export default function SubmitData() {
  const [categoryST, setCategory] = useState('Choose Category')
  const [acceptedImagesST, setAcceptedImages] = useState<ImportedImages>([])
  const [rejectedImagesST, setRejectedImages] = useState<ImportedImages>([])
  const [titlesCollectionST, setTitlesCollection] = useState<Array<string>>([])

  const [titleST, setTitle] = useState('')
  const [imageUrlsST, setImageUrls] = useState<Array<string>>([])
  const [videoUrlsST, setVideoUrls] = useState<Array<string>>([])
  const [descriptionST, setDescription] = useState('')
  const [progressST, setProgress] = useState(0)
  const [responseST, setResponse] = useState<MyResponseType>({
    isSuccessful: false,
    error: undefined,
  })
  const [isPending, setPending] = useState(false)

  const fetchAllTitles = async (category: string) => {
    setResponse({})
    // we don't need to know the other types. Just the title fot checkUp
    const {data, error} = await handleDBFetch<{
      title: string
      [key: string]: string | object
    }>(category)
    if (error) {
      return setResponse({
        error: {
          message:
            "Warning!! Something went wrong, reSelect category. so you wouldn't accidentally override other data.",
        } as Error,
      })
    }
    if (data) {
      setTitlesCollection(data.map(obj => obj.title))
    }
    return void 0
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    if (responseST.error) {
      setResponse({error: undefined})
    }
    if (!!titlesCollectionST.find(item => item === titleST)) {
      return setResponse({
        error: {message: 'Title Already Exists.'} as Error,
      })
    }
    if (acceptedImagesST.length === 0 && categoryST !== 'reels') {
      return setResponse({
        error: {message: `Please, select an image!`} as Error,
      })
    }

    setPending(true)
    const {
      title,
      category,
      url,
      description,
    } = e.currentTarget as typeof e.currentTarget & {
      title: HTMLInputElement
      category: HTMLInputElement
      url: HTMLInputElement
      description: HTMLInputElement
    }

    const formData: {[key: string]: string} = {
      title: title.value,
      url: url.value,
      description: description.value,
    }

    // Creating docID
    const titleDashed = dashify(title.value)
    // Creating folderName
    const titleCamelCase = spacefy(title.value, {reverse: true})

    const formDataCleaned = clean(formData)

    const cloudinaryRes = await handleImageCalls({
      acceptedImagesST,
      category: category.value,
      titleCamelCase,
      context: {
        alt: `greer morrison in ${title.value}.`,
        caption: `${spacefy(category.value)}-${title.value}`,
      },
      onProg: arg => setProgress(arg),
    })

    if (cloudinaryRes.error) {
      setPending(false)
      return setResponse({error: cloudinaryRes.error})
    }
    setAcceptedImages([])
    setProgress(0)
    // Will Never Come True
    if (!cloudinaryRes.data && category.value !== 'reels') return void 0
    const cloudinaryDataCleaned = clean(
      (cloudinaryRes.data as unknown) as CleaningType,
    )
    const dataWithPictures: {
      [key: string]: string | CleaningType | string[]
    } = {
      ...formDataCleaned,
      pictures: cloudinaryDataCleaned,
    }
    const data: {
      [key: string]: string | CleaningType | string[]
    } = {
      ...formDataCleaned,
    }

    const firestoreResponse = await handleDBCall({
      category: category.value,
      data: {
        ...(category.value !== 'reels' ? dataWithPictures : data),
        imgUrls: imageUrlsST.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index && item !== ''
        }),
        videoUrls: videoUrlsST.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index
        }),
      },
      titleDashed,
    })

    setResponse({...firestoreResponse})

    if (firestoreResponse.isSuccessful) {
      // RESET Incase Event Reset didn't work
      setTitle('')
      setVideoUrls([])
      setImageUrls([])
      setDescription('')
    }
    setPending(false)
    return void 0
  }

  return (
    <>
      <header>
        <title>Submit Data</title>
      </header>
      <$SubmitDataContainer>
        {categoryST !== 'reels' && (
          <MultipleImageDialog
            onDelDialogOne={i => {
              acceptedImagesST.splice(i, 1)
              setAcceptedImages([...acceptedImagesST])
            }}
            onCleanDialogTwo={() => setRejectedImages([])}
            titleOne="Accepted images"
            dialogOneArr={acceptedImagesST}
            titleTwo="Rejected images"
            dialogTwoArr={rejectedImagesST}
          />
        )}
        <$CollectDataForm onSubmit={handleSubmit}>
          <label htmlFor="category">
            Category
            <select
              name="category"
              defaultValue={categoryST}
              onBlur={async e => {
                setCategory(e.currentTarget.value)
                if (e.currentTarget.value !== 'choose') {
                  await fetchAllTitles(e.currentTarget.value)
                }
              }}
              onChange={e => setCategory(e.currentTarget.value)}
              id="category"
              required
            >
              <option hidden defaultValue="choose">
                Choose Category
              </option>
              <option value="reels">Reels</option>
              <optgroup label="works">
                <option value="producer" disabled>
                  Producer
                </option>
                <option value="live-events">Live Events</option>
                <option value="narration" disabled>
                  Narration
                </option>
                <option value="voice-over">Voice Over</option>
                <option value="audio-books">Audio Books</option>
                <option value="actor" disabled>
                  Actor
                </option>
                <option value="films">Films</option>
                <option value="television">Television</option>
                <option value="media" disabled>
                  Media
                </option>
                <option value="print">Print</option>
                <option value="web">Web</option>
                <option value="commercials">Commercials</option>
              </optgroup>
            </select>
          </label>
          <$Field>
            <input
              placeholder="this is to help control label"
              type="text"
              name="title"
              value={titleST}
              onChange={e => setTitle(e.target.value)}
              id="title"
              required
            />
            <label htmlFor="title">Title</label>
          </$Field>
          {categoryST !== 'reels' && (
            <Dropzone
              onAcceptedImages={newImages =>
                setAcceptedImages([...acceptedImagesST, ...newImages])
              }
              onRejectedImages={newImages => setRejectedImages([...newImages])}
            />
          )}
          <NewUrl
            urlName="Video"
            urlArray={videoUrlsST}
            setArrayChange={setVideoUrls}
          />
          <NewUrl
            urlName="Image"
            urlArray={imageUrlsST}
            setArrayChange={setImageUrls}
          />

          <label style={{marginTop: '1.2rem '}} htmlFor="description">
            Description
          </label>
          <TextareaAutosize
            name="description"
            value={descriptionST}
            onChange={e => setDescription(e.target.value)}
            id="description"
          />
          {responseST.error && (
            <$Warning marginBottom="10" role="alert">
              {responseST.error.message}
            </$Warning>
          )}
          {progressST > 0 && <Progress progress={progressST} />}
          <$BtnGroup>
            <Button
              style={{
                background: !isPending ? 'var(--green)' : 'var(--red)',
                color: 'var(--lightGray)',
                margin: '1.2rem 0',
              }}
              type="submit"
              variant="contained"
              disabled={isPending}
            >
              Submit
            </Button>
          </$BtnGroup>
        </$CollectDataForm>
      </$SubmitDataContainer>
    </>
  )
}
