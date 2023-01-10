import { Box, Button, IconButton, Input, Typography } from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { ChangeEvent, useEffect, useState } from 'react'

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
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('http://localhost:4000/targets/upload/', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      console.log({ data })
    } catch (error) {
      console.log({ error })
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
      <Button variant="contained" component="label">
        Upload
        <input hidden accept="image/*" type="file" onChange={handleFileChange} />
      </Button>
      <IconButton color="primary" aria-label="upload picture" component="label">
        <input hidden accept="image/*" type="file" onChange={handleFileChange} />
        <PhotoCamera />
      </IconButton>
      {filePreview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={filePreview!}
          alt="Preview"
          width={400}
          height={400}
          style={{ objectFit: 'contain' }}
        />
      )}
      <Button variant="contained" onClick={handleSubmit}>
        Send
      </Button>
    </Box>
  )
}
