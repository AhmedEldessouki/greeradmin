// import {useEffect} from 'react'
import SubmitData from '../components/forms/submitData'
import Layout from '../components/layout'
// import {useAuth} from '../context/auth'

export default function ControlUnit() {
  // const {user} = useAuth()
  // useEffect(() => {
  //   if (!user) {
  //     return void 6
  //   }
  // }, [user])
  return (
    <Layout>
      <SubmitData />
    </Layout>
  )
}
