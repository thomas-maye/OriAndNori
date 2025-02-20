import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const meetupValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).maxLength(50),
    //organizer: vine.string().minLength(1).maxLength(50),
    description: vine.string().optional(),
    adress: vine.string().minLength(1).maxLength(50),
    additional_address: vine.string().optional(),
    city: vine.string().minLength(1).maxLength(50),
    type: vine.enum(['Walk', 'Sociabiliation']),
    date: vine.string().transform((value) => DateTime.fromISO(value)),
  })
)
