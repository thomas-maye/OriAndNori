import type { HttpContext } from '@adonisjs/core/http'
import Pet from '#models/pet'
//import User from '#models/user'
import Meetup from '#models/meetup'
import { meetupValidator } from '#validators/meetup'
import { DateTime } from 'luxon'
import ReviewMeetup from '#models/review_meetup'
import opencage from 'opencage-api-client'

export default class MeetupsController {
  /**
   * ------------------------------
   * Create a Meetup
   * ------------------------------
   */
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
  /**
   * ------------------------------
   * Show the Meetup create Form
   * ------------------------------
   */
  async meetupsForm({ view, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const userPets = await Pet.query().where('user_id', user.id).select(['id', 'name'])

    return view.render('pages/meetup/create_meetup_form', { pets: userPets })
  }
  /**
   * ------------------------------
   * Display One Meetup
   * ------------------------------
   */
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

      const reviewMeetup = await ReviewMeetup.query()
        .where('meetup_id', params.id)
        .preload('user')
        .orderBy('created_at', 'desc')

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

      const apiKey = process.env.OPENCAGE_API_KEY

      if (!apiKey) {
        session.flash('error', 'API key is missing')
        return response.redirect().back()
      }

      const address = `${meetup.adress}, ${meetup.city}`
      const addressData = await opencage.geocode({
        q: address,
        key: apiKey,
      })

      if (!addressData || addressData.status.code !== 200 || addressData.results.length === 0) {
        session.flash('error', 'Error fetching coordinates')
        return response.redirect().back()
      } else {
        const location = addressData.results[0]
        const meetupCoordinate = {
          ...meetup,
          latitude: location.geometry.lat,
          longitude: location.geometry.lng,
        }
        return view.render('pages/meetup/display_meetup', {
          meetup,
          meetupUsers,
          meetupPets,
          formattedDate,
          connectUserPet,
          reviewMeetup,
          meetupCoordinate,
          center: { latitude: location.geometry.lat, longitude: location.geometry.lng },
          zoom: 13,
        })
      }
    } catch (error) {
      session.flash('error', 'Meetup not found') // a affiché un message d'erreur mais voir comment._.
      return response.redirect().toRoute('myMeetups')
    }
  }

  /**
   * ------------------------------
   * Displays list of available meetups with their locations on a map
   * ------------------------------
   */
  async displayMeetupsList({ view, auth, response, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    // Get meetups user hasn't joined yet
    const meetups = await Meetup.query()
      .whereDoesntHave('meetupUsers', (query) => {
        query.where('user_id', user.id)
      })
      .preload('meetupPets', (query) => {
        query.preload('breed')
        query.preload('species')
      })
      .orderBy('date', 'asc')

    // Format dates for display
    const formattedMeetups = meetups.map((meetup) => ({
      ...meetup.serialize(),
      formattedDate: DateTime.isDateTime(meetup.date)
        ? meetup.date
        : DateTime.fromJSDate(new Date(meetup.date)).toFormat('dd/MM/yyyy HH:mm'),
    }))

    const apiKey = process.env.OPENCAGE_API_KEY

    if (!apiKey) {
      session.flash('error', 'API key is missing')
      return response.redirect().back()
    }

    // Geocode addresses to get coordinates
    const addresses = meetups.map((meetup) => `${meetup.adress}, ${meetup.city}`)
    try {
      // Process all geocoding requests in parallel
      const coordinates = await Promise.allSettled(
        addresses.map(async (address, index) => {
          const addressData = await opencage.geocode({
            q: address,
            key: apiKey,
          })
          // Return meetup with coordinates if geocoding successful
          if (addressData && addressData.status.code === 200 && addressData.results.length > 0) {
            const adress = addressData.results[0]
            return {
              ...meetups[index],
              latitude: adress.geometry.lat,
              longitude: adress.geometry.lng,
              title: meetups[index].title,
              date: meetups[index].date,
              description: meetups[index].description,
              adress: meetups[index].adress,
              city: meetups[index].city,
            }
          }
          return null
        })
      )

      // Filter out failed geocoding attempts
      const validMeetups = coordinates
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => {
          const meetup = (result as PromiseFulfilledResult<any>).value
          return meetup
        })

      return view.render('pages/meetup/meetups', {
        meetups: formattedMeetups,
        center: { latitude: 43.604, longitude: 1.44305 },
        zoom: 9,
        Meetups: validMeetups,
      })
    } catch (error) {
      session.flash('error', 'Error fetching coordinates')
      return response.redirect().back()
    }
  }

  /**
   * ------------------------------
   * Display My Meetups
   * ------------------------------
   */
  async displayUpcommingMeetups({ view, auth, response, session }: HttpContext) {
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

    const upcomingMeetups = await Meetup.query().whereHas('meetupUsers', (query) => {
      query.where('user_id', user.id).where('date', '>', new Date())
    })

    // pour avoir une date a bien formatté
    const formattedMeetups = meetups.map((meetup) => ({
      ...meetup.serialize(),
      formattedDate: DateTime.isDateTime(meetup.date)
        ? meetup.date
        : DateTime.fromJSDate(new Date(meetup.date)).toFormat('dd/MM/yyyy HH:mm'),
    }))

    const apiKey = process.env.OPENCAGE_API_KEY

    if (!apiKey) {
      session.flash('error', 'API key is missing')
      return response.redirect().back()
    }

    const upcommingAddresses = upcomingMeetups.map(
      (upcomingMeetup) => `${upcomingMeetup.adress}, ${upcomingMeetup.city}`
    )

    try {
      const upcomingCoordinates = await Promise.allSettled(
        upcommingAddresses.map(async (address, index) => {
          const upcommingAddressesData = await opencage.geocode({
            q: address,
            key: apiKey,
          })
          if (
            upcommingAddressesData &&
            upcommingAddressesData.status.code === 200 &&
            upcommingAddressesData.results.length > 0
          ) {
            const upcomingAdress = upcommingAddressesData.results[0]
            return {
              ...upcomingMeetups[index],
              latitude: upcomingAdress.geometry.lat,
              longitude: upcomingAdress.geometry.lng,
              title: upcomingMeetups[index].title,
              date: upcomingMeetups[index].date,
              description: upcomingMeetups[index].description,
              adress: upcomingMeetups[index].adress,
              city: upcomingMeetups[index].city,
            }
          }
          return null
        })
      )
      const validUpcommingMeetups = upcomingCoordinates
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => {
          const upcommingMeetup = (result as PromiseFulfilledResult<any>).value
          return upcommingMeetup
        })

      return view.render('pages/meetup/my_meetups', {
        meetups: formattedMeetups,
        center: { latitude: 43.604, longitude: 1.44305 },
        zoom: 9,
        upcomingMeetups: validUpcommingMeetups,
      })
    } catch (error) {
      session.flash('error', 'Error fetching coordinates')
      return response.redirect().back()
    }
  }

  /**
   * ------------------------------
   * Join a Meetup
   * ------------------------------
   */
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
  /**
   * ------------------------------
   * Display Leave Meetup Page
   * ------------------------------
   */
  async leaveMeetupView({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const meetup = await Meetup.find(params.id)

    if (!meetup) {
      return response.status(404).json({ message: 'Meetup not found' })
    }

    return view.render('pages/meetup/leave_meetup', { meetup })
  }

  /**
   * ------------------------------
   * Leave a Meetup
   * ------------------------------
   */
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

      // detach only the user's pets from the meetup
      if (userPetsIds.length > 0) {
        await meetup.related('meetupPets').detach(userPetsIds)
      }

      //detach user from meetup
      await meetup.related('meetupUsers').detach([user.id])

      session.flash('success', 'You have successfully leave the meetup')
      return response.redirect().toRoute('myMeetups')
    } catch (error) {
      session.flash('error', 'Error leaving meetup')
      return response.redirect().toRoute('myMeetups')
    }
  }

  /**
   * ------------------------------
   * Remove Pet from Meetup
   * ------------------------------
   */
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

  /**
   * ------------------------------
   * Display the Delete Meetup Page
   * ------------------------------
   */
  async deleteMeetupView({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const meetup = await Meetup.find(params.id)

    if (!meetup) {
      return response.status(404).json({ message: 'Meetup not found' })
    }

    if (meetup.userId !== user.id) {
      return response.status(403).json({ message: 'You are not authorized to update this meetup' })
    }

    return view.render('pages/meetup/delete_meetup', { meetup })
  }

  /**
   * ------------------------------
   * Delete Meetup
   * ------------------------------
   */
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

  /**
   * ------------------------------
   * Display the Update Meetup Page
   * ------------------------------
   */
  async updateMeetupView({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const meetup = await Meetup.find(params.id)

    if (!meetup) {
      return response.status(404).json({ message: 'Meetup not found' })
    }
    const meetupDate = DateTime.isDateTime(meetup.date)
      ? meetup.date
      : DateTime.fromJSDate(meetup.date)

    const formattedDate = meetupDate.toFormat('dd/MM/yyyy HH:mm')
    return view.render('pages/meetup/update_meetup', { meetup, formattedDate })
  }

  /**
   * ------------------------------
   * Update Meetup
   * ------------------------------
   */
  async updateMeetup({ auth, params, response, session, request }: HttpContext) {
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

      if (meetup.userId !== user.id) {
        session.flash('error', 'You are not the organizer of this meetup')
        return response.redirect().toRoute('myMeetups')
      }

      if (meetup.date < DateTime.now()) {
        session.flash('error', 'You cannot edit a past meetup')
        return response.redirect().toRoute('myMeetups')
      }

      const validatedData = await request.validateUsing(meetupValidator)
      await meetup.merge(validatedData).save()

      session.flash('success', 'Meetup updated successfully!')
      return response.redirect().toRoute('myMeetups')
    } catch (error) {
      session.flash('error', 'Error updating meetup')
      return response.redirect().toRoute('myMeetups')
    }
  }

  /**
   * ------------------------------
   * Display Meetup History
   * ------------------------------
   */
  async displayMeetupHistory({ view, response, session, auth }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const meetups = await Meetup.query()
      .whereHas('meetupUsers', (query) => {
        query.where('user_id', user.id).where('date', '<', new Date())
      })
      .preload('meetupPets', (query) => {
        query.preload('breed')
        query.preload('species')
      })
      .orderBy('date', 'asc')

    const pastMeetups = await Meetup.query().whereHas('meetupUsers', (query) => {
      query.where('user_id', user.id).where('date', '<', new Date())
    })

    // pour avoir une date a bien formatté
    const formattedMeetups = meetups.map((meetup) => ({
      ...meetup.serialize(),
      formattedDate: DateTime.isDateTime(meetup.date)
        ? meetup.date
        : DateTime.fromJSDate(new Date(meetup.date)).toFormat('dd/MM/yyyy HH:mm'),
    }))

    const apiKey = process.env.OPENCAGE_API_KEY

    if (!apiKey) {
      session.flash('error', 'API key is missing')
      return response.redirect().back()
    }

    const pastAddresses = pastMeetups.map(
      (pastMeetup) => `${pastMeetup.adress}, ${pastMeetup.city}`
    )

    try {
      const pastCoordinates = await Promise.allSettled(
        pastAddresses.map(async (address, index) => {
          const pastAddressesData = await opencage.geocode({
            q: address,
            key: apiKey,
          })
          if (
            pastAddressesData &&
            pastAddressesData.status.code === 200 &&
            pastAddressesData.results.length > 0
          ) {
            const pastAddress = pastAddressesData.results[0]
            return {
              ...pastMeetups[index],
              latitude: pastAddress.geometry.lat,
              longitude: pastAddress.geometry.lng,
              title: pastMeetups[index].title,
              date: pastMeetups[index].date,
              description: pastMeetups[index].description,
              adress: pastMeetups[index].adress,
              city: pastMeetups[index].city,
            }
          }
          return null
        })
      )

      const validPastMeetups = pastCoordinates
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => {
          const pastMeetup = (result as PromiseFulfilledResult<any>).value
          return pastMeetup
        })
      return view.render('pages/meetup/meetup_history', {
        meetups: formattedMeetups,
        center: { latitude: 43.604, longitude: 1.44305 },
        zoom: 9,
        pastMeetups: validPastMeetups,
      })
    } catch (error) {
      session.flash('error', 'Error fetching coordinates')
      return response.redirect().back()
    }
  }
}
