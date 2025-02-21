import type { HttpContext } from '@adonisjs/core/http'
import Pet from '#models/pet'
//import User from '#models/user'
import Meetup from '#models/meetup'
import { meetupValidator } from '#validators/meetup'
import { DateTime } from 'luxon'

export default class MeetupsController {
  async createMeetup({ auth, request, response, session }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const validatedData = await request.validateUsing(meetupValidator)
      const petIds: number[] = request.input('petIds', [])

      if (!petIds.length) {
        session.flash('error', 'You must select at least one pet for the meetup')
        return response.redirect().toRoute('createMeetupForm')
      }

      const userPet = await Pet.query().where('user_id', user.id).select(['id', 'name'])

      if (userPet.length !== petIds.length) {
        session.flash('error', 'One or more selected pets do not belong to you')
        return response.redirect().back()
      }

      const meetup = await Meetup.create({
        ...validatedData,
        userId: user.id,
        organizer: user.username,
      })

      const petsData = Object.fromEntries(userPet.map((pet) => [pet.id, { pet_name: pet.name }]))
      const userData = Object.fromEntries([[user.id, { user_name: user.username }]])

      await meetup.related('meetupPets').attach(petsData)
      await meetup.related('meetupUsers').attach(userData)

      session.flash('success', 'You have successfully create a Meetup')
      return response.redirect().toRoute('myMeetups')
    } catch (error) {
      session.flash('error', 'Error creating meetup')
      return response.redirect().toRoute('createMeetupForm')
    }
  }
  async meetupsForm({ view, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const userPets = await Pet.query().where('user_id', user.id).select(['id', 'name'])

    return view.render('pages/meetup/create_meetup_form', { pets: userPets })
  }

  async displayOneMeetup({ view, params, auth, response, session }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
      const meetup = await Meetup.findByOrFail('id', params.id)
      const meetupDate = DateTime.isDateTime(meetup.date)
        ? meetup.date
        : DateTime.fromJSDate(meetup.date)

      const formattedDate = meetupDate.toFormat('dd/MM/yyyy HH:mm')

      const meetupUsers = await meetup
        .related('meetupUsers')
        .query()
        .pivotColumns(['user_name', 'sort_order'])
        .orderBy('pivot_sort_order')

      const meetupPets = await meetup
        .related('meetupPets')
        .query()
        .pivotColumns(['pet_name', 'sort_order'])
        .orderBy('pivot_sort_order')

      if (!meetup) {
        return response.status(404).json({ message: 'Meetup not found' })
      }

      return view.render('pages/meetup/display_meetup', {
        meetup,
        meetupUsers,
        meetupPets,
        formattedDate,
      })
    } catch (error) {
      session.flash('error', 'Meetup not found') // a affiché un message d'erreur mais voir comment._.
      return response.redirect().toRoute('meetups')
    }
  }
  async displayMeetupsList({ view, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const meetups = await Meetup.query()
      .whereDoesntHave('meetupUsers', (query) => {
        query.where('user_id', user.id)
      })
      .preload('meetupPets')
      .orderBy('date', 'asc')

    const formattedMeetups = meetups.map((meetup) => ({
      ...meetup.serialize(),
      formattedDate: DateTime.isDateTime(meetup.date)
        ? meetup.date
        : DateTime.fromJSDate(new Date(meetup.date)).toFormat('dd/MM/yyyy HH:mm'),
    }))

    return view.render('pages/meetup/meetups', { meetups: formattedMeetups })
  }

  async displayMyMeetups({ view, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const meetups = await Meetup.query()
      .whereHas('meetupUsers', (query) => {
        query.where('user_id', user.id)
      })
      .preload('meetupPets')
      .orderBy('date', 'asc')

    const formattedMeetups = meetups.map((meetup) => ({
      ...meetup.serialize(),
      formattedDate: DateTime.isDateTime(meetup.date)
        ? meetup.date
        : DateTime.fromJSDate(new Date(meetup.date)).toFormat('dd/MM/yyyy HH:mm'),
    }))
    return view.render('pages/meetup/my_meetups', { meetups: formattedMeetups })
  }
  async joinMeetup({ auth, params, response, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const meetup = await Meetup.find(params.id)

    if (!meetup) {
      session.flash('error', 'Meetup not found')
      return response.redirect().toRoute('meetups')
    }

    await meetup.related('meetupUsers').attach({ [user.id]: { user_name: user.username } })

    session.flash('success', 'You have successfully joined the meetup')
    return response.redirect().toRoute('myMeetups') //a voir si on les laisse pas la ou ils sont déjà
  }

  async leaveMeetup({ auth, params, response, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const meetup = await Meetup.find(params.id)

    if (!meetup) {
      session.flash('error', 'Meetup not found')
      return response.redirect().toRoute('myMeetups')
    }

    await meetup.related('meetupUsers').detach([user.id])

    session.flash('success', 'You have successfully leave the meetup')
    return response.redirect().toRoute('myMeetups') //a voir si on les laisse pas la ou ils sont déjà
  }
}
