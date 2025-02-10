/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

//home routes
router.on('/').render('pages/home').as('home')

//pets routes
router
  .get('pets/create-pet', [UsersController, 'showCreatePetForm'])
  .as('showCreatePetForm')
  .use(middleware.auth())

router.post('pets/create', [UsersController, 'createPet']).as('createPet').use(middleware.auth())

router
  .group(() => {
    router.get('my-pets', [UsersController, 'listMyPet']).as('MyPets')
    router.put('/my-pets/updatePet/:id', [UsersController, 'updatePet']).as('updatePet')
    router.get('my-pets/updatePetView/:id', [UsersController, 'updatePetView']).as('updatePetview')
    router.delete('/my-pets/delete/:id', [UsersController, 'deletePet']).as('deletePet')
    router.get('my-pets/deletePetView/:id', [UsersController, 'deletePet']).as('deletePetview')
  })
  .prefix('pets')
  .use(middleware.auth())

router.get('pets', [UsersController, 'displayPetList']).as('petList').use(middleware.auth())
router
  .get('pets/:id', [UsersController, 'displayPetProfile'])
  .as('PetProfile')
  .use(middleware.auth())

//auth routes
router.get('/register', [AuthController, 'register']).as('auth.register').use(middleware.guest())
router.post('/register', [AuthController, 'handleRegister']).use(middleware.guest())
router.get('/login', [AuthController, 'login']).as('auth.login').use(middleware.guest())
router.post('/login', [AuthController, 'handleLogin']).use(middleware.guest())
router.get('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
