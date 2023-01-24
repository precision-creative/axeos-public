import { ChangeEvent, useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Stack } from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'

const apiURL = process.env.NEXT_PUBLIC_API_URL

export function Upload() {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (null === files) return

    setFile(files[0])
    setFilePreview(URL.createObjectURL(files[0]))
  }

  const handleSubmit = async () => {
    if (null === file) return

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

    let json

    setLoading(true)

    try {
      const res = await fetch(`${apiURL}/targets/upload/${room}`, {
        method: 'POST',
        body: formData,
      })
      json = await res.json()

      if (!res.ok) {
        throw new Error(json.message)
      }
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        alert('There was an error uploading that photo. ' + error.message)
      }
    }

    setLoading(false)

    if (undefined !== json) {
      setFile(null)
      setFilePreview(null)

      alert('Image uploaded succesfully!')
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
      {filePreview &&
        (loading ? (
          <Stack direction="row" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : (
          <Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth>
            Send
          </Button>
        ))}
    </Box>
  )
}
