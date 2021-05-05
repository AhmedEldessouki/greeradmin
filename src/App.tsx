import * as React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import styled from '@emotion/styled'
import ControlUnit from './routes/control-unit'
import Dashboard from './routes/dashboard'
import Validation from './routes/validation'
import {globalStyles} from './shared/styles'
import {useAuth} from './context/auth'
import SignIn from './components/forms/signIn'
import SignUp from './components/forms/signUp'
import {auth} from './lib/firebase'

import 'react-toastify/dist/ReactToastify.css'

const $AppContainer = styled.div`
  background: var(--lightGray);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  button {
    margin: 10px;
  }
`

function App() {
  const {user, setUser} = useAuth()

  React.useEffect(() => {
    auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        return setUser(currentUser)
      }
      return setUser(null)
    })
  }, [setUser])

  return (
    <div className="App">
      {globalStyles}
      {user ? (
        <Router>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/control-unit" component={ControlUnit} />
            <Route path="/signup" component={Validation} />
            <Route path="/signup/:id" component={Validation} />
            <Redirect from="*" to="/" />
          </Switch>
        </Router>
      ) : (
        <$AppContainer>
          <SignIn />
          <SignUp />
        </$AppContainer>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App
