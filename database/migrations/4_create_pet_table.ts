import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.string('name').notNullable()
      table.date('birthday').notNullable()
      table.string('personality').nullable()
      table.boolean('vaccined').defaultTo(false)
      table.string('gender').notNullable()
      table.text('description').nullable()
      table.string('photo').nullable()
      table.float('pet_global_rating', 3, 1).nullable()

      // Foreign keys
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('breed_id').unsigned().references('breeds.id').onDelete('CASCADE')
      table.integer('species_id').unsigned().references('species.id').onDelete('CASCADE')

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
