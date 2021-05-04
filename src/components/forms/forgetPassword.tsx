import React, {useRef, useState} from 'react'

import styled from '@emotion/styled'
import ReCAPTCHA from 'react-google-recaptcha'
import {Button as ButtonUI} from '@material-ui/core'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {$Warning, $Success, mqMax} from '../../shared/utils'
import {auth} from '../../lib/firebase'
import {$Field} from './sharedCss/field'

const $TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  span {
    margin-bottom: 10px !important;
  }
`
const $Form = styled.form`
  width: 300px;
  ${mqMax.xs} {
    width: 250px;
  }
`

function ForgetPassword({onCancel}: {onCancel: () => void}) {
  const [passwordRecoveryFailed, setPasswordRecoveryFailed] = useState<string>()
  const [
    passwordRecoverySuccessful,
    setPasswordRecoverySuccessful,
  ] = useState<string>()
  const [isPending, setPending] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  async function handleForgetPassword(e: React.SyntheticEvent) {
    e.preventDefault()

    setPending(!isPending)
    const token = await recaptchaRef.current?.executeAsync()

    const {signInEmail} = e.target as typeof e.target & {
      signInEmail: {value: string}
    }

    recaptchaRef.current?.reset()

    if (typeof token !== 'string') {
      setPasswordRecoveryFailed(
        'Something went wrong, Please refresh the page.',
      )
      setPending(false)
      return
    }

    await auth
      .sendPasswordResetEmail(signInEmail.value)
      .then(
        () => {
          setPasswordRecoveryFailed(undefined)
          setPasswordRecoverySuccessful(
            'Please check your email. You may find it in junk.',
          )
        },
        err => {
          setPasswordRecoverySuccessful(undefined)
          setPasswordRecoveryFailed(err.message as string)
        },
      )
      .catch(err => {
        setPasswordRecoverySuccessful(undefined)
        setPasswordRecoveryFailed(err.message as string)
      })
    setPending(false)
  }
  return (
    <div>
      <DialogTitle style={{paddingBottom: '0'}} id="sign-in-dialog">
        Forget Password
      </DialogTitle>
      <$Form onSubmit={handleForgetPassword} style={{overflow: 'hidden'}}>
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.REACT_APP_RECAPTCHA_KEY ?? ''}
        />
        <DialogContent style={{paddingTop: '0'}}>
          <$Field>
            <input
              name="signInEmail"
              id="signInEmail"
              placeholder="Enter email"
              type="email"
              required
            />
            <label htmlFor="signInEmail">Email</label>
          </$Field>
        </DialogContent>
        <$TextWrapper>
          {passwordRecoveryFailed && (
            <$Warning role="alert"> {passwordRecoveryFailed} </$Warning>
          )}
          {passwordRecoverySuccessful && (
            <$Success role="alert"> {passwordRecoverySuccessful} </$Success>
          )}
        </$TextWrapper>
        <DialogActions
          style={{
            justifyContent: 'space-evenly',
            paddingBottom: '25px',
            minWidth: '50%',
          }}
        >
          <ButtonUI
            type="submit"
            variant="contained"
            style={{
              background: !isPending ? 'var(--green)' : 'var(--red)',
              color: 'var(--lightGray)',
            }}
            disabled={isPending}
          >
            Submit
          </ButtonUI>
          <ButtonUI type="button" variant="contained" onClick={onCancel}>
            Close
          </ButtonUI>
        </DialogActions>
      </$Form>
    </div>
  )
}

export default ForgetPassword
