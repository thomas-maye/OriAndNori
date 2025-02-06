/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
// import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')

router.on('/').render('pages/home')
router.on('pets/create-pet').render('pages/create_pet')

router.post('pets/create', [UsersController, 'createPet']).as('createPet')
