import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  beforeSave,
  afterFetch,
  afterFind,
  manyToMany,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Breed from './breed.js'
import Species from './species.js'
import Meetup from './meetup.js'
import ReviewPet from './review_pet.js'

export const traits = [
  { trait: 'Friendly', rating: 0 },
  { trait: 'Aggressive', rating: 0 },
  { trait: 'Playful', rating: 0 },
  { trait: 'Lazy', rating: 0 },
  { trait: 'Curious', rating: 0 },
]
export default class Pet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare birthday: Date

  @column()
  declare personality: string | { trait: string; rating: number }[]

  @column()
  declare vaccined: boolean

  @column()
  declare gender: string

  @column()
  declare description: string

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare breedId: number

  @belongsTo(() => Breed)
  declare breed: BelongsTo<typeof Breed>

  @column()
  declare speciesId: number

  @belongsTo(() => Species)
  declare species: BelongsTo<typeof Species>

  @column()
  declare photo: string

  @manyToMany(() => Meetup, {
    //localKey: 'id',
    //pivotForeignKey: 'pet_id',
    //relatedKey: 'id',
    //pivotRelatedForeignKey: 'meetup_id',
    pivotTable: 'pet_meetups',
    pivotColumns: ['pet_name', 'sort_order'],
  })
  declare petMeetups: ManyToMany<typeof Meetup>

  @hasMany(() => ReviewPet)
  declare reviewPet: HasMany<typeof ReviewPet>

  @column()
  declare petGlobalRating: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeSave()
  public static async convertPersonalityToJson(pet: Pet) {
    if (pet.$dirty.personality) {
      pet.personality = JSON.stringify(pet.personality)
    }
  }

  @afterFind()
  public static async convertPersonalityToObject(pet: Pet) {
    if (typeof pet.personality === 'string') {
      pet.personality = JSON.parse(pet.personality)
    } else if (!Array.isArray(pet.personality)) {
      pet.personality = []
    }
  }

  @afterFetch()
  public static async convertPersonalityToObjectList(pets: Pet[]) {
    for (const pet of pets) {
      if (typeof pet.personality === 'string') {
        pet.personality = JSON.parse(pet.personality)
      } else if (!Array.isArray(pet.personality)) {
        pet.personality = []
      }
    }
  }

  // Method for updating the global rating of a meetup
  public async updateGlobalRating() {
    if (this.reviewPet && this.reviewPet.length > 0) {
      const totalRating = this.reviewPet.reduce((sum, review) => sum + review.rating, 0)
      this.petGlobalRating = Number((totalRating / this.reviewPet.length).toFixed(1))
      await this.save()
    }
  }
}
