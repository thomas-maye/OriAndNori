import type { HttpContext } from '@adonisjs/core/http'
import { registerUserValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {

    register({view}: HttpContext) {
        return view.render('pages/auth/register')
    }

    async handleRegister({request, session, response}: HttpContext) {
        const {email, password, username} = await request.validateUsing(registerUserValidator)
        await User.create({email, password, username})
        session.flash("success", "You have successfully registered")
        return response.redirect().toRoute('auth.login')
    }

    login({view}: HttpContext) {
        return view.render('pages/auth/login')
    } 
} 