'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleButtonClick = () => {
    router.push('/users')
  }

  return (
    <main className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Welcome to User Feedback System</h1>
      <p className="mt-4 text-lg text-gray-400">
        This platform allows you to manage users, movies, and comments all in one place.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">What you can do:</h2>
        <p className="mt-2 text-lg text-gray-400">
          Add, edit, or remove users.
        </p>
        <p className="mt-2 text-lg text-gray-400">
          Manage your movie collection.
        </p>
        <p className="mt-2 text-lg text-gray-400">
          Add comments to existing movies.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Get Started!</h2>
        <p className="mt-2 text-lg text-gray-400">
          Explore the app by clicking the links above.
        </p>
      </div>

      <div className="mt-8"></div>
    </main>
  )
}
