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

      const selectedPets = await Pet.query().where('user_id', user.id).whereIn('id', petIds)

      if (selectedPets.length !== petIds.length) {
        session.flash('error', 'One or more selected pets do not belong to you')
        return response.redirect().back()
      }

      const meetup = await Meetup.create({
        ...validatedData,
        userId: user.id,
        organizer: user.username,
      })

      const petsData = Object.fromEntries(
        selectedPets.map((pet) => [pet.id, { pet_name: pet.name }])
      )
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

      //la date est un objet luxon, on le formate pour l'afficher c'est chiant
      const meetupDate = DateTime.isDateTime(meetup.date)
        ? meetup.date
        : DateTime.fromJSDate(meetup.date)

      const formattedDate = meetupDate.toFormat('dd/MM/yyyy HH:mm')

      //participant meetup
      const meetupUsers = await meetup
        .related('meetupUsers')
        .query()
        .pivotColumns(['user_name', 'sort_order'])
        .orderBy('pivot_sort_order')

      //pet participant
      const meetupPets = await meetup
        .related('meetupPets')
        .query()
        .pivotColumns(['pet_name', 'sort_order'])
        .orderBy('pivot_sort_order')

      // les pets de l'user connecté
      const connectUserPet = await Pet.query().where('user_id', user.id).select(['id', 'name'])
      //console.log(connectUserPet)

      return view.render('pages/meetup/display_meetup', {
        meetup,
        meetupUsers,
        meetupPets,
        formattedDate,
        connectUserPet,
      })
    } catch (error) {
      session.flash('error', 'Meetup not found') // a affiché un message d'erreur mais voir comment._.
      return response.redirect().toRoute('myMeetups')
    }
  }
  async displayMeetupsList({ view, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const meetups = await Meetup.query()
      .whereHas('meetupUsers', (query) => {
        query.where('user_id', user.id)
      })
      .preload('meetupPets', (query) => {
        query.preload('breed')
        query.preload('species')
      })
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
      .preload('meetupPets', (query) => {
        query.preload('breed')
        query.preload('species')
      })
      .orderBy('date', 'asc')

    // pour avoir une date a bien formatté
    const formattedMeetups = meetups.map((meetup) => ({
      ...meetup.serialize(),
      formattedDate: DateTime.isDateTime(meetup.date)
        ? meetup.date
        : DateTime.fromJSDate(new Date(meetup.date)).toFormat('dd/MM/yyyy HH:mm'),
    }))
    return view.render('pages/meetup/my_meetups', { meetups: formattedMeetups })
  }

  async joinMeetup({ auth, params, response, session, request }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const meetup = await Meetup.find(params.id)

      if (!meetup) {
        session.flash('error', 'Meetup not found')
        return response.redirect().toRoute('meetups')
      }

      const petIds: number[] = request.input('petIds', [])

      const userAlreadyInMeetup = await meetup
        .related('meetupUsers')
        .query()
        .where('user_id', user.id)
        .first()

      if (!userAlreadyInMeetup) {
        await meetup.related('meetupUsers').attach({
          [user.id]: { user_name: user.username },
        })
      }

      if (petIds.length === 0) {
        session.flash('success', 'You have successfully joined the meetup like a Moldu')
        return response.redirect().toRoute('myMeetups')
      }

      if (petIds.length > 0) {
        const selectedPets = await Pet.query().where('user_id', user.id).whereIn('id', petIds)

        if (selectedPets.length !== petIds.length) {
          session.flash('error', 'One or more selected pets do not belong to you')
          return response.redirect().toRoute('myMeetups')
        }

        const petsData = Object.fromEntries(
          selectedPets.map((pet) => [pet.id, { pet_name: pet.name }])
        )

        await meetup.related('meetupPets').attach(petsData)
      }

      session.flash('success', 'You have successfully joined the meetup')
      return response.redirect().toRoute('myMeetups') //a voir si on les laisse pas la ou ils sont déjà
    } catch (error) {
      session.flash('error', 'Error joining meetup')
      return response.redirect().toRoute('myMeetups')
    }
  }

  async leaveMeetup({ auth, params, response, session }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      // find meetup
      const meetup = await Meetup.find(params.id)

      if (!meetup) {
        session.flash('error', 'Meetup not found')
        return response.redirect().toRoute('myMeetups')
      }
      // find user pets
      const userPets = await Pet.query().where('user_id', user.id)
      //map ID for js object for detach
      const userPetsIds = userPets.map((pet) => pet.id)

      await meetup.related('meetupUsers').detach([user.id])

      await meetup.related('meetupPets').detach(userPetsIds)

      session.flash('success', 'You have successfully leave the meetup')
      return response.redirect().toRoute('myMeetups')
    } catch (error) {
      session.flash('error', 'Error leaving meetup')
      return response.redirect().toRoute('myMeetups')
    }
  }

  async removePetFromMeetup({ auth, params, response, session, request }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const meetup = await Meetup.find(params.id)

      if (!meetup) {
        session.flash('error', 'Meetup not found')
        return response.redirect().toRoute('myMeetups')
      }

      const petId = request.input('petId')

      const pet = await Pet.find(petId)

      if (!pet) {
        session.flash('error', 'Pet not found')
        return response.redirect().toRoute('myMeetups')
      }

      await meetup.related('meetupPets').detach([petId])

      session.flash('success', 'Pet removed from meetup')
      return response.redirect().toRoute('myMeetups')
    } catch (error) {
      session.flash('error', 'Error removing pet from meetup')
      return response.redirect().toRoute('myMeetups')
    }
  }

  async deleteMeetup({ auth, params, response, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const meetup = await Meetup.find(params.id)

    if (!meetup) {
      session.flash('error', 'Meetup not found')
      return response.redirect().toRoute('myMeetups')
    }

    if (meetup.userId !== user.id) {
      session.flash('error', 'You are not the organizer of this meetup')
      return response.redirect().toRoute('myMeetups')
    }

    await meetup.delete()
    session.flash('success', 'Meetup deleted successfully!')
    return response.redirect().toRoute('myMeetups')
  }
}
