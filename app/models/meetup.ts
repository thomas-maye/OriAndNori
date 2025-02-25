import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Pet from './pet.js'
import ReviewMeetup from './review_meetup.js'

export default class Meetup extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare organizer: string

  @column()
  declare adress: string

  @column()
  declare additionalAddress: string

  @column()
  declare city: string

  @column()
  declare type: string

  @column()
  declare date: DateTime

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => User, {
    //localKey: 'id',
    //pivotForeignKey: 'meetup_id',
    //relatedKey: 'id',
    //pivotRelatedForeignKey: 'user_id',
    pivotTable: 'user_meetups',
    pivotColumns: ['user_name', 'sort_order'],
  })
  declare meetupUsers: ManyToMany<typeof User>

  @manyToMany(() => Pet, {
    //localKey: 'id',
    //pivotForeignKey: 'meetup_id',
    //relatedKey: 'id',
    //pivotRelatedForeignKey: 'pet_id',
    pivotTable: 'pet_meetups',
    pivotColumns: ['pet_name', 'sort_order'],
  })
  declare meetupPets: ManyToMany<typeof Pet>

  @hasMany(() => ReviewMeetup)
  declare reviewMeetup: HasMany<typeof ReviewMeetup>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
