import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 })
    }

    // Convert file to a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "collabforge", // Optional: specify a folder in Cloudinary
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error)
              return reject(error)
            }
            resolve(result)
          },
        )
        .end(buffer)
    })

    // @ts-ignore - result type from upload_stream is not fully inferred
    return NextResponse.json({ url: result.secure_url }, { status: 200 })
  } catch (error) {
    console.error("Error in image upload route:", error)
    return NextResponse.json({ message: "Failed to upload image." }, { status: 500 })
  }
}
