import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Pet from './pet.js'
import Meetup from './meetup.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @hasMany(() => Pet)
  declare pet: HasMany<typeof Pet>

  @column()
  declare first_name: string

  @column()
  declare last_name: string

  @column()
  declare longitude: number

  @column()
  declare latitude: number

  @column()
  declare address_1: string

  @column()
  declare address_2: string

  @column()
  declare postal_code: string

  @column()
  declare city: string

  @column()
  declare phone: string

  @column()
  declare description: string

  @hasMany(() => Meetup)
  declare meetup: HasMany<typeof Meetup>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Meetup, {
    //localKey: 'id',
    //pivotForeignKey: 'user_id',
    //relatedKey: 'id',
    pivotTable: 'user_meetups',
    pivotColumns: ['meetup_title'],
  })
  declare userMeetups: ManyToMany<typeof Meetup>
}
