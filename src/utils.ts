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
import fs from 'fs'
import config from './config'
import { TextToImageRequestBody, TextToImageResponseBody, RequestBodyOptions } from './types'

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
  });

export const saveImages = (responseJSON: TextToImageResponseBody): string[] => {
  const paths: string[] = []
  responseJSON.artifacts.forEach((image: { seed: number; base64: string }) => {
    const path = `./images/out/txt2img_${image.seed}.png`
    paths.push(path)
    fs.writeFileSync(path, Buffer.from(image.base64, 'base64'))
  })
  return paths
}

export const handleErrorResponse = async (response: Response) => {
  const errorMessage = `\`${response.statusText}\`\nWeb status code response from stability.ai api: \`${response.status}\``
  console.log(errorMessage)
  throw new Error(errorMessage)
}

export const createHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.stableDiffusionApiKey}`,
})

export const textToImage = async (prompt: string): Promise<string[]> => {
  const headers = createHeaders()
  const body = createRequestBody({ prompt })

  const response = await fetch(config.textToImageApiUrl ?? '', {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    await handleErrorResponse(response as Response)
  }

  const responseJSON: TextToImageResponseBody = (await response.json()) as TextToImageResponseBody
  return saveImages(responseJSON)
}
