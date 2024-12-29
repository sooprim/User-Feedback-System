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
  const [newMovie, setNewMovie] = useState({ title: '', description: '', rating: 1, userId: '', imageUrl: '' })
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
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
    if (editingMovie) {
      setEditingMovie({ ...editingMovie, [name]: value })
    } else {
      setNewMovie({ ...newMovie, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMovie.userId) {
      alert("Please select a user")
      return
    }

    try {
      if (editingMovie) {
        const updatedMovie = {
          ...editingMovie,
          userId: editingMovie.userId,
          imageUrl: editingMovie.imageUrl,
        }
        await axios.put(`http://localhost:5618/movies/${editingMovie.id}`, updatedMovie)
        setEditingMovie(null)
      } else {
        const movieToCreate = {
          ...newMovie,
          userId: newMovie.userId,
          imageUrl: newMovie.imageUrl,
        }
        await axios.post('http://localhost:5618/movies', movieToCreate)
      }
      setNewMovie({ title: '', description: '', rating: 1, userId: '', imageUrl: '' })
      fetchMovies()
    } catch (error) {
      console.error('Error saving movie:', error)
    }
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
  }

  const handleCancelEdit = () => {
    setEditingMovie(null)
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

  const getMovieImage = (title: string) => {
    switch (title.toLowerCase()) {
      case 'mario':
        return '/Mario-Icon.png'
      case 'thor':
        return '/Thor-Icon.png'
      case 'batman':
        return '/Batman-Icon.png'
      case 'spiderman':
        return '/Spiderman-Icon.png'
      default:
        return '/default-icon.png' // A default icon if no match is found
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={editingMovie ? editingMovie.title : newMovie.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full"
          required
        />
        <input
          type="text"
          name="description"
          value={editingMovie ? editingMovie.description : newMovie.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="w-full"
          required
        />
        <input
          type="number"
          name="rating"
          value={editingMovie ? editingMovie.rating : newMovie.rating}
          onChange={handleInputChange}
          placeholder="Rating"
          className="w-full"
          min="1"
          max="10"
          required
        />
        <select
          name="userId"
          value={editingMovie ? editingMovie.userId : newMovie.userId}
          onChange={handleInputChange}
          className="w-full"
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} {user.surname}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="imageUrl"
          value={editingMovie ? editingMovie.imageUrl : newMovie.imageUrl}
          onChange={handleInputChange}
          placeholder="Image Destination (Optional)"
          className="w-full"
        />
        <div className="flex justify-between">
          <button type="submit" className="btn">
            {editingMovie ? 'Update Movie' : 'Add Movie'}
          </button>
          {editingMovie && (
            <button type="button" onClick={handleCancelEdit} className="btn bg-gray-500">
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-4">
        {movies.map((movie) => (
          <li key={movie.id} className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Image
                src={getMovieImage(movie.title)}
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
              <button onClick={() => handleEdit(movie)} className="btn bg-yellow-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(movie.id)} className="btn bg-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
