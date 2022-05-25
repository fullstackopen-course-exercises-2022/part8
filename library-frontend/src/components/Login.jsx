import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'

const Login = ({ show, setToken, setError }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [ login, result ] = useMutation(LOGIN, {
        onError: err => {
            setError(err.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if(result.data) {
            const jwt = result.data.login.value
            window.localStorage.setItem('jwt', JSON.stringify(jwt))
            setToken(jwt)
        }
    }, [result.data])

    if (!show) {
        return null
    }
    const handleLogin = async (evt) => {
        evt.preventDefault()
        await login({ variables: { username, password } })
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input type='text' name='username' value={username} onChange={({target}) => setUsername(target.value)} />
                </div>
                <div>
                    Password
                    <input type='password' name='password' value={password} onChange={({target}) => setPassword(target.value)} />
                </div>
                <div>
                    <button type='submit'>login</button>
                </div>
            </form>
        </div>
    );
}

export default Login;