# db/migrate/YYYYMMDDHHMMSS_create_users.rb
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :username, null: false
      t.string :email, null: false
      t.string :password_digest

      t.timestamps
    end
    add_index :users, :username, unique: true
    add_index :users, :email, unique: true
  end
end
