'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Comment {
  id: string
  text: string
  movieId: string
  userId: string
}

interface Movie {
  id: string
  title: string
}

interface User {
  id: string
  name: string
  surname: string
}

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState({ text: '', movieId: '', userId: '' })
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchComments()
    fetchMovies()
    fetchUsers()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:5618/comments')
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingComment) {
      setEditingComment({ ...editingComment, [name]: value })
    } else {
      setNewComment({ ...newComment, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingComment) {
        const updatedComment = {
          ...editingComment,
          movieId: editingComment.movieId,
          userId: editingComment.userId
        }
        await axios.put(`http://localhost:5618/comments/${editingComment.id}`, updatedComment)
        setEditingComment(null)
      } else {
        const commentToCreate = {
          ...newComment,
          movieId: newComment.movieId,
          userId: newComment.userId
        }
        await axios.post('http://localhost:5618/comments', commentToCreate)
        setNewComment({ text: '', movieId: '', userId: '' })
      }
      fetchComments()
    } catch (error) {
      console.error('Error saving comment:', error)
    }
  }

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment)
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5618/comments/${id}`)
      fetchComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user ? `${user.name} ${user.surname}` : 'Unknown User'
  }

  const getMovieTitle = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId)
    return movie ? movie.title : 'Unknown Movie'
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="text"
          value={editingComment ? editingComment.text : newComment.text}
          onChange={handleInputChange}
          placeholder="Comment"
          className="w-full"
          rows={3}
          required
        />
        <select
          name="movieId"
          value={editingComment ? editingComment.movieId : newComment.movieId}
          onChange={handleInputChange}
          className="w-full"
          required
        >
          <option value="">Select Movie</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
        <select
          name="userId"
          value={editingComment ? editingComment.userId : newComment.userId}
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
        <div className="flex justify-between">
          <button type="submit" className="btn">
            {editingComment ? 'Update Comment' : 'Add Comment'}
          </button>
          {editingComment && (
            <button type="button" onClick={handleCancelEdit} className="btn bg-gray-500">
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <span>
              {getUserName(comment.userId)} on {getMovieTitle(comment.movieId)} - "{comment.text}"
            </span>
            <div>
              <button onClick={() => handleEdit(comment)} className="btn bg-yellow-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(comment.id)} className="btn bg-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}