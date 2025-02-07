import type { HttpContext } from '@adonisjs/core/http'

export default class ResetPasswordController {

    forgotPassword({ view }: HttpContext) {
        return view.render('pages/auth/forgot_password')
    }
}