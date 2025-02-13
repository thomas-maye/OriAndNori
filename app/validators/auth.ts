import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
<<<<<<< HEAD
    username: vine.string().trim().minLength(6).alphaNumeric().unique(async (db, value) => {
      const users = await db.from('users').where('username', value).first()
      return !users
    }),
    email: vine.string().email().unique(async (db, value) => {
      const users = await db.from('users').where('email', value).first()
      return !users
    }),
=======
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
>>>>>>> feature/-PetManagement
    password: vine.string().minLength(8),
  })
)

<<<<<<< HEAD
export const loginUserValidator = vine.compile(
=======
export const LoginUserValidator = vine.compile(
>>>>>>> feature/-PetManagement
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)
<<<<<<< HEAD

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(8).confirmed()
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    first_name: vine.string().trim().minLength(2),
    last_name: vine.string().trim().minLength(2),
    address_1: vine.string().trim().minLength(5),
    address_2: vine.string().trim().minLength(5),
    postal_code: vine.string().trim().minLength(2),
    city: vine.string().trim().alpha().minLength(2),
    phone: vine.string().trim().minLength(10),
    description: vine.string().trim().minLength(10),
  })
)
=======
>>>>>>> feature/-PetManagement
