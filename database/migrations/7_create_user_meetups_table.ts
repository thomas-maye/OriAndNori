import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_meetups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Foreign keys
      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table
        .integer('meetup_id')
        .unsigned()
        .references('meetups.id')
        .notNullable()
        .onDelete('CASCADE')
      table.string('user_name').notNullable()
      table.string('sort_order').notNullable().defaultTo(0)
      table.unique(['user_id', 'meetup_id'])

      // timestamps
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
