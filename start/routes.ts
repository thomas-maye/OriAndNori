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
const ResetPasswordController = () => import('#controllers/reset_password_controller')
const MeetupsController = () => import('#controllers/meetups_controller')

router.on('/').render('pages/home').as('home')
router.on('/contact').render('pages/contact').as('contact')
router.on('/about').render('pages/about').as('about')

// route à modifier au fur et à mesure de la constructiond du site
// c'était juste le temps que le site soit en construction
router.on('/meetups').render('pages/meetups').as('meetups').use(middleware.auth())
//router.on('/pets').render('pages/pets').as('pets').use(middleware.auth())
router.on('/profile').render('pages/profile').as('profile').use(middleware.auth())
router.on('/reviews').render('pages/reviews').as('reviews').use(middleware.auth())

// Auth routes
router.get('/register', [AuthController, 'register']).as('auth.register').use(middleware.guest())
router.post('/register', [AuthController, 'handleRegister']).use(middleware.guest())

router.get('/login', [AuthController, 'login']).as('auth.login').use(middleware.guest())
router.post('/login', [AuthController, 'handleLogin']).use(middleware.guest())
router.delete('/login', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

router
  .get('/forgot_password', [ResetPasswordController, 'forgotPassword'])
  .as('auth.forgot_password')
  .use(middleware.guest())
router
  .post('/forgot_password', [ResetPasswordController, 'handleForgotPassword'])
  .use(middleware.guest())

router
  .get('/reset_password', [ResetPasswordController, 'resetPassword'])
  .as('auth.reset_password')
  .use(middleware.guest())
router
  .post('/reset_password', [ResetPasswordController, 'handleResetPassword'])
  .as('auth.handle_reset_password')
  .use(middleware.guest())

router
  .get('/myprofile', [AuthController, 'displayMyProfile'])
  .as('auth.display_my_profile')
  .use(middleware.auth())
router
  .get('/edit_myprofile', [AuthController, 'editMyProfile'])
  .as('auth.edit_my_profile')
  .use(middleware.auth())
router
  .post('/edit_myprofile', [AuthController, 'updateMyProfile'])
  .as('auth.update_my_profile')
  .use(middleware.auth())

//pets routes
router
  .get('/pets/create-pet', [UsersController, 'showCreatePetForm'])
  .as('showCreatePetForm')
  .use(middleware.auth())

router.post('/pets/create', [UsersController, 'createPet']).as('createPet').use(middleware.auth())

router
  .group(() => {
    router.get('/my-pets', [UsersController, 'listMyPet']).as('MyPets')
    router.put('/my-pets/updatePet/:id', [UsersController, 'updatePet']).as('updatePet')
    router.get('/my-pets/updatePetView/:id', [UsersController, 'updatePetView']).as('updatePetview')
    router.delete('/my-pets/delete/:id', [UsersController, 'deletePet']).as('deletePet')
    router.get('/my-pets/deletePetView/:id', [UsersController, 'deletePet']).as('deletePetview')
  })
  .prefix('pets')
  .use(middleware.auth())

router.get('/pets', [UsersController, 'displayPetList']).as('petList').use(middleware.auth())
router
  .get('/pets/:id', [UsersController, 'displayPetProfile'])
  .as('PetProfile')
  .use(middleware.auth())

//meetups routes
router
  .get('/meetups/create-form', [MeetupsController, 'MeetupsForm'])
  .as('showCreateMeetupsForm')
  .use(middleware.auth())

router
  .post('/meetups/create', [MeetupsController, 'createMeetup'])
  .as('createMeetup')
  .use(middleware.auth())
