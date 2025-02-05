import type { HttpContext } from '@adonisjs/core/http'
import { LoginUserValidator, registerUserValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {

    register({ view }: HttpContext) {
        return view.render('pages/auth/register')
    }

    async handleRegister({ request, session, response }: HttpContext) {
        const { email, password, username } = await request.validateUsing(registerUserValidator)
        await User.create({ email, password, username })
        session.flash("success", "You have successfully registered")
        return response.redirect().toRoute("auth.login")
    }

    login({ view }: HttpContext) {
        return view.render('pages/auth/login')
    }

    async handleLogin({ request, auth, session, response }: HttpContext) {
        const { email, password } = await request.validateUsing(LoginUserValidator)
        const user = await User.verifyCredentials(email, password)
        await auth.use('web').login(user)
        session.flash("success", "You have successfully logged in")
        console.log(auth.user)
        return response.redirect().toRoute("home")
    }

    async logout({ auth, session, response }: HttpContext) {
        await auth.use('web').logout();
        session.flash("success", "You have successfully logged out");
        return response.redirect().toRoute("home");
    }
}
