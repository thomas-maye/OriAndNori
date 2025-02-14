import type { HttpContext } from '@adonisjs/core/http'
import { loginUserValidator, registerUserValidator, updateUserValidator } from '#validators/auth'
import User from '#models/user'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class AuthController {

  /**
   * -------------------------------
   * Display the Register User Page
   * -------------------------------
   */
  register({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  /**
   * ------------------------------
   * Handle the Register User Page
   * ------------------------------
   */
  async handleRegister({ request, session, response }: HttpContext) {
    const { email,
      password,
      username,
      first_name = '',
      last_name = '',
      address_1 = '',
      address_2 = '',
      postal_code = '',
      city = '',
      phone = '',
      description = '',
      profile_picture = ''
    } = await request.validateUsing(registerUserValidator)

    await User.create({
      email,
      password,
      username,
      first_name,
      last_name,
      address_1,
      address_2,
      postal_code,
      city,
      phone,
      description,
      profile_picture
    })
    session.flash('success', 'You have successfully registered')
    return response.redirect().toRoute('auth.login')
  }

  /**
   * ---------------------------
   * Display the Login Page
   * ---------------------------
   */
  login({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * ---------------------------
   * Handle the Login User Page
   * ---------------------------
   */

  async handleLogin({ request, auth, session, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginUserValidator)
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    session.flash('success', 'You have successfully logged in')
    return response.redirect().toRoute('home')
  }

  async logout({ auth, session, response }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'You have successfully logged out')
    return response.redirect().toRoute('home')
  }

/**
 * ---------------------------
 * Display the user's profile
 * ---------------------------

 */
  async displayMyProfile({ view, auth, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return view.render('pages/auth/login')
    }
    return view.render('pages/auth/myprofile')
  }

  /**
   * ------------------------
   * Edit the user's profile
   * ------------------------
   */
  async editMyProfile({ view, auth, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return view.render('pages/auth/login')
    }
    return view.render('pages/auth/edit_myprofile')
  }

  /**
   * --------------------------
   * Update the user's profile
   * --------------------------
   */
  async updateMyProfile({ request, auth, session, response }: HttpContext) {
    if (!auth.user) {
      session.flash('error', 'You must be logged in to view this page')
      return response.redirect().toRoute('auth.login')
    }

    const updateUser = await request.validateUsing(updateUserValidator)
    let fileName = '';

    if (updateUser.profile_picture) {
      if (auth.user.profile_picture) {
        try {
          await drive.use().delete(`uploads/${auth.user.profile_picture}`)
        } catch (error) {
          session.flash('error', 'Error deleting old photo')
          return response.redirect().back()
        }
      }

      await updateUser.profile_picture.move(app.makePath('storage/uploads'), {
        name: `${cuid()}.${updateUser.profile_picture.extname}`
      })

      if (!updateUser.profile_picture.fileName) {
        session.flash('error', 'Error uploading profile picture')
        return response.redirect().back()
      }

      fileName = updateUser.profile_picture.fileName
    }

    auth.user.merge({
      ...updateUser,
      profile_picture: fileName || auth.user.profile_picture
    })

    await auth.user.save()
    session.flash('success', 'Profile updated successfully')

    return response.redirect().toRoute('auth.display_my_profile')
  }
}
