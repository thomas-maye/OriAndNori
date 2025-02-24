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
    vaccined: vine.boolean().optional(),
    gender: vine.enum(['male', 'female']),
    description: vine.string().optional(),
    species_id: vine.number().exists({ table: 'species', column: 'id' }),
    breed_id: vine.number().exists({ table: 'breeds', column: 'id' }),
    photo: vine
      .file({
        size: '4mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)
