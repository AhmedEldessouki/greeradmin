import React from 'react'
import styled from '@emotion/styled'
import {Link} from 'react-router-dom'
import SignIn from '../components/forms/signIn'
import SignUp from '../components/forms/signUp'
import Layout from '../components/layout'
import {useAuth} from '../context/auth'
import User from '../components/user/user'
import {mqMax} from '../shared/utils'
import {auth} from '../lib/firebase'

const $Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  width: 100%;
  text-align: center;
  h2 {
    font-weight: 300;
  }
  a {
    ::before {
      background: var(--black);
    }
    color: var(--black);
  }
`
const $ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  min-width: 280px;
  ${mqMax.xs} {
    width: 100%;

    a {
      margin: 10px auto;
    }
  }
`
function Dashboard() {
  const {user, setUser} = useAuth()
  React.useEffect(() => {
    if (!auth.currentUser) return

    auth.onAuthStateChanged(currentUser => {
      console.log('checking', currentUser)
      if (currentUser) {
        console.log('passed', currentUser)
        return setUser(currentUser)
      }
      return setUser(null)
    })
    console.log(user)
  }, [setUser, user])

  return (
    <Layout>
      <$Container>
        <h2>Welcome To Greer C. Morrison Dashboard</h2>
        <$ButtonContainer>
          {user ? (
            <>
              <User />
              <Link to="/control-unit">Control Unit</Link>
            </>
          ) : (
            <>
              <SignIn />
              {/* <Link to="/verifySignUp">sign Up</Link> */}
              <SignUp />
            </>
          )}
        </$ButtonContainer>
      </$Container>
    </Layout>
  )
}

export default Dashboard
