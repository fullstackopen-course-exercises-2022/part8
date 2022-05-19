import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const Authors = ({ show }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [message, setMessage] = useState('')
  const results = useQuery(GET_ALL_AUTHORS)

  const [ editBorn ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }],
    onError: error => {
      setMessage(error.graphQLErrors[0].message)
    }
  })

  if (!show) {
    return null
  }
  const authors = results?.data?.getAuthors

  const handleUpdateYear = async (evt) => {
    evt.preventDefault()
    console.log('Updated Year')
    await editBorn({ variables: { name, born: parseInt(born) } })
    setName('')
    setBorn('')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.map((a) => (
            <tr key={a?.id}>
              <td>{a?.name}</td>
              <td>{a?.born}</td>
              {/*<td>{a.bookCount}</td>*/}
            </tr>
          ))}
        </tbody>
      </table>
      <p>{message}</p>
      <form onSubmit={handleUpdateYear}>
        <select name="name" id="" value={name} onChange={({target}) => setName(target.value)}>
          {authors?.map((author) =>
              <option value={author?.name}>{author?.name}</option>
          )}
        </select><br /><br />
        <input type='number' value={born} onChange={({target}) => setBorn(target.value)} /><br /><br />
        <button type='submit'>Update Year of Birth</button>
      </form>
    </div>
  )
}

export default Authors
