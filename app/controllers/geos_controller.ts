import { HttpContext } from '@adonisjs/core/http'
import opencage from 'opencage-api-client'
import Meetup from '#models/meetup'
//import { DateTime } from 'luxon'

export default class GeosController {
  // Handles geocoding of an address using the OpenCage API.
  async geo({ request, session, response, view }: HttpContext) {
    console.log('request', request.body())

    const address = request.input('address')
    console.log('address', address)

    if (!address) {
      session.flash('error', 'Adress is required')
      return response.redirect().back()
    }

    const apiKey = process.env.OPENCAGE_API_KEY

    if (!apiKey) {
      session.flash('error', 'API key is missing')
      return response.redirect().back()
    }

    try {
      const addressData = await opencage.geocode({ q: address, key: apiKey })
      console.log('addressData', addressData)

      if (!addressData || addressData.status.code !== 200) {
        // 200 = OK
        session.flash('error', 'Address not found')
        return response.redirect().back()
      }
      const place = addressData.results[0]
      console.log('place', place)

      return view.render('pages/essaie_geo', {
        latitude: place.geometry.lat,
        longitude: place.geometry.lng,
        address: place.formatted,
        timezone: place.annotations.timezone.name,
      })
    } catch (error) {
      session.flash('error', 'Something went wrong')
      return response.paymentRequired({ error: 'quota epuisee' })
    }
  }

  async showGeoForm({ view }: HttpContext) {
    return view.render('pages/essaie_geo', {
      center: { latitude: 43.604, longitude: 1.44305 },
      zoom: 13,
      markers: [],
    })
  }

  async displayUpcommingMeetups({ view, response, session }: HttpContext) {
    const meetups = await Meetup.query().where('date', '>', new Date()).orderBy('date', 'asc')
    console.log('meetups', meetups)

    const apiKey = process.env.OPENCAGE_API_KEY

    if (!apiKey) {
      session.flash('error', 'API key is missing')
      return response.redirect().back()
    }

    const addresses = meetups.map((meetup) => `${meetup.adress}, ${meetup.city}`)
    try {
      const coordinates = await Promise.allSettled(
        addresses.map(async (address, index) => {
          const addressData = await opencage.geocode({
            q: address,
            key: apiKey,
          })
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
      console.log('coordinates', coordinates)
      const validMeetups = coordinates
        .filter((result) => result.status === 'fulfilled' && result.value !== null)
        .map((result) => {
          const meetup = (result as PromiseFulfilledResult<any>).value
          return meetup
        })
      console.log('validMeetups', validMeetups)

      return view.render('pages/essaie_geo', {
        center: { latitude: 43.604, longitude: 1.44305 },
        zoom: 13,
        meetups: validMeetups,
      })
    } catch (error) {
      session.flash('error', 'Something went wrong')
      return response.paymentRequired({ error: 'quota epuisee' })
    }
  }
}
