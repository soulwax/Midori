export interface TextToImageRequestBody {
  steps: number
  width: number
  height: number
  seed: number
  cfg_scale: number
  samples: number
  text_prompts: Array<{
    text: string
    weight: number
  }>
}

export interface TextToImageResponseBody {
  artifacts: Array<{
    seed: number
    base64: string
  }>
}
