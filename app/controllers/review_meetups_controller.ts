import type { HttpContext } from '@adonisjs/core/http'
import ReviewMeetup from '#models/review_meetup'
import { reviewMeetupValidator } from '#validators/review_meetup'
import Meetup from '#models/meetup'

export default class ReviewMeetupsController {
  /**
   * ------------------------------
   * Create Review Meetup
   * ------------------------------
   */
  async createReviewMeetup({ auth, request, response, session }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const validatedData = await request.validateUsing(reviewMeetupValidator)
      const meetupId: number = request.input('meetupId')

      await ReviewMeetup.create({
        ...validatedData,
        userId: user.id,
        meetupId: meetupId,
      })

      //update global rating
      const meetup = await Meetup.findOrFail(meetupId)
      await meetup.load('reviewMeetup')
      await meetup.updateGlobalRating()

      session.flash('success', 'Review created successfully')
      return response.redirect().back()
    } catch (error) {
      const meetupId = request.input('meetupId')
      session.flash('error', 'Review not found')
      return response.redirect().toRoute('displayMeetup', { id: meetupId })
    }
  }


  /**
   * ------------------------------
   * Delete Review Meetup
   * ------------------------------
   */
  async deleteReviewMeetup({ auth, params, response, session }: HttpContext) {
  try {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const reviewMeetup = await ReviewMeetup.find(params.id)
    if (!reviewMeetup) {
      session.flash('error', 'Review not found')
      return response.redirect().toRoute('displayMeetup', { id: params.id })
    }

    const meetupId = reviewMeetup.meetupId

    if (reviewMeetup.userId !== user.id) {
      session.flash('error', 'You are not authorized to update this review')
      return response.redirect().toRoute('displayMeetup', { id: meetupId })
    }
    await reviewMeetup.delete()

    //update global rating
    const meetup = await Meetup.findOrFail(meetupId)
    await meetup.load('reviewMeetup')
    await meetup.updateGlobalRating()

    session.flash('success', 'Review deleted successfully')
    return response.redirect().toRoute('myMeetups')
  } catch (error) {
    session.flash('error', 'Failed to delete review')
    return response.redirect().toRoute('displayMeetup', { id: params.id })
  }
}


  /**
   * ------------------------------
   * Edit Review Meetup
   * ------------------------------
   */
  async editReviewMeetup({ auth, params, request, response, session }: HttpContext) {
  try {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const reviewMeetup = await ReviewMeetup.find(params.id)

    if (!reviewMeetup) {
      session.flash('error', 'Review not found')
      return response.redirect().toRoute('displayMeetup', { id: params.id })
    }

    const meetupId = reviewMeetup.meetupId

    if (reviewMeetup.userId !== user.id) {
      session.flash('error', 'You are not authorized to update this review')
      return response.redirect().toRoute('displayMeetup', { id: meetupId })
    }

    const validatedData = await request.validateUsing(reviewMeetupValidator)

    reviewMeetup.merge(validatedData)
    await reviewMeetup.save()

    //update global rating
    const meetup = await Meetup.findOrFail(meetupId)
    await meetup.load('reviewMeetup')
    await meetup.updateGlobalRating()

    session.flash('success', 'Review updated successfully')
    return response.redirect().toRoute('displayMeetup', { id: meetupId })
  } catch (error) {
    session.flash('error', 'Failed to update review')
    return response.redirect().toRoute('displayMeetup', { id: params.id })
  }
}
}
