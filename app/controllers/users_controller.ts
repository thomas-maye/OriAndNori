import type { HttpContext } from '@adonisjs/core/http'
import Pet, { traits } from '#models/pet'
import Species from '#models/species'
import Breed from '#models/breed'
import { createPetValidator } from '#validators/create_pet'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class UsersController {
  /**
   * ------------------------------
   * Display the Create Pet Page
   * ------------------------------
   */
  async showCreatePetForm({ view }: HttpContext) {
    const species = await Species.all()
    const breeds = await Breed.all()
    return view.render('pages/pet/create_pet', { species, breeds, traits })
  }

  /**
   * ------------------------------
   * Create a Pet
   * ------------------------------
   */
  async createPet({ auth, request, response, session }: HttpContext) {
    try {
      const validatedData = await request.validateUsing(createPetValidator)

      const user = auth.user
      let fileName = ''

      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }

      const species = await Species.findByOrFail('name', validatedData.species)
      const breed = await Breed.findByOrFail('name', validatedData.breed)

      if (validatedData.photo) {
        await validatedData.photo.move(app.makePath('storage/uploads'), {
          name: `${cuid()}.${validatedData.photo.extname}`,
        })

        if (!validatedData.photo.fileName) {
          session.flash('error', 'Error uploading profile picture')
          return response.redirect().back()
        }

        fileName = validatedData.photo.fileName
      }

      const pet = new Pet()
      pet.merge({
        ...validatedData,
        userId: user.id,
        speciesId: species.id,
        breedId: breed.id,
        photo: fileName,
      })

      await pet.save()

      session.flash('success', 'Pet created successfully!')
      return response.redirect().toRoute('MyPets')
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to create pet',
        error: error.messages,
      })
    }
  }

  /**
   * ------------------------------
   * Display the Pet Profile
   * ------------------------------
   */
  async displayPetProfile({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    //console.log(params.id)
    const pet = await Pet.query().where('id', params.id).preload('species').preload('breed').first()

    if (!pet) {
      return response.status(404).json({ message: 'Pet not found' })
    }

    const photoUrl = pet.photo
    return view.render('pages/pet/display_pet_profile', { pet, photoUrl })
  }

  /**
   * ------------------------------
   * Display the Pet List
   * ------------------------------
   */
  async displayPetList({ auth, view, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    const pets = await Pet.query()
      .whereNot('userId', user.id)
      .preload('user')
      .preload('species')
      .preload('breed')

    if (!pets) {
      return response.status(404).json({ message: 'No pets found' })
    }
    return view.render('pages/pet/display_pet_list', { pets })
  }

  /**
   * ------------------------------
   * Display My Pet
   * ------------------------------
   */
  async listMyPet({ auth, view, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const pets = await Pet.query()
      .where('userId', user.id)
      .preload('user')
      .preload('species')
      .preload('breed')

    if (!pets) {
      return response.status(404).json({ message: 'No pets found' })
    }
    console.log(pets)
    return view.render('pages/pet/display_my_pet', { pets })
  }

  /**
   * ------------------------------
   * Display the Update Pet Page
   * ------------------------------
   */
  async updatePetView({ auth, view, params, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const pet = await Pet.query().where('id', params.id).preload('species').preload('breed').first()

    if (!pet) {
      return response.status(404).json({ message: 'Pet not found' })
    }

    const photo = pet.photo
    return view.render('pages/pet/update_pet', { pet, photo })
  }

  /**
   * ------------------------------
   * Update Pet
   * ------------------------------
   */
  async updatePet({ auth, request, response, params, session }: HttpContext) {
    if (!auth.user) {
      session.flash('error', 'You must be logged in to view this page')
      return response.redirect().toRoute('auth.login')
    }

    const pet = await Pet.find(params.id)
    if (!pet) {
      session.flash('error', 'Pet not found')
      return response.redirect().toRoute('MyPets')
    }

    if (pet.userId !== auth.user.id) {
      session.flash('error', 'You are not authorized to update this pet')
      return response.redirect().toRoute('MyPets')
    }

    const updatePetData = await request.validateUsing(createPetValidator)
    let fileName = ''

    if (updatePetData.photo) {
      if (pet.photo) {
        try {
          await drive.use().delete(`uploads/${pet.photo}`)
        } catch (error) {
          session.flash('error', 'Error deleting old photo')
          return response.redirect().back()
        }
      }

      await updatePetData.photo.move(app.makePath('storage/uploads'), {
        name: `${cuid()}.${updatePetData.photo.extname}`,
      })

      if (!updatePetData.photo.fileName) {
        session.flash('error', 'Error uploading profile picture')
        return response.redirect().back()
      }

      fileName = updatePetData.photo.fileName
    }

    const species = await Species.findByOrFail('name', updatePetData.species)
    const breed = await Breed.findByOrFail('name', updatePetData.breed)

    pet.merge({
      ...updatePetData,
      userId: auth.user.id,
      speciesId: species.id,
      breedId: breed.id,
      photo: fileName || pet.photo,
    })

    await pet.save()
    session.flash('success', 'Pet updated successfully!')
    return response.redirect().toRoute('MyPets')
  }

  /**
   * ------------------------------
   * Display the Delete Pet Page
   * ------------------------------
   */
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

    return view.render('pages/pet/delete_pet', { pet })
  }

  /**
   * ------------------------------
   * Delete Pet
   * ------------------------------
   */
  async deletePet({ auth, response, params, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return response.redirect().toRoute('auth.login')
    }
    const pet = await Pet.find(params.id)
    if (!pet) {
      session.flash('error', 'Pet not found')
      return response.redirect().toRoute('MyPets')
    }

    if (pet.userId !== user.id) {
      session.flash('error', 'You are not authorized to update this pet')
      return response.redirect().toRoute('MyPets')
    }

    if (pet.photo) {
      try {
        await drive.use().delete(`uploads/${pet.photo}`)
      } catch (error) {
        session.flash('error', 'Error deleting profile picture')
        return response.redirect().back()
      }
    }

    await pet.delete()
    session.flash('success', 'Pet deleted successfully!')
    return response.redirect().toRoute('MyPets')
  }
}
