import type { HttpContext } from '@adonisjs/core/http'
import { forgotPasswordValidator } from '#validators/auth'
import User from '#models/user'
import stringHelpers from '@adonisjs/core/helpers/string'
import Reset_password from '#models/reset_password'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'

export default class ResetPasswordController {

    forgotPassword({ view }: HttpContext) {
        return view.render('pages/auth/forgot_password')
    }

    async handleForgotPassword({ request, session, response }: HttpContext) {
        const { email } = await request.validateUsing(forgotPasswordValidator)
        const user = await User.findBy('email', email)

        if (!user || user.password === null) {
            session.flash("error", "User not found or password not set")
            return response.redirect().toRoute("auth.forgot_password")
        }
        const token = stringHelpers.generateRandom(64)
        const url = `http://localhost:3333/reset-password?${token}&email=${email}`

        await Reset_password.create({
            token,
            email: user.email,
            expiresAt: DateTime.now().plus({ minutes: 20 })
        })

        await mail.send((message) => {
            message
              .to(user.email)
              .from('no-reply@oriandnori.org')
              .subject('Reset Password')
              .htmlView('emails/forgot_password', { user, url })
        })

        session.flash("success", "Password reset link sent to your email")
        return response.redirect().toRoute("auth.forgot_password")
    }
}