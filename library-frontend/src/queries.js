import { gql } from '@apollo/client'

export const BOOKS_ADDED = gql`
  subscription {
    bookAdded {
      title,
      published,
      genres,
      author {
        name
      }
      id
    }
  }
`

export const GET_ALL_AUTHORS = gql`
  query {
    getAuthors {
      name
      born
      id
    }
  }
`

export const GET_ALL_BOOKS = gql`
  query {
    getBooks {
      title
      published
      author {
        name
      }
      id
      genres
    }
  }
`

export const GET_BOOKS_BY_GENRE = gql`
  query getBooks($genre: String!) {
    getBooks(genre: $genre) {
      title
      published
      genres
      author {
        name
      }
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBooks($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    createBooks(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title,
      published,
      genres,
      author {
        name
      }
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation editBorn($name: String!, $born: Int!) {
    editBorn(name: $name, born: $born) {
      name,
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  } 
`