// File: src/utils.ts

/*eslint prefer-rest-params: 0*/
/*
Copyright (C) 2023 github@soulwax

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// src/utils.ts
// "ExperimentalWarning": The buffer.File warning is annoying.
// Suppresses it for now.
// Full warning output:
// - ExperimentalWarning: buffer.File is an experimental feature and might change at any time
const originalEmitWarning = process.emitWarning
process.emitWarning = function (warning: string | Error, options?: undefined) {
  if (typeof warning === 'string' && warning.includes('ExperimentalWarning')) {
    return
  }
  return originalEmitWarning.apply(this, [warning, options])
}

import { Attachment } from 'discord.js'
import FormData from 'form-data'
import fs from 'fs'
import https from 'https'
import path from 'path'
import { pipeline } from 'stream/promises'
import config from './config'
import { ImageToImageResponseBody, RequestBodyOptions, TextToImageRequestBody, TextToImageResponseBody } from './types'

const VERBOSE = config.verbose

export const createRequestBody = ({
  prompt,
  negativePrompt = 'blurry, bad',
}: RequestBodyOptions): TextToImageRequestBody => ({
  prompt: `${prompt} ${negativePrompt ? `. Negative prompt: ${negativePrompt}` : ''}`,
  output_format: 'webp',
  cfg_scale: 7,
  steps: 40,
  seed: 0,
  samples: 1,
  // Remove width/height/style_preset/text_prompts as they're not used in v2beta(?)
})

export const saveOutgoingImages = (responseJSON: TextToImageResponseBody): string[] => {
  const paths: string[] = []
  console.log('Saving images...')
  const outputFolder = './images/out'

  // Create the directory if it doesn't exist
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true })
  }

  responseJSON.artifacts.forEach((image: { seed: number; base64: string }) => {
    const filePath = path.join(outputFolder, `txt2img_${image.seed}.png`)
    paths.push(filePath)
    fs.writeFileSync(filePath, Buffer.from(image.base64, 'base64'))
    if (VERBOSE) console.log(`Saved image to ${filePath}`)
  })

  return paths
}

export const saveIncomingImages = async (attachment: Attachment): Promise<string[]> => {
  const paths: string[] = []
  console.log('Saving images...')
  const outputFolder = './images/in'
  const name = attachment.name
  const url = new URL(attachment.url)

  // Create the directory if it doesn't exist
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true })
  }

  const filePath = path.join(outputFolder, name)
  paths.push(filePath)

  return new Promise<string[]>((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusMessage}`))
          return
        }

        pipeline(response, fs.createWriteStream(filePath) as unknown as NodeJS.WritableStream)
          .then(() => {
            console.log(`Saved image to ${filePath}`)
            resolve(paths)
          })
          .catch((err) => {
            reject(new Error(`Failed to save image: ${err.message}`))
          })
      })
      .on('error', (err) => {
        reject(new Error(`Failed to download image: ${err.message}`))
      })
  })
}

export const handleErrorResponse = async (response: Response) => {
  const errorCodes: Record<number, string> = {
    400: 'Bad request - check your prompt for forbidden content',
    401: 'Invalid API key',
    402: 'Payment required',
    429: 'Rate limit exceeded',
    500: 'Internal server error',
    503: 'Service temporarily unavailable',
  }

  let message = errorCodes[response.status] || 'Unknown error'

  try {
    const errorText = await response.text()
    message += `\nDetails: ${errorText}`
  } catch {
    // Ignore error parsing failure
  }

  throw new Error(`Stability AI API Error (${response.status}): ${message}`)
}

export const createHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.stableDiffusionApiKey}`,
})

// New function to create request body for image-to-image
export const createImageToImageRequestBody = (
  initImagePath: string,
  prompt: string,
  negativePrompt: string,
): FormData => {
  const formData = new FormData()
  formData.append('init_image', fs.readFileSync(initImagePath))
  formData.append('init_image_mode', 'IMAGE_STRENGTH')
  formData.append('image_strength', 0.35)
  formData.append('steps', 40)
  formData.append('width', 1024)
  formData.append('height', 1024)
  formData.append('seed', 0)
  formData.append('cfg_scale', 5)
  formData.append('samples', 1)
  formData.append('text_prompts[0][text]', prompt)
  formData.append('text_prompts[0][weight]', 1)
  formData.append('text_prompts[1][text]', negativePrompt)
  formData.append('text_prompts[1][weight]', -1)
  return formData
}

export const imageToImage = async (
  initImagePath: string,
  prompt: string,
  negativePrompt = 'blurry, bad',
): Promise<string[]> => {
  const headers = {
    ...createHeaders(),
    ...createImageToImageRequestBody(initImagePath, prompt, negativePrompt).getHeaders(),
  }
  const response = await fetch(config.imageToImageApiUrl, {
    method: 'POST',
    headers,
    body: createImageToImageRequestBody(initImagePath, prompt, negativePrompt) as unknown as BodyInit,
  })

  if (!response.ok) {
    await handleErrorResponse(response as Response)
  }

  const responseJSON: ImageToImageResponseBody = (await response.json()) as ImageToImageResponseBody
  return saveOutgoingImages(responseJSON)
}

export const textToImage = async ({
  prompt,
  negativePrompt = 'blurry, bad',
}: RequestBodyOptions): Promise<string[]> => {
  const formData = new FormData()
  const body = createRequestBody({ prompt, negativePrompt })

  // Convert body to FormData
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value)
    }
  })

  const response = await fetch(config.textToImageApiUrl ?? '', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.stableDiffusionApiKey}`,
      Accept: 'image/*',
      ...formData.getHeaders(), // Add FormData headers
    },
    // Fix the type error by using getBuffer() for the body
    body: formData.getBuffer() as unknown as BodyInit,
  })

  if (!response.ok) {
    await handleErrorResponse(response)
  }

  const buffer = await response.arrayBuffer()
  const outputFolder = './images/out'
  const filePath = path.join(outputFolder, `txt2img_${Date.now()}.webp`)

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true })
  }

  fs.writeFileSync(filePath, Buffer.from(buffer))
  return [filePath]
}
