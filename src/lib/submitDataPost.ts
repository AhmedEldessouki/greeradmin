/* eslint-disable camelcase */
/* eslint-disable prefer-promise-reject-errors */

import type {MyResponseType, MyResponseTypeWithData} from '../../types/api'
import type {
  ImageResponseType,
  ImagesResponseType,
  ImportedImages,
} from './apiTypes'
import {postOneLevelDeep, postThreeLevelDeep, postTwoLevelDeep} from './post'
import {notify} from './notify'
import {getOneLevelDeep, getThreeLevelDeep, getTwoLevelDeep} from './get'

const uploadImage = async (
  file: File,
  {
    present,
    folderName,
    fileName,
    context,
    onProg,
  }: {
    present: string
    folderName: string
    fileName: string
    context: {alt: string; caption: string}
    onProg: (arg: number) => void
  },
) => {
  const response: MyResponseTypeWithData<ImageResponseType> = {
    data: undefined,
    isSuccessful: false,
    error: undefined,
  }
  await new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`
    const xhr = new XMLHttpRequest()
    const fd = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener('progress', e => {
      onProg(Math.round((e.loaded * 100.0) / e.total))
      console.log(Math.round((e.loaded * 100.0) / e.total))
    })

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText)
        const data: Partial<ImageResponseType> = {
          thumbnail: undefined,
          image: undefined,
          original: undefined,
          context: undefined,
        }

        console.log('[Cloudinary Response]', response)
        // If the folder already exist there will be no eager or
        // context in the response and the new image replace the old one
        const {width, height, secure_url, context: resContext} = res
        const contextArray = resContext?.custom?.alt
          .replace('❘caption=', '__')
          .split('__') ?? [undefined, undefined]
        data.context = {alt: contextArray[0], description: contextArray[1]}
        data.original = {width, height, url: secure_url}
        res?.eager?.forEach(
          (item: {width: number; height: number; secure_url: string}) => {
            if (item.width === 180) {
              return (data.thumbnail = {
                width: item.width,
                height: item.height,
                url: item.secure_url,
              })
            }
            return (data.image = {
              width: item.width,
              height: item.height,
              url: item.secure_url,
            })
          },
        )
        onProg(0)
        resolve(data)
      } else if (xhr.status >= 400) {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        })
      }
    }
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      })
    }
    fd.append('folder', present)
    fd.append('public_id', `${folderName}/${fileName}`)
    fd.append('upload_preset', present)
    fd.append('tags', `${folderName},${fileName}`)
    fd.append('file', file)
    fd.append('context', `alt=${context.alt}❘caption=${context.caption}`)
    // I have no idea what this "❘" is but its the key!!!

    xhr.send(fd)
  })
    .then(
      res => {
        response.data = res as ImageResponseType
      },
      err => {
        response.error = err
      },
    )
    .catch(err => {
      response.error = err
    })
  return response
}

const gradualUpload = async (
  imagesArray: Array<{preview: string; file: File}>,
  {
    present,
    folderName,
    context: {alt = 'This Is an Alt', caption = 'This is an description'},
    onProg,
  }: {
    present: string
    folderName: string
    context: {alt: string; caption: string}
    onProg: (arg: number) => void
  },
): Promise<MyResponseTypeWithData<ImagesResponseType>> => {
  const response: MyResponseTypeWithData<ImagesResponseType> = {
    data: [],
    isSuccessful: false,
    error: undefined,
  }

  if (imagesArray.length > 0) {
    await Promise.all(
      imagesArray.map(async ({file}, i) => {
        return uploadImage(file, {
          present,
          folderName,
          fileName: `${folderName}${i}`,
          context: {
            alt,
            caption,
          },
          onProg,
        })
      }),
    )
      .then(
        res => {
          notify('🖼', `Pictures Uploaded!`, {
            color: 'var(--green)',
          })
          const resData = res.map(({data}) => data)
          response.isSuccessful = true
          response.data = resData as ImagesResponseType
        },
        err => {
          notify('🖼', `Pictures Failed!`, {
            color: 'var(--red)',
          })
          return (response.error = err)
        },
      )
      .catch(err => {
        notify('🖼', `Pictures Failed!`, {
          color: 'var(--red)',
        })
        return (response.error = err)
      })
  }

  return response
}

const handleImageCalls = async ({
  category,
  acceptedImagesST,
  titleCamelCase,
  context = {alt: 'This Is an Alt', caption: 'This is an description'},
  onProg,
}: {
  category: string
  acceptedImagesST: ImportedImages
  titleCamelCase: string
  context: {
    alt: string
    caption: string
  }
  onProg: (n: number) => void
}) => {
  let response: MyResponseTypeWithData<ImagesResponseType> = {
    isSuccessful: undefined,
    error: undefined,
    data: [],
  }

  switch (category) {
    // case 'reels': {
    //   const res = await gradualUpload(acceptedImagesST, {
    //     present: 'audioBooks',
    //     onProg,
    //     folderName: titleCamelCase,
    //    context: {
    //   alt = 'This Is an Alt',
    //   caption = 'This is an description',
    // },
    //   })
    //   response = {...res}
    //   break
    // }
    case 'live-events': {
      const res = await gradualUpload(acceptedImagesST, {
        present: 'liveEvents',
        onProg,
        folderName: titleCamelCase,
        context,
      })
      response = {...res}
      break
    }
    case 'voice-over': {
      const res = await gradualUpload(acceptedImagesST, {
        present: 'voiceOver',
        onProg,
        folderName: titleCamelCase,
        context,
      })
      response = {...res}
      break
    }
    case 'audio-books': {
      const res = await gradualUpload(acceptedImagesST, {
        present: 'audioBooks',
        onProg,
        folderName: titleCamelCase,
        context,
      })
      response = {...res}
      break
    }
    case 'films': {
      const res = await gradualUpload(acceptedImagesST, {
        present: 'actorFilms',
        onProg,
        folderName: titleCamelCase,
        context,
      })
      response = {...res}
      break
    }
    case 'television': {
      const res = await gradualUpload(acceptedImagesST, {
        present: 'actorTv',
        onProg,
        folderName: titleCamelCase,
        context,
      })
      response = {...res}
      break
    }
    case 'print': {
      const res = await gradualUpload(acceptedImagesST, {
        present: 'mediaPrint',
        onProg,
        folderName: titleCamelCase,
        context,
      })
      response = {...res}
      break
    }
    case 'web': {
      const res = await gradualUpload(acceptedImagesST, {
        present: 'mediaWeb',
        onProg,
        folderName: titleCamelCase,
        context,
      })
      response = {...res}
      break
    }
    case 'commercials': {
      const res = await gradualUpload(acceptedImagesST, {
        present: 'commercials',
        onProg,
        folderName: titleCamelCase,
        context,
      })
      response = {...res}
      break
    }

    default:
      console.warn(`No Such ${category} is not being handled`)
      break
  }

  return response
}
async function handleDBCall({
  category,
  data,
  titleDashed,
}: {
  category: string
  data: unknown
  titleDashed: string
}) {
  let response: MyResponseType = {isSuccessful: undefined, error: undefined}
  console.log(titleDashed, data)
  switch (category) {
    case 'reels': {
      response = await postOneLevelDeep({
        collection: 'reels',
        doc: titleDashed,
        data,
      })
      console.log(response)

      break
    }
    case 'live-events': {
      response = await postTwoLevelDeep({
        collection: 'works',
        doc: 'producer',
        subCollection: 'liveEvents',
        subDoc: titleDashed,
        data,
      })
      break
    }
    case 'voice-over': {
      response = await postTwoLevelDeep({
        collection: 'works',
        doc: 'narration',
        subCollection: 'voiceOver',
        subDoc: titleDashed,
        data,
      })
      break
    }
    case 'audio-books': {
      response = await postTwoLevelDeep({
        collection: 'works',
        doc: 'narration',
        subCollection: 'audioBooks',
        subDoc: titleDashed,
        data,
      })
      break
    }
    case 'films': {
      response = await postTwoLevelDeep({
        collection: 'works',
        doc: 'actor',
        subCollection: 'films',
        subDoc: titleDashed,
        data,
      })
      break
    }
    case 'television': {
      response = await postTwoLevelDeep({
        collection: 'works',
        doc: 'actor',
        subCollection: 'television',
        subDoc: titleDashed,
        data,
      })
      break
    }
    case 'print': {
      response = await postThreeLevelDeep({
        collection: 'works',
        doc: 'actor',
        subCollection: 'media',
        subDoc: 'media',
        subSubCollection: 'print',
        subSubDoc: titleDashed,
        data,
      })
      break
    }
    case 'web': {
      response = await postThreeLevelDeep({
        collection: 'works',
        doc: 'actor',
        subCollection: 'media',
        subDoc: 'media',
        subSubCollection: 'web',
        subSubDoc: titleDashed,
        data,
      })
      break
    }
    case 'commercials': {
      response = await postThreeLevelDeep({
        collection: 'works',
        doc: 'actor',
        subCollection: 'media',
        subDoc: 'media',
        subSubCollection: 'commercials',
        subSubDoc: titleDashed,
        data,
      })
      break
    }

    default:
      console.warn(`No Such ${category} is not being handled`)
      break
  }
  if (response.isSuccessful) {
    notify('⚡', `Post Succeeded!`, {
      color: 'var(--green)',
    })
  } else if (response.error) {
    notify('⚡', `Post Failed!`, {
      color: 'var(--red)',
    })
  }

  return response
}
async function handleDBFetch<T>(category: string) {
  let response: MyResponseTypeWithData<T[]> = {
    isSuccessful: undefined,
    error: undefined,
    data: [],
  }

  switch (category) {
    case 'reels': {
      response = await getOneLevelDeep<T>({
        collection: 'reels',
      })
      break
    }
    case 'live-events': {
      response = await getTwoLevelDeep<T>({
        collection: 'works',
        doc: 'producer',
        subCollection: 'liveEvents',
      })
      break
    }
    case 'voice-over': {
      response = await getTwoLevelDeep<T>({
        collection: 'works',
        doc: 'narration',
        subCollection: 'voiceOver',
      })
      break
    }
    case 'audio-books': {
      response = await getTwoLevelDeep<T>({
        collection: 'works',
        doc: 'narration',
        subCollection: 'audioBooks',
      })
      break
    }
    case 'films': {
      response = await getTwoLevelDeep<T>({
        collection: 'works',
        doc: 'actor',
        subCollection: 'films',
      })
      break
    }
    case 'television': {
      response = await getTwoLevelDeep<T>({
        collection: 'works',
        doc: 'actor',
        subCollection: 'television',
      })
      break
    }
    case 'print': {
      response = await getThreeLevelDeep<T>({
        collection: 'works',
        doc: 'actor',
        subCollection: 'media',
        subDoc: 'media',
        subSubCollection: 'print',
      })
      break
    }
    case 'web': {
      response = await getThreeLevelDeep<T>({
        collection: 'works',
        doc: 'actor',
        subCollection: 'media',
        subDoc: 'media',
        subSubCollection: 'web',
      })
      break
    }
    case 'commercials': {
      response = await getThreeLevelDeep<T>({
        collection: 'works',
        doc: 'actor',
        subCollection: 'media',
        subDoc: 'media',
        subSubCollection: 'commercials',
      })
      break
    }

    default:
      console.warn(`No Such ${category} is not being handled`)
      break
  }

  return response
}

export {handleDBCall, handleDBFetch, handleImageCalls}
