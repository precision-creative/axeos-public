import { NextApiHandler } from 'next'
import formidable, { File } from 'formidable'

export type ApiResponse = {
  success: boolean
  message?: string
  data?: any
}

const handler: NextApiHandler<ApiResponse> = async (req, res) => {
  const room = req.query.room as string
  const form = new formidable.IncomingForm({
    maxFileSize: 1000000000,
    uploadDir: './uploads',
    allowEmptyFiles: false,
    keepExtensions: true,
    multiples: false,
  })

  form.parse(req, async (error, fields, files) => {
    if (error) {
      res.status(400).json({ success: false, message: error.message })
      return
    }

    try {
      const { filepath: filePath, newFilename: fileName } = files.image as File

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/targets/upload/${room}`, {
        method: 'POST',
        body: JSON.stringify({ filePath, fileName, test: 'two' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('There was an issue with that request on the server.')
      }

      const data = await response.json()
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        res.json({
          success: false,
          message: 'There was an issue with that request. ' + error.message,
        })
      } else {
        res.json({ success: false, message: 'There was an issue whith that request.' })
      }
      console.log(error)
      return
    }

    res.json({ success: true, message: 'Image uploaded succesfully.', data: files })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
