import * as React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import ControlUnit from './routes/control-unit'
import Dashboard from './routes/dashboard'
import Validation from './routes/validation'
import {globalStyles} from './shared/styles'
import 'react-toastify/dist/ReactToastify.css'
import {useAuth} from './context/auth'
import SignIn from './components/forms/signIn'

function App() {
  const {user} = useAuth()
  return (
    <div className="App">
      {globalStyles}

      <Router>
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/control-unit" component={ControlUnit} />
          <Route path="/signup/:id" component={Validation} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
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
