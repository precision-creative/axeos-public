import { Box, Button, IconButton, Input, Typography } from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { ChangeEvent, useEffect, useState } from 'react'

const apiURL = process.env.NEXT_PUBLIC_API_URL

export function Upload() {
  const [file, setFile] = useState<any>({})
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (null === files) return

    setFile(files[0])
    setFilePreview(URL.createObjectURL(files[0]))
  }

  const handleSubmit = async () => {
    try {
      const searchParamsRoomKey = 'room'
      const params = new URLSearchParams(window.location.search)
      let room = '0'

      if (params.has(searchParamsRoomKey)) {
        room = params.get(searchParamsRoomKey)!
      }

      const formData = new FormData()
      formData.append('image', file)

      if (undefined === apiURL) {
        console.warn('There was no `NEXT_PUBLIC_API_URL` found in the environment!')
      }

      const res = await fetch(`${apiURL}/targets/upload/${room}`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        alert('There was an error uploading that photo — ' + data.message)
        return
      }

      alert('Image uploaded succesfully!')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    return () => {
      if (null === filePreview) return

      URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

  return (
    <Box>
      <Button
        variant={filePreview ? 'outlined' : 'contained'}
        component="label"
        startIcon={<PhotoCamera />}
        fullWidth
      >
        {filePreview ? 'Change' : 'Upload'}
        <input hidden accept="image/*" type="file" onChange={handleFileChange} />
      </Button>
      {filePreview && (
        <Box my={2}>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={filePreview!}
              alt="Preview"
              width={400}
              height={400}
              style={{ objectFit: 'cover', width: '100%', height: 'auto', aspectRatio: '1 / 1' }}
            />
          }
        </Box>
      )}
      {filePreview && (
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Send
        </Button>
      )}
    </Box>
  )
}
