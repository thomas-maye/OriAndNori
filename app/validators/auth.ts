import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .minLength(6)
      .alphaNumeric()
      .unique(async (db, value) => {
        const users = await db.from('users').where('username', value).first()
        return !users
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const users = await db.from('users').where('email', value).first()
        return !users
      }),
    password: vine.string().minLength(8),
    first_name: vine.string().trim().minLength(2).optional(),
    last_name: vine.string().trim().minLength(2).optional(),
    address_1: vine.string().trim().minLength(5).optional(),
    address_2: vine.string().trim().minLength(5).optional(),
    postal_code: vine.string().trim().minLength(2).optional(),
    city: vine.string().trim().alpha().minLength(2).optional(),
    phone: vine.string().trim().minLength(10).optional(),
    description: vine.string().trim().minLength(10).optional(),
    profile_picture: vine.string().optional(),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(8).confirmed(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    first_name: vine.string().trim().minLength(2).optional(),
    last_name: vine.string().trim().minLength(2).optional(),
    address_1: vine.string().trim().minLength(5).optional(),
    address_2: vine.string().trim().minLength(5).optional(),
    postal_code: vine.string().trim().minLength(2).optional(),
    city: vine.string().trim().alpha().minLength(2).optional(),
    phone: vine.string().trim().minLength(10).optional(),
    description: vine.string().trim().minLength(10).maxLength(150).optional(),
    profile_picture: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)
