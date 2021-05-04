import React, {useEffect, useRef, useState} from 'react'

import styled from '@emotion/styled'
import ReCAPTCHA from 'react-google-recaptcha'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useAuth} from '../../context/auth'
import {$Warning, mqMax} from '../../shared/utils'
import {$Field} from './sharedCss/field'
import ForgetPassword from './forgetPassword'

const $Form = styled.form`
  width: 300px;
  ${mqMax.xs} {
    width: 250px;
  }
`

const SignInForm = ({
  showDialog,
  setShowDialog,
}: {
  showDialog: boolean
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const {signIn, setUser} = useAuth()
  const [forgetPassword, setForgetPassword] = useState(false)
  const [signInFailed, setSignInFailed] = useState('')
  const [isPending, setPending] = useState(false)
  const [isLoad, setLoad] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  const closeDialog = () => setShowDialog(false)

  useEffect(() => {
    setLoad(true)
    // eslint-disable-next-line consistent-return
    return () => {
      setLoad(false)
    }
  }, [])

  async function handleSignInForm(e: React.SyntheticEvent) {
    e.preventDefault()

    setPending(!isPending)

    const token = await recaptchaRef.current?.executeAsync()

    if (signInFailed) {
      setSignInFailed('')
    }

    const {signInEmail, signInPassword} = e.target as typeof e.target & {
      signInEmail: {value: string}
      signInPassword: {value: string}
    }
    const credentials = {
      email: signInEmail.value,
      password: signInPassword.value,
    }

    recaptchaRef.current?.reset()

    if (typeof token !== 'string') {
      setSignInFailed('Something went wrong, Please refresh the page.')
      setPending(false)
      return
    }

    const {user, error} = await signIn(credentials)
    if (error) {
      setSignInFailed(error)
    }
    setUser(user?.user)
    setPending(false)
  }

  return (
    <Dialog
      open={showDialog}
      onClose={closeDialog}
      aria-labelledby="sign-in-dialog"
    >
      {forgetPassword ? (
        <ForgetPassword onCancel={() => setForgetPassword(!forgetPassword)} />
      ) : (
        <div>
          <DialogTitle style={{paddingBottom: '0'}} id="sign-in-dialog">
            Sign In
          </DialogTitle>
          <$Form onSubmit={handleSignInForm}>
            <DialogContent style={{paddingTop: '0'}}>
              <$Field>
                <input
                  name="signInEmail"
                  id="signInEmail"
                  placeholder="Enter email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <label htmlFor="signInEmail">Email</label>
              </$Field>
              <$Field>
                <input
                  name="signInPassword"
                  id="signInPassword"
                  type="password"
                  minLength={6}
                  required
                  placeholder="Enter password"
                />
                <label htmlFor="signInPassword">Password</label>
              </$Field>
            </DialogContent>
            <Button
              onClick={() => setForgetPassword(!forgetPassword)}
              variant="outlined"
              style={{marginLeft: '15px'}}
            >
              Forget Password
            </Button>
            {signInFailed && <$Warning role="alert">{signInFailed}</$Warning>}
            {isLoad && (
              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                theme="dark"
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY ?? ''}
              />
            )}
            <DialogActions
              style={{
                justifyContent: 'space-evenly',
                paddingBottom: '25px',
                minWidth: '50%',
              }}
            >
              <Button
                type="submit"
                variant="contained"
                style={{
                  background: !isPending ? 'var(--green)' : 'var(--red)',
                  color: 'var(--lightGray)',
                }}
                disabled={isPending}
              >
                Submit
              </Button>
              <Button type="button" variant="contained" onClick={closeDialog}>
                Close
              </Button>
            </DialogActions>
          </$Form>
        </div>
      )}
    </Dialog>
  )
}

const SignIn = () => {
  const [showDialog, setShowDialog] = useState(false)

  const openDialog = () => setShowDialog(true)

  return (
    <>
      <Button onClick={openDialog} variant="contained" color="primary">
        Sign In
      </Button>
      {showDialog && (
        <SignInForm showDialog={showDialog} setShowDialog={setShowDialog} />
      )}
    </>
  )
}

export default SignIn
