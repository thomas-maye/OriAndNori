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

      const species = await Species.findByOrFail('name', validatedData.species)
      const breed = await Breed.findByOrFail('name', validatedData.breed)

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

  async DisplayPetProfile({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const pet = await Pet.find(params.id)
    if (!pet) {
      return response.status(404).json({ message: 'Pet not found' })
    }
    return view.render('pages/display_pet_profile', { pet })
  }

  async DisplayPetList({ auth, view, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const pets = await Pet.all()
    if (!pets) {
      return response.status(404).json({ message: 'No pets found' })
    }
    return view.render('pages/display_pet_list', { pets })
  }

  async ListMyPet({ auth, view, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const pets = await Pet.query().where('userId', user.id)

    if (!pets) {
      return response.status(404).json({ message: 'No pets found' })
    }
    return view.render('pages/display_my_pet', { pets })
  }
}
