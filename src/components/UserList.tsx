'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'

interface User {
  id: number
  name: string
  surname: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({ name: '', surname: '' })
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5618/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value })
    } else {
      setNewUser({ ...newUser, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: Ensure both name and surname are provided
    const userToValidate = editingUser || newUser
    if (!userToValidate.name.trim() || !userToValidate.surname.trim()) {
      alert('Both first name and last name are required.')
      return
    }

    try {
      if (editingUser) {
        await axios.put(`http://localhost:5618/users/${editingUser.id}`, editingUser)
        setEditingUser(null)
      } else {
        await axios.post('http://localhost:5618/users', newUser)
        setNewUser({ name: '', surname: '' })
      }
      fetchUsers()
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5618/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={editingUser ? editingUser.name : newUser.name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full"
          />
        </div>
        <div>
          <input
            type="text"
            name="surname"
            value={editingUser ? editingUser.surname : newUser.surname}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full"
          />
        </div>
        <div className="flex justify-between">
          <button type="submit" className="btn">
            {editingUser ? 'Update User' : 'Add User'}
          </button>
          {editingUser && (
            <button type="button" onClick={handleCancelEdit} className="btn bg-gray-500">
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Image
                src="/user.png"
                alt="User icon"
                width={50}
                height={50}
                className="mr-4 rounded"
              />
              <span>{user.name} {user.surname}</span>
            </div>
            <div>
              <button onClick={() => handleEdit(user)} className="btn bg-yellow-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(user.id)} className="btn bg-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
