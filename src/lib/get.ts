import {MyResponseTypeWithData} from '../../types/api'
import {db} from './firebase'

import type {OneLevelDeep, ThreeLevelDeep, TwoLevelDeep} from './dbTypes'

async function getOneLevelDeep<T>({collection}: OneLevelDeep) {
  const response: MyResponseTypeWithData<Array<T>> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.docs.map(item => item.data() as T)
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

async function getOneLevelDeepDoc<T>({collection, doc}: OneLevelDeep) {
  const response: MyResponseTypeWithData<T> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .doc(doc)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.data() as T
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

async function getTwoLevelDeep<T>({
  collection,
  doc,
  subCollection,
}: TwoLevelDeep) {
  const response: MyResponseTypeWithData<Array<T>> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.docs.map(item => item.data() as T)
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

async function getTwoLevelDeepDoc<T>({
  collection,
  doc,
  subCollection,
  subDoc,
}: TwoLevelDeep) {
  const response: MyResponseTypeWithData<T> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.data() as T
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

async function getThreeLevelDeep<T>({
  collection,
  doc,
  subCollection,
  subDoc,
  subSubCollection,
}: ThreeLevelDeep) {
  const response: MyResponseTypeWithData<Array<T>> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .collection(subSubCollection)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.docs.map(item => item.data() as T)
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

async function getThreeLevelDeepDoc<T>({
  collection,
  doc,
  subCollection,
  subDoc,
  subSubCollection,
  subSubDoc,
}: ThreeLevelDeep) {
  const response: MyResponseTypeWithData<T> = {
    isSuccessful: undefined,
    error: undefined,
  }

  await db
    .collection(collection)
    .doc(doc)
    .collection(subCollection)
    .doc(subDoc)
    .collection(subSubCollection)
    .doc(subSubDoc)
    .get()
    .then(
      res => {
        response.isSuccessful = true
        response.data = res.data() as T
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

export {
  getOneLevelDeep,
  getOneLevelDeepDoc,
  getTwoLevelDeep,
  getTwoLevelDeepDoc,
  getThreeLevelDeep,
  getThreeLevelDeepDoc,
}
