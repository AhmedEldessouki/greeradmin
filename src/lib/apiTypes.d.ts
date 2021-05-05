type ImageResponseObjectType = {
  width: number
  height: number
  url: string
}
type ImageResponseType = {
  context: {
    alt: string
    description: string
  }
  original: ImageResponseObjectType
  thumbnail: ImageResponseObjectType
  image: ImageResponseObjectType
}
type ImagesResponseType = Array<ImageResponseType>
type ImportedImages = Array<{preview: string; file: File}>

export {
  ImageResponseObjectType,
  ImageResponseType,
  ImagesResponseType,
  ImportedImages,
}
