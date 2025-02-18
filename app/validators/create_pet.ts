import vine from '@vinejs/vine'

export const createPetValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(50),
    birthday: vine.date(),
    personality: vine.array(
      vine.object({
        trait: vine.string(),
        rating: vine.number().min(0).max(5),
      })
    ),
    vaccined: vine.boolean(),
    gender: vine.enum(['male', 'female']),
    description: vine.string().optional(),
    breed: vine.string(),
    species: vine.string(),
    photo: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg']
    }).optional()
  })
)
