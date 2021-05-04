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

type GenreType = {name: string; id: string}
type GenreTypeGroup = Array<GenreType>

export {
  ImageResponseObjectType,
  ImageResponseType,
  ImagesResponseType,
  ImportedImages,
  GenreType,
  GenreTypeGroup,
}
