import { ChangeEvent, useEffect, useState } from 'react'
import { Alert, AlertTitle, Box, Button, CircularProgress, Stack } from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { ApiResponse } from 'src/pages/api/upload/[room]'

export function Upload() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (image) {
      const reader = new FileReader()

      reader.onloadend = () => {
        if (reader.result) setPreview(reader.result as string)
      }

      reader.readAsDataURL(image)
    }
  }, [image])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
    }
  }

  const handleSubmit = async () => {
    if (!image) {
      setError('Please select an image to upload.')
      return
    }

    setError(null)
    setIsLoading(true)

    const searchParamsRoomKey = 'room'
    const params = new URLSearchParams(window.location.search)
    const room = params.get(searchParamsRoomKey)

    if (!room) {
      setError(
        'Sorry, there was something wrong with determining which lane to upload to. Please close this page and try again.'
      )
      return
    }

    const formData = new FormData()
    formData.append('image', image)

    try {
      const res = await fetch(`/api/upload/${room}`, {
        method: 'POST',
        body: formData,
      })
      const json = (await res.json()) as ApiResponse

      if (!json.success) throw new Error(json.message)
      if (!res.ok) throw new Error('Failed to upload the image.')

      console.log('Image uploaded succesfully.', json)
      alert(
        'Image uploaded succesfully! You can now close this page and request a Therapist to approve your photo.'
      )
    } catch (error) {
      console.error(error)
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        setError(error.message)
      } else {
        setError('There was an error uploading that photo.')
      }
    } finally {
      setIsLoading(false)
      setImage(null)
      setPreview(null)
    }
  }

  return (
    <Box>
      <Button
        variant={preview ? 'outlined' : 'contained'}
        component="label"
        startIcon={<PhotoCamera />}
        fullWidth
      >
        {preview ? 'Change' : 'Upload'}
        <input hidden accept="image/*" type="file" onChange={handleFileChange} />
      </Button>
      {preview && (
        <Box my={2}>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Target preview"
              width={400}
              height={400}
              style={{ objectFit: 'cover', width: '100%', height: 'auto', aspectRatio: '1 / 1' }}
            />
          }
        </Box>
      )}
      {error && (
        <Alert severity="error" variant="filled" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          Something went wrong when uploading your image. {error}
        </Alert>
      )}
      {preview &&
        (isLoading ? (
          <Stack direction="row" justifyContent="center">
            <CircularProgress />
          </Stack>
        ) : (
          <Button variant="contained" onClick={handleSubmit} disabled={isLoading} fullWidth>
            Upload
          </Button>
        ))}
    </Box>
  )
}
