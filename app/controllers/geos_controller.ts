import { HttpContext } from '@adonisjs/core/http'
import opencage from 'opencage-api-client'
import Meetup from '#models/meetup'

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
    return view.render('pages/essaie_geo')
  }

  async displayUpcommingMeetups({ view, response, session }: HttpContext) {
    const meetups = await Meetup.query().where('date', '>', new Date()).orderBy('date', 'asc')

    const apiKey = process.env.OPENCAGE_API_KEY

    if (!apiKey) {
      session.flash('error', 'API key is missing')
      return response.redirect().back()
    }

    try {
      const coordinates = await Promise.all(
        meetups.map(async (meetup) => {
          const addressData = await opencage.geocode({
            q: `${meetup.adress}, ${meetup.city}`,
            key: apiKey,
          })
          if (addressData && addressData.code === 200) {
            const adress = addressData.results[0]
            return {
              ...meetup,
              latitude: adress.geometry.lat,
              longitude: adress.geometry.lng,
            }
          }
          return null
        })
      )
      const validMeetups = coordinates.filter((coord) => coord !== null)

      return view.render('pages/upcomin_meetups_map', {
        meetups: validMeetups,
      })
    } catch (error) {
      session.flash('error', 'Something went wrong')
      return response.paymentRequired({ error: 'quota epuisee' })
    }
  }
}
