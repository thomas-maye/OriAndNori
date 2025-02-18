import type { HttpContext } from '@adonisjs/core/http'
import Pet from '#models/pet'
//import User from '#models/user'
import Meetup from '#models/meetup'
import { meetupValidator } from '#validators/meetup'

export default class MeetupsController {
  async createMeetup({ auth, request, response }: HttpContext) {
    try {
      // console.log('Request body:', request.body())

      const validatedData = await request.validateUsing(meetupValidator)
      //console.log('Validated data:', validatedData)
      const petIds: number[] = request.input('petIds', [])

      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const userPet = await Pet.query().where('user_id', user.id).select(['id', 'name'])

      if (userPet.length !== petIds.length) {
        return response.badRequest({
          message: 'One or more selected pets do not belong to you',
        })
      }

      const meetup = await Meetup.create({
        ...validatedData,
        userId: user.id,
      })

      const petsData = Object.fromEntries(userPet.map((pet) => [pet.id, { pet_name: pet.name }]))
      const userData = Object.fromEntries([[user.id, { user_name: user.username }]])

      await meetup.related('meetupPets').attach(petsData)
      await meetup.related('meetupUsers').attach(userData)

      console.log(meetup)
      return response.status(201).json({
        message: 'Meetup created successfully!',
        data: meetup,
      })
    } catch (error) {
      console.error('Validation error details:', error)
      return response.status(400).json({
        message: 'Error creating meetup',
        error: error.message,
        details: error.messages || error.message,
      })
    }
  }
  async MeetupsForm({ view, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const userPets = await Pet.query().where('user_id', user.id).select(['id', 'name'])

    return view.render('pages/create_meetup_form', { pets: userPets })
  }
}
