import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Breed from './breed.js'
import Species from './species.js'

export default class Pet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare birthday: Date

  @column()
  declare personality: string

  @column()
  declare vaccined: boolean

  @column()
  declare gender: string

  @column()
  declare description: string

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  @column()
  declare breedId: number

  @column()
  declare breedName: string

  @belongsTo(() => Breed)
  declare breed: BelongsTo<typeof Breed>

  @column()
  declare speciesId: number

  @column()
  declare speciesName: string

  @belongsTo(() => Species)
  declare species: BelongsTo<typeof Species>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
