'use client'

import { useState } from 'react'

export default function UploadPage() {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const res = await fetch('http://localhost:8080/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (res.ok) {
      setMessage(`✅ Success: ${data.message}`)
    } else {
      setMessage(`❌ Error: ${data.error}`)
    }
  }

  return (
    <div className='p-6 max-w-md mx-auto'>
      <h1 className='text-xl font-bold mb-4'>Upload Image</h1>
      <form
        onSubmit={handleSubmit}
        encType='multipart/form-data'
      >
        <input
          type='file'
          name='image'
          required
          className='mb-4'
        />
        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded'
        >
          Upload
        </button>
      </form>

      {message && <p className='mt-4'>{message}</p>}
    </div>
  )
}
