import type { HttpContext } from '@adonisjs/core/http'
import { forgotPasswordValidator } from '#validators/auth'
import { resetPasswordValidator } from '#validators/auth'
import User from '#models/user'
import stringHelpers from '@adonisjs/core/helpers/string'
import ResetPassword from '#models/reset_password'
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
        const url = `http://localhost:3333/reset_password?token=${token}&email=${email}`

        await ResetPassword.create({
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

        session.flash("success", "Password reset link sent to your email. Please check your inbox")
        return response.redirect().toRoute("auth.forgot_password")
    }

    async resetPassword({ request, session, response, view }: HttpContext) {
        const token = request.input("token")
        const email = request.input("email")

        const passwordResetToken = await ResetPassword.findBy("token", token)
        if (!passwordResetToken || !!passwordResetToken.isUsed === true || passwordResetToken.email !== email || passwordResetToken.expiresAt < DateTime.now()) {
            session.flash("error", "Link expired or invalid")
            return response.redirect().toRoute("auth.forgot_password")
        }
        return view.render('pages/auth/reset_password', { token, email })
    }

    async handleResetPassword({ request, session, response }: HttpContext) {
        const {token, email, password} = await request.validateUsing(resetPasswordValidator)
        const passwordResetToken = await ResetPassword.findBy("token", token)

        if (!passwordResetToken || !!passwordResetToken.isUsed === true || passwordResetToken.email !== email || passwordResetToken.expiresAt < DateTime.now()) {
            session.flash("error", "Link expired or invalid")
            return response.redirect().toRoute("auth.forgot_password")
        }

        const user = await User.findBy("email", email)
        if(!user) {
            session.flash("error", "User not found")
            return response.redirect().toRoute("auth.forgot_password")
        }
        await passwordResetToken.merge({ isUsed: true }).save()
        await user.merge({ password }).save()
        session.flash("success", "Password reset successfully")
        return response.redirect().toRoute("auth.login")
    }
}