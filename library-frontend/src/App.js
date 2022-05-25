import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useMutation, useApolloClient, useSubscription } from '@apollo/client'
import { GET_ALL_BOOKS, CREATE_BOOK, BOOKS_ADDED } from './queries'
import RecommendedBooks from "./components/RecommendedBooks";

const App = () => {
  const [token, setToken] = useState(null)
  const [error, setError] = useState('')
  const [page, setPage] = useState(token ? 'authors' : 'login')
  const client = useApolloClient()

  useSubscription(BOOKS_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`Added ${addedBook.title} to the book collection!`)
      client.cache.updateQuery({ query: GET_ALL_BOOKS }, ({ getBooks }) => {
        return {
          getBooks: getBooks.concat(addedBook)
        }
      })
    }
  })

  const [ createBooks ] = useMutation(CREATE_BOOK, {
    refetchQueries: { query: GET_ALL_BOOKS },
    onError: error => {
      setError(error.graphQLErrors[0].message)
    }
  })
    const validToken = token ? token : JSON.parse(window.localStorage.getItem('jwt'))
    if (!validToken) {
        return (
            <Login show={page === 'login'} setToken={setToken} setError={setError} />
        )
    }
    const handleLogout = () => {
      setToken(null)
      localStorage.clear()
      client.resetStore()
    }

    return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={handleLogout}>logout</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} createBooks={createBooks} />

      <RecommendedBooks show={page === 'recommendations'} />
    </div>
  )
}

export default App
