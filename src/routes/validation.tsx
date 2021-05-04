import React, {useEffect, useRef, useState} from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import {Button} from '@material-ui/core'
import styled from '@emotion/styled'
import Layout from '../components/layout'
import {$Field} from '../components/forms/sharedCss/field'
import {$Warning, mqMax} from '../shared/utils'
import {getTwoLevelDeepDoc} from '../lib/get'
import SignUp from '../components/forms/signUp'

const $SignUpPageContainer = styled.div`
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
const $Form = styled.form`
  flex-direction: column;
  display: flex;
  align-items: center;
  width: 300px;
  button {
    margin: 10px auto;
  }
  ${mqMax.xs} {
    width: 250px;
  }
`

function Validation() {
  // will change to react-router
  // const {query} = useRouter()
  const [codeError, setCodeError] = useState('')
  const [codeST, setCode] = useState<string>('')
  const [isLoad, setLoad] = useState(false)
  const [isVerified, setVerified] = useState(false)
  const [status, setStatus] = useState<'pending' | 'ended' | 'idle'>('idle')
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  const oneTimeRef = useRef(false)

  const someFunction = async (retrievedCode: string) => {
    setStatus('pending')
    const {error, data} = await getTwoLevelDeepDoc<string>({
      collection: 'other',
      doc: 'important',
      subCollection: 'code',
      subDoc: retrievedCode,
    })
    if (!!data) {
      console.log(data)
      setVerified(true)
    } else if (error || !data) {
      setVerified(false)
      setCodeError(error?.message ?? 'Code is Invalid')
    }
    setStatus('ended')
  }

  useEffect(() => {
    if (oneTimeRef.current === true) return
    const code = 'adadadadadadad'
    if (typeof code !== 'string') return
    console.log(code)
    setCode(code)
    someFunction(code)
    oneTimeRef.current = true
    if (isVerified) return
    setLoad(true)
    // eslint-disable-next-line consistent-return
    return () => {
      setLoad(false)
    }
  }, [isVerified])

  async function submitCode(e: React.SyntheticEvent) {
    e.preventDefault()
    const {code} = e.currentTarget as typeof e.currentTarget & {
      code: HTMLInputElement
    }
    const retrievedCode = code.value
    someFunction(retrievedCode)
  }
  return (
    <Layout>
      <span>{codeST}</span>
      <$SignUpPageContainer>
        <$Form onSubmit={submitCode}>
          <$Field>
            <input
              name="code"
              id="code"
              placeholder="Enter code"
              type="text"
              value={codeST}
              onChange={e => setCode(e.target.value)}
              required
            />
            <label htmlFor="code">Code</label>
          </$Field>
          {codeError && <$Warning role="alert">{codeError}</$Warning>}
          {isLoad && (
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              theme="dark"
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY ?? ''}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            style={{
              background: status !== 'pending' ? 'var(--green)' : 'var(--red)',
              color: 'var(--lightGray)',
            }}
            disabled={status === 'pending'}
          >
            Submit
          </Button>
        </$Form>
        <SignUp isVerified={!isVerified} />
      </$SignUpPageContainer>
    </Layout>
  )
}

export default Validation
