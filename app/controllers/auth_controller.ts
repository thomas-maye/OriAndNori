import type { HttpContext } from '@adonisjs/core/http'
import { loginUserValidator, registerUserValidator, updateUserValidator } from '#validators/auth'
import User from '#models/user'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'


export default class AuthController {
  register({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async handleRegister({ request, session, response }: HttpContext) {
    const { email, 
      password,
      username,
      first_name='',
      last_name='',
      address_1='',
      address_2= '',
      postal_code='',
      city='',
      phone='',
      description='',
      profile_picture=''
      } = await request.validateUsing(registerUserValidator)

    await User.create({ email,
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
      profile_picture})
    session.flash('success', 'You have successfully registered')
    return response.redirect().toRoute('auth.login')
  }

  login({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

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

  async displayMyProfile({ view, auth, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return view.render('pages/auth/login')
    }
    return view.render('pages/auth/myprofile')
  }

  async editMyProfile({ view, auth, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return view.render('pages/auth/login')
    }
    return view.render('pages/auth/edit_myprofile')
  }

  async updateMyProfile({ request, auth, session, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      session.flash('error', 'You must be logged in to view this page')
      return response.redirect().toRoute('auth.login')
    }

    const updateUser = await request.validateUsing(updateUserValidator)

    user.first_name = updateUser.first_name ?? ''
    user.last_name = updateUser.last_name ?? ''
    user.address_1 = updateUser.address_1 ??  ''
    user.address_2 = updateUser.address_2 ?? ''
    user.postal_code = updateUser.postal_code ?? ''
    user.city = updateUser.city ?? ''
    user.phone = updateUser.phone ?? ''
    user.description = updateUser.description ?? ''
    user.profile_picture = updateUser.profile_picture ?? ''

    await user.save()
    session.flash('success', 'Profile updated successfully')

    return response.redirect().toRoute('auth.display_my_profile')
  }
}
