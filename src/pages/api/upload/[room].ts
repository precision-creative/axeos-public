import { NextApiHandler } from 'next'
import formidable, { File } from 'formidable'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

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
      const optimizedFileName = `opt-${fileName}`
      const optimizedFilePath = path.join(process.cwd(), `uploads/${optimizedFileName}`)

      // Optimize the image as a jpg
      await sharp(filePath)
        .resize(630, 630, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(optimizedFilePath)

      // Remove the original image
      await fs.unlink(filePath)

      // Make the request to the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/targets/upload/${room}`, {
        method: 'POST',
        body: JSON.stringify({ filePath: optimizedFilePath, fileName: optimizedFileName }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('There was an issue with that request on the server.')
      }

      await response.json()
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        res.json({
          success: false,
          message: error.message,
        })
      } else {
        res.json({ success: false, message: 'There was an issue with that request.' })
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
