import type {MyResponseType} from '../../types/api'
import type {OneLevelDeep, ThreeLevelDeep, TwoLevelDeep} from './dbTypes'
import {db} from './firebase'

async function deleteOneLevelDeep({collection, doc}: OneLevelDeep) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  await db
    .collection(collection)
    .doc(doc)
    .delete()
    .then(
      () => {
        response.isSuccessful = true
      },
      err => (response.error = err),
    )
    .catch(error => {
      response.error = error
    })
  return response
}

async function deleteTwoLevelDeep({
  collection,
  doc,
  subCollection,
  subDoc,
}: TwoLevelDeep) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .delete()
    .then(
      () => {
        response.isSuccessful = true
      },
      err => (response.error = err),
    )
    .catch(error => {
      response.error = error
    })
  return response
}

async function deleteThreeLevelDeep({
  collection,
  doc,
  subCollection,
  subDoc,
  subSubCollection,
  subSubDoc,
}: ThreeLevelDeep) {
  const response: MyResponseType = {isSuccessful: undefined, error: undefined}
  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .collection(subSubCollection)
    .doc(subSubDoc)
    .delete()
    .then(
      () => {
        response.isSuccessful = true
      },
      err => (response.error = err),
    )
    .catch(error => {
      response.error = error
    })
  return response
}

export {deleteOneLevelDeep, deleteTwoLevelDeep, deleteThreeLevelDeep}
