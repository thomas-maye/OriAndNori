import type { HttpContext } from '@adonisjs/core/http'
import ReviewPet from '#models/review_pet'
import { reviewPetValidator } from '#validators/review_pet'
import Pet from '#models/pet'
import Meetup from '#models/meetup'
//import ReviewMeetup from '#models/review_meetup'

export default class ReviewPetsController {
  /**
   * ------------------------------
   * Create Review Pet
   * ------------------------------
   */
  async createReviewPet({ auth, request, response, session }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
      /*console.log(request.body())
      console.log(
        `description: ${request.input('description')}, type: ${typeof request.input('description')}`
      ) */

      const validatedData = await request.validateUsing(reviewPetValidator)
      const petId: number = request.input('petId')
      //const meetupId: number = request.input('meetupId')

      await ReviewPet.create({
        ...validatedData,
        userId: user.id,
        petId: petId,
      })
      //console.log(validatedData)
      //update global rating
      const pet = await Pet.findOrFail(petId)
      await pet.load('reviewPet')
      await pet.updateGlobalRating()

      session.flash('success', 'Review created successfully')
      return response.redirect().back()
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create review',
        error: error.messages || error.message,
        //session.flash('error', 'Review not found')
        // return response.redirect().toRoute('displayMeetup', { id: meetupId })
      })
    }
  }
  /**
   * ------------------------------
   * Delete Review Pet
   * ------------------------------
   */
  async deleteReviewPet({ auth, params, response, session }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const reviewPet = await ReviewPet.find(params.id)

      if (!reviewPet) {
        return response.notFound({ message: 'Review not found' })
      }

      if (reviewPet.userId !== user.id) {
        return response.unauthorized({ message: 'Unauthorized to delete review' })
      }

      const petId = reviewPet.petId
      await reviewPet.delete()

      //update global rating
      const pet = await Pet.findOrFail(petId)
      await pet.load('reviewPet')
      await pet.updateGlobalRating()

      session.flash('success', 'Review deleted successfully')
      return response.redirect().toRoute('petProfile', { id: petId })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to delete review',
        error: error.messages || error.message,
      })
    }
  }

  /**
   * ------------------------------
   * Edit Review Pet
   * ------------------------------
   */
  async editReviewPet({ auth, params, request, response, session }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const reviewPet = await ReviewPet.find(params.id)

      if (!reviewPet) {
        //session.flash('error', 'Review not found')
        // return response.redirect().toRoute('displayMeetup', { id: meetupId })
        return response.notFound({ message: 'Review not found' })
      }

      const petId = reviewPet.petId

      if (reviewPet.userId !== user.id) {
        session.flash('error', 'You are not authorized to update this review')
        return response.redirect().toRoute('displayMeetup', { id: petId })
      }

      const validatedData = await request.validateUsing(reviewPetValidator)

      reviewPet.merge(validatedData)
      await reviewPet.save()

      //update global rating
      const pet = await Pet.findOrFail(petId)
      await pet.load('reviewPet')
      await pet.updateGlobalRating()

      session.flash('success', 'Review updated successfully')
      return response.redirect().toRoute('displayMeetup', { id: petId })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update review',
        error: error.messages || error.message,
      })
      // session.flash('error', 'Failed to update review')
      // return response.redirect().toRoute('displayMeetup', { id: meetupId })
    }
  }

  async showReviewForm({ view, response, auth, params }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const meetupId = params.id
      if (!meetupId) {
        return response.status(400).json({
          message: 'Meetup not found',
        })
      }
      //console.log(meetupId)

      const meetup = await Meetup.query()
        .where('id', meetupId)
        .preload('reviewMeetup')
        .firstOrFail()

      const meetupPets = await meetup.related('meetupPets').query().preload('reviewPet')
      //console.log(meetup)
      return view.render('pages/reviews/reviewForm', { meetup, meetupPets, meetupId })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to show review form',
        error: error.messages || error.message,
      })
    }
  }

  async editReviewForm({ view, response, auth, params }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const meetupId = params.id

      if (!meetupId) {
        return response.status(400).json({
          message: 'Meetup not found',
        })
      }

      const meetup = await Meetup.findOrFail(meetupId)

      const reviewMeetup = await meetup
        .related('reviewMeetup')
        .query()
        .where('userId', user.id)
        .firstOrFail()

      //console.log(reviewMeetup)

      const reviewPets = await meetup
        .related('meetupPets')
        .query()
        .preload('reviewPet', (query) => {
          query.where('userId', user.id)
        })

      console.log('ici', reviewPets)
      return view.render('pages/reviews/edit_review_form', {
        reviewMeetup,
        reviewPets,
        meetupId,
        meetup,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to show edit review form',
        error: error.messages || error.message,
      })
    }
  }
}
