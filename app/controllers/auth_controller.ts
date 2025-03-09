import type { HttpContext } from '@adonisjs/core/http'
import { loginUserValidator, registerUserValidator, updateUserValidator } from '#validators/auth'
import User from '#models/user'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import mail from '@adonisjs/mail/services/main'
import { dd } from '@adonisjs/core/services/dumper'


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
    const {
      email,
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
      profile_picture = '',
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
      profile_picture,
    })

    const user = await User.findBy('email', email)

    if (user) {
      await mail.send((message) => {
        message
          .to(user.email)
          .from('no-reply@oriandnori.org')
          .subject('Registration Successful')
          .htmlView('emails/register', { user })
      })

      session.flash('success', 'You have successfully registered')
      return response.redirect().toRoute('auth.login')
    } else {
      session.flash('error', 'User registration failed')
      return response.redirect().back()
    }
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
    session.flash('warning', 'You are logged out')
    return response.redirect().toRoute('home')
  }

  /**
   * ---------------------------
   * Display my user's profile
   * ---------------------------
   */
  async displayMyProfile({ view, auth, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return view.render('pages/auth/login')
    }

    await user.load('pet')

    return view.render('pages/auth/myprofile')
  }

  /**
   * ------------------------
   * Edit my user's profile
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
   * Update my user's profile
   * --------------------------
   */
  async updateMyProfile({ request, auth, session, response }: HttpContext) {
    if (!auth.user) {
      session.flash('error', 'You must be logged in to view this page')
      return response.redirect().toRoute('auth.login')
    }

    const updateUser = await request.validateUsing(updateUserValidator)
    let fileName = ''

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
        name: `${cuid()}.${updateUser.profile_picture.extname}`,
      })

      if (!updateUser.profile_picture.fileName) {
        session.flash('error', 'Error uploading profile picture')
        return response.redirect().back()
      }

      fileName = updateUser.profile_picture.fileName
    }

    auth.user.merge({
      ...updateUser,
      profile_picture: fileName || auth.user.profile_picture,
    })

    await auth.user.save()

    const user = await User.find(auth.user.id)

    if (user) {
      try {
        await mail.send((message) => {
          message
            .to(user.email)
            .from('no-reply@oriandnori.org')
            .subject('Edit Profile Successful')
            .htmlView('emails/edit_myprofile', { user })
        })
        session.flash('success', 'Profile updated successfully')
      } catch (error) {
        session.flash('error', 'Error sending confirmation email')
        return response.redirect().back()
      }
    } else {
      session.flash('error', 'User update failed')
      return response.redirect().back()
    }

    return response.redirect().toRoute('auth.display_my_profile')
  }

  /**
   * --------------------------
   * Display the Delete Profile
   * --------------------------
   */
  async displayDeleteProfile({ view, auth, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return view.render('pages/auth/login')
    }
    return view.render('pages/auth/delete_profile')
  }

  /**
   * ---------------------------
   * Delete the user's profile
   * ---------------------------
   */
  async deleteMyProfile({ auth, session, response }: HttpContext) {
    if (!auth.user) {
      session.flash('error', 'You must be logged in to view this page')
      return response.redirect().toRoute('auth.login')
    }

    if (auth.user.profile_picture) {
      try {
        await drive.use().delete(`uploads/${auth.user.profile_picture}`)
      } catch (error) {
        session.flash('error', 'Error deleting profile picture')
        return response.redirect().back()
      }
    }

    const user = await User.find(auth.user.id)

    if (user) {
      try {
        await mail.send((message) => {
          message
            .to(user.email)
            .from('no-reply@oriandnori.org')
            .subject('Delete Profile Successful')
            .htmlView('emails/delete_myprofile', { user })
        })
        session.flash('success', 'Profile deleted successfully')
      } catch (error) {
        session.flash('error', 'Error sending confirmation email')
        return response.redirect().back()
      }
    } else {
      session.flash('error', 'User update failed')
      return response.redirect().back()
    }

    await auth.user.delete()
    return response.redirect().toRoute('home')
  }

  /**
   * ---------------------------
   * Display All Users Profile
   * ---------------------------
   */
  async displayAllUsers({ view, auth, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return view.render('pages/auth/login')
    }
    const users = await User.query().whereNot('id', user.id).preload('pet')
    return view.render('pages/auth/display_all_users', { users })
  }

  /**
   * ---------------------------
   * Display User Profile by ID
   * ---------------------------
   */
  async displayUserProfile({ view, auth, params, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return view.render('pages/auth/login')
    }

    const userProfile = await User.findOrFail(params.id)

    await userProfile.load('pet')
    await userProfile.load('meetup')
    await userProfile.load('userMeetups')

    return view.render('pages/auth/display_user_profile', { user, userProfile })
  }

  /**
   * ---------------------------
   * Purpose a Meetup to an User
   * ---------------------------
   */
  async purposeMeetupUser({ session, response, auth, params }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return response.redirect().toRoute('auth.login')
    }

    const userToMeet = await User.findOrFail(params.id)

    if (!userToMeet) {
      session.flash('error', 'User not found')
      return response.redirect().back()
    }

    const profileUrl = `http://localhost:3333/users/${user.id}`

    await mail.send((message) => {
      message
        .to(userToMeet.email)
        .from('no-reply@oriandnori.org')
        .subject('Proposition of Meetup')
        .htmlView('emails/purpose_meetup_to_user', { userToMeet, user, profileUrl })
    })

    session.flash('success', 'An email has been sent to the user')
    return response.redirect().back()
  }
}