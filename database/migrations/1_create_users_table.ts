import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.float('longitude').nullable()
      table.float('latitude').nullable()
      table.string('address_1').nullable()
      table.string('address_2').nullable()
      table.string('postal_code').nullable()
      table.string('city').nullable()
      table.string('phone').nullable()
      table.text('description').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
