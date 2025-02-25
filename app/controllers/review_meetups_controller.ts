import type { HttpContext } from '@adonisjs/core/http'
import ReviewMeetup from '#models/review_meetup'
import { reviewMeetupValidator } from '#validators/review_meetup'

export default class ReviewMeetupsController {
  async createReviewMeetup({ auth, request, response }: HttpContext) {
    //add session
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const validatedData = await request.validateUsing(reviewMeetupValidator)
      const meetupId: number = request.input('meetupId')

      const reviewMeetup = await ReviewMeetup.create({
        ...validatedData,
        userId: user.id,
        meetupId: meetupId,
      })

      // session.flash('success', 'Review created successfully')
      // return response.redirect().toRoute('displayMeetup', { id: meetupId })
      return response.created(reviewMeetup)
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create review',
        error: error.messages || error.message,
      })
    }
  }
}
