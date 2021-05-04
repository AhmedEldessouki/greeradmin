// -----------------------
// ------ Firestore ------
// -----------------------

// ------ Root ------
type Collection = 'reels' | 'works' | 'other' | 'users'

// ------ 1st Level ------
type OtherDoc = 'contactInfo' | 'genre' | 'important'
type WorksDoc = 'producer' | 'narration' | 'actor'

// ------ 2nd Level ------
type ProducerCollection = 'liveEvents'
type NarrationCollection = 'voiceOver' | 'audioBooks'
type ActorCollection = 'films' | 'television' | 'media'
type GenreCollection = 'movie' | 'music'
type ImportantCollection = 'code'

// ------ 3rd Level ------
type MediaDoc = 'media'

// ------ 4th Level ------
type MediaCollection = 'print' | 'web' | 'commercials'

// ------- Users Collection -------
type UsersCollection = {
  collection: 'users'
  doc?: string
}
// ------- Reels Collection -------
type ReelsCollection = {
  collection: 'reels'
  doc?: string
}

// ------- Other Collection -------
type OtherContactInfoCollection = {
  collection: 'other'
  doc?: 'contactInfo'
}
type OtherGenreCollection = {
  collection: 'other'
  doc: 'genre'
  subCollection: GenreCollection
  subDoc?: string
}
type OtherImportantCollection = {
  collection: 'other'
  doc: 'important'
  subCollection: ImportantCollection
  subDoc?: string
}
// ------- Works Collection -------
type WorksProducerCollection = {
  collection: 'works'
  doc: 'producer'
  subCollection: ProducerCollection
  subDoc?: string
}
type WorksNarrationCollection = {
  collection: 'works'
  doc: 'narration'
  subCollection: NarrationCollection
  subDoc?: string
}
type WorksActorCollection = {
  collection: 'works'
  doc: 'actor'
  subCollection: Exclude<ActorCollection, 'media'>
  subDoc?: string
}
type WorksActorMediaCollection = {
  collection: 'works'
  doc: 'actor'
  subCollection: ActorCollection
  subDoc: MediaDoc
  subSubCollection: MediaCollection
  subSubDoc?: string
}

export type OneLevelDeep =
  | ReelsCollection
  | OtherContactInfoCollection
  | UsersCollection
export type TwoLevelDeep =
  | WorksNarrationCollection
  | WorksProducerCollection
  | WorksActorCollection
  | OtherGenreCollection
  | OtherImportantCollection
export type ThreeLevelDeep = WorksActorMediaCollection

export type OneLevelDeepWithData<T> = OneLevelDeep & {data: T}
export type TwoLevelDeepWithData<T> = TwoLevelDeep & {data: T}
export type ThreeLevelDeepWithData<T> = ThreeLevelDeep & {data: T}
