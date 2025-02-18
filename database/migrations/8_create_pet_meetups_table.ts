import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pet_meetups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
      table.integer('pet_id').unsigned().references('pets.id').onDelete('CASCADE')
      table.integer('meetup_id').unsigned().references('meetups.id').onDelete('CASCADE')
      table.string('pet_name').notNullable()
      table.unique(['pet_id', 'meetup_id'])

      // Timestamps
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
