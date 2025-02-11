import type { HttpContext } from '@adonisjs/core/http'
import Pet, { traits } from '#models/pet'
import Species from '#models/species'
import Breed from '#models/breed'
import { createPetValidator } from '#validators/create_pet'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'

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
      /*const personality = traits.map((trait) => ({
        ...trait,
        rating:
          (Array.isArray(validatedData.personality) &&
            validatedData.personality.find(
              (personalityTrait) => personalityTrait.trait === trait.trait
            )?.rating) ||
          0,
      }))*/

      const photo = request.file('photo', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      if (!photo) {
        return response.badRequest({ error: 'Image Missing' })
      }

      const key = `uploads/${cuid()}.${photo.extname}`
      await photo.moveToDisk(key)

      const photoUrl = await drive.use().getUrl(key)
      const pet = await Pet.create({
        ...validatedData,
        //personality: personality,
        userId: user.id,
        speciesId: species.id,
        speciesName: species.name,
        breedId: breed.id,
        breedName: breed.name,
        photo: photoUrl,
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

  async showCreatePetForm({ view }: HttpContext) {
    console.log(traits)
    return view.render('pages/create_pet', { traits })
  }

  async displayPetProfile({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    //console.log(params.id)
    const pet = await Pet.find(params.id)
    if (!pet) {
      return response.status(404).json({ message: 'Pet not found' })
    }
    const photoUrl = pet.photo
    console.log(pet)
    console.log(photoUrl)
    return view.render('pages/display_pet_profile', { pet, photoUrl })
  }

  async displayPetList({ auth, view, response }: HttpContext) {
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

  async listMyPet({ auth, view, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const pets = await Pet.query().where('userId', user.id)

    if (!pets) {
      return response.status(404).json({ message: 'No pets found' })
    }
    console.log(pets)
    return view.render('pages/display_my_pet', { pets })
  }

  async updatePetView({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const pet = await Pet.find(params.id)
    if (!pet) {
      return response.status(404).json({ message: 'Pet not found' })
    }

    const photo = pet.photo
    return view.render('pages/update_pet', { pet, photo })
  }

  async updatePet({ auth, request, response, params }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const pet = await Pet.find(params.id)
    if (!pet) {
      return response.status(404).json({ message: 'Pet not found' })
    }

    if (pet.userId !== user.id) {
      return response.status(403).json({ message: 'You are not authorized to update this pet' })
    }
    try {
      const validatedData = await request.validateUsing(createPetValidator)
      console.log(validatedData)
      const species = await Species.findByOrFail('name', validatedData.species)
      const breed = await Breed.findByOrFail('name', validatedData.breed)

      const photo = request.file('photo', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      if (!photo) {
        return response.badRequest({ error: 'Image Missing' })
      }

      if (pet.photo) {
        const oldPhoto = pet.photo.replace('/uploads/', '')
        try {
          await drive.use().delete(oldPhoto)
        } catch (error) {
          console.error('Error deleting old photo:', error)
        }
      }

      const key = `uploads/${cuid()}.${photo.extname}`
      await photo.moveToDisk(key)

      const photoUrl = await drive.use().getUrl(key)
      pet.merge({
        ...validatedData,
        userId: user.id,
        speciesId: species.id,
        speciesName: species.name,
        breedId: breed.id,
        breedName: breed.name,
        photo: photoUrl,
      })
      await pet.save()
      console.log(pet)

      return response.status(200).json({
        message: 'Pet updated successfully!',
        data: pet,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to update pet',
        error: error.messages,
      })
    }
  }

  async deletePetView({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const pet = await Pet.find(params.id)
    if (!pet) {
      return response.status(404).json({ message: 'Pet not found' })
    }

    if (pet.userId !== user.id) {
      return response.status(403).json({ message: 'You are not authorized to update this pet' })
    }

    return view.render('pages/delete_pet', { pet })
  }

  async deletePet({ auth, response, params }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const pet = await Pet.find(params.id)
    if (!pet) {
      return response.status(404).json({ message: 'Pet not found' })
    }

    if (pet.userId !== user.id) {
      return response.status(403).json({ message: 'You are not authorized to update this pet' })
    }

    if (pet.photo) {
      const photoKey = pet.photo.replace('/uploads/', '')
      try {
        await drive.use().delete(photoKey)
      } catch (error) {
        console.error('Error deleting photo:', error)
      }
    }

    await pet.delete()
    return response.status(200).json({ message: 'Pet deleted successfully!' })
  }
}
