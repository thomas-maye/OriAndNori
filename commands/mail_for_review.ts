import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import mail from '@adonisjs/mail/services/main'
import Meetup from '#models/meetup'
import UserMeetupEmail from '#models/user_meetup_email'
import { DateTime } from 'luxon'

export default class MailForReview extends BaseCommand {
  static commandName = 'mail:for-review'
  static description = 'Send an email to all users to review the meetup'

  static options: CommandOptions = {}

  async run() {
    const meetups = await Meetup.query().preload('meetupUsers')

    for (const meetup of meetups) {
      if (meetup.date < DateTime.now()) {
        for (const user of meetup.meetupUsers) {
          const url = `http://localhost:3333/reviewsForm/${meetup.id}`
          const emailSent = await UserMeetupEmail.query()
            .where('userId', user.id)
            .where('meetupId', meetup.id)
            .first()

          if (!emailSent) {
            try {
              await mail.send((message) => {
                message
                  .to(user.email)
                  .from('no-reply@oriandnori.org')
                  .subject('Review the meetup')
                  .htmlView('emails/review_reminder', { meetup, user, url })
              })

              await UserMeetupEmail.create({
                userId: user.id,
                meetupId: meetup.id,
              })

              await new Promise((resolve) => setTimeout(resolve, 1000))
            } catch (error) {
              console.error(`Error sending email to ${user.email}`, error)
            }
          }
        }
      }
    }
  }
}
