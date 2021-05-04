import type {MyResponseType} from '../../types/api'
import type {
  OneLevelDeepWithData,
  ThreeLevelDeepWithData,
  TwoLevelDeepWithData,
} from './dbTypes'
import firebase, {db} from './firebase'

type SetOptionsForPost = {
  setOptions?: firebase.firestore.SetOptions
}

// If the document does not exist, it will be created.
export async function postOneLevelDeep<T>({
  collection,
  doc,
  data,
  ...setOptions
}: OneLevelDeepWithData<T> &
  SetOptionsForPost &
  firebase.firestore.SetOptions) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  // , timeStamp: firebase.firestore.Timestamp.now().toDate()
  await db
    .collection(collection)
    .doc(doc)
    .set({...data}, {...setOptions})
    .then(() => {
      response.isSuccessful = true
    })
    .catch(error => {
      response.error = error
    })
  return response
}

export async function postTwoLevelDeep<T>({
  collection,
  doc,
  subCollection,
  subDoc,
  data,
  ...setOptions
}: TwoLevelDeepWithData<T> &
  SetOptionsForPost &
  firebase.firestore.SetOptions) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .set(
      {...data, timeStamp: firebase.firestore.Timestamp.now().toDate()},
      {...setOptions},
    )
    .then(() => {
      response.isSuccessful = true
    })
    .catch(error => {
      response.error = error
    })
  return response
}

export async function postThreeLevelDeep<T>({
  collection,
  doc,
  subCollection,
  subDoc,
  subSubCollection,
  subSubDoc,
  data,
  ...setOptions
}: ThreeLevelDeepWithData<T> &
  SetOptionsForPost &
  firebase.firestore.SetOptions) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .collection(subSubCollection)
    .doc(subSubDoc)
    .set(
      {...data, timeStamp: firebase.firestore.Timestamp.now().toDate()},
      {...setOptions},
    )
    .then(() => {
      response.isSuccessful = true
    })
    .catch(error => {
      response.error = error
    })
  return response
}
