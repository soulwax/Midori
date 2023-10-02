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

import fs from 'fs'
import config from './config'
import { TextToImageRequestBody, TextToImageResponseBody, RequestBodyOptions } from './types'
const VERBOSE = config.verbose

export const createRequestBody = ({
  prompt,
  negativePrompt = 'blurry, bad',
  stylePreset,
}: RequestBodyOptions): TextToImageRequestBody => ({
  steps: 40,
  width: 512,
  height: 512,
  seed: 0,
  cfg_scale: 5,
  samples: 1,
  style_preset: stylePreset,
  text_prompts: [
    {
      text: prompt,
      weight: 1,
    },
    {
      text: negativePrompt,
      weight: -1,
    },
  ],
})

export const saveImages = (responseJSON: TextToImageResponseBody): string[] => {
  const paths: string[] = []
  console.log('Saving images...')
  responseJSON.artifacts.forEach((image: { seed: number; base64: string }) => {
    const path = `./images/out/txt2img_${image.seed}.png`
    paths.push(path)
    fs.writeFileSync(path, Buffer.from(image.base64, 'base64'))
    if (VERBOSE) console.log(`Saved image to ${path}`)
  })
  return paths
}

export const handleErrorResponse = async (response: Response) => {
  const errorMessage = `\`${response.statusText}\`\nWeb status code response from stability.ai api: \`${response.status}\``
  console.error(errorMessage)
  throw new Error(errorMessage)
}

export const createHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.stableDiffusionApiKey}`,
})

export const textToImage = async ({
  prompt,
  negativePrompt = 'blurry, bad',
  stylePreset,
}: RequestBodyOptions): Promise<string[]> => {
  const headers = createHeaders()
  const body = createRequestBody({ prompt, negativePrompt, stylePreset })

  if (VERBOSE) {
    console.log('Request headers:')
    console.dir(headers)
    console.log('----------------')
    console.log('Request body:')
    console.dir(body)
    console.log('----------------')
  }
  const response = await fetch(config.textToImageApiUrl ?? '', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    await handleErrorResponse(response as Response)
  }

  const responseJSON: TextToImageResponseBody = (await response.json()) as TextToImageResponseBody
  if (VERBOSE) {
    console.log('----------------')
    console.log('Response body as JSON:')
    console.dir(responseJSON)
    console.log('----------------')
  }
  return saveImages(responseJSON)
}
