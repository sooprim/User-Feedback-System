'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'

interface Movie {
  id: string
  title: string
  description: string
  rating: number
  userId: string
  imageUrl?: string
}

interface User {
  id: string
  name: string
  surname: string
}

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    rating: 1,
    userId: '',
    imageUrl: ''
  })
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchMovies()
    fetchUsers()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5618/movies')
      setMovies(response.data)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5618/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewMovie({ ...newMovie, [name]: value })
  }

  const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMovie.userId) {
      alert('Please select a user')
      return
    }

    const imageUrl = newMovie.imageUrl

    if (imageUrl && !(await isValidImageUrl(imageUrl))) {
      alert('Provide a valid image from /public')
      return
    }

    try {
      const movieToCreate = {
        ...newMovie,
        userId: newMovie.userId,
        imageUrl: newMovie.imageUrl,
      }
      await axios.post('http://localhost:5618/movies', movieToCreate)
      setNewMovie({
        title: '',
        description: '',
        rating: 1,
        userId: '',
        imageUrl: ''
      })
      fetchMovies()
    } catch (error) {
      console.error('Error saving movie:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5618/movies/${id}`)
      fetchMovies()
    } catch (error) {
      console.error('Error deleting movie:', error)
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user ? `${user.name} ${user.surname}` : 'Unknown User'
  }

  const getMovieImage = (title: string, imageUrl: string) => {
    if (imageUrl) {
      return imageUrl
    }

    switch (title.toLowerCase()) {
      case 'mario':
        return '/mario.png'
      case 'thor':
        return '/thor.png'
      case 'batman':
        return '/batman.png'
      case 'spiderman':
        return '/spiderman.png'
      default:
        return '/default.png'
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={newMovie.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full"
          required
        />
        <input
          type="text"
          name="description"
          value={newMovie.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="w-full"
          required
        />
        <div className="flex items-center space-x-4">
          <label htmlFor="rating" className="text-lg text-gray-500">Rating</label>
          <input
            type="number"
            name="rating"
            value={newMovie.rating}
            onChange={handleInputChange}
            id="rating"
            className="w-20"
            min="1"
            max="10"
            step="0.5"
            required
          />
        </div>
        <select
          name="userId"
          value={newMovie.userId}
          onChange={handleInputChange}
          className="w-full"
          required
        >
          <option value="" disabled>
            Select User
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} {user.surname}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="imageUrl"
          value={newMovie.imageUrl}
          onChange={handleInputChange}
          placeholder="Image URL (ex: /mario.png)"
          className="w-full"
        />
        <button type="submit" className="btn">
          Add Movie
        </button>
      </form>
      <ul className="space-y-4">
        {movies.map((movie) => (
          <li key={movie.id} className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Image
                src={getMovieImage(movie.title, movie.imageUrl || '')}
                alt={`${movie.title} icon`}
                width={50}
                height={50}
                className="mr-4 rounded"
              />
              <div>
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p>{movie.description}</p>
                <p>Rating: {movie.rating}/10 ({getUserName(movie.userId)})</p>
              </div>
            </div>
            <div>
              <button onClick={() => handleDelete(movie.id)} className="btn bg-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
