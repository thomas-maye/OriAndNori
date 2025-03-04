import { HttpContext } from '@adonisjs/core/http'
import opencage from 'opencage-api-client'

export default class GeosController {
  async geo({ request, session, response }: HttpContext) {
    const address = request.input('address')

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

      if (!addressData || addressData.status.code !== 200) {
        session.flash('error', 'Address not found')
        return response.redirect().back()
      }
      const place = addressData.results[0]
      return response.json({
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
}
