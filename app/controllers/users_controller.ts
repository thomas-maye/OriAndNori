import type { HttpContext } from '@adonisjs/core/http'
import Pet from '#models/pet'
import Species from '#models/species'
import Breed from '#models/breed'
import { createPetValidator } from '#validators/create_pet'

export default class UsersController {
  async createPet({ auth, request, response }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(createPetValidator)
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
      const species = await Species.findByOrFail('name', Species)
      const breed = await Breed.findByOrFail('name', Breed)

      const pet = await Pet.create({
        ...validatedData,
        userId: user.id,
        speciesId: species.id,
        speciesName: species.name,
        breedId: breed.id,
        breedName: breed.name,
      })

      return response.status(201).json({
        message: 'Pet created successfully!',
        data: pet,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create pet',
        error: error.messages,
      })
    }
  }
}
