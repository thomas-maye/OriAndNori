import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'meetups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.string('title').notNullable()
      table.string('organizer').notNullable()
      table.text('description').nullable()
      table.string('adress').notNullable()
      table.string('additional_address').nullable()
      table.string('city').notNullable()
      table.string('type').notNullable()
      table.dateTime('date').notNullable()

      // Foreign keys
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      // Timestamps
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
