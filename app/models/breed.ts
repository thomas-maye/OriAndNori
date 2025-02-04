import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Species from './species.js'
import Pet from './pet.js'

export default class Breed extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare speciesId: number

  @belongsTo(() => Species)
  declare species: BelongsTo<typeof Species>

  @hasMany(() => Pet)
  declare pet: HasMany<typeof Pet>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
