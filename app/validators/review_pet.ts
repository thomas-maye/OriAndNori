import vine from '@vinejs/vine'

export const reviewPetValidator = vine.compile(
  vine.object({
    rating: vine.number().min(0).max(5),
    description: vine.string().minLength(1).maxLength(500),
  })
)
