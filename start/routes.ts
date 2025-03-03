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
const ReviewMeetupsController = () => import('#controllers/review_meetups_controller')
const ReviewPetsController = () => import('#controllers/review_pets_controller')
/**
 * -------------------------------
 * Home routes
 * -------------------------------
 */

router.on('/').render('pages/home').as('home')
router.on('/contact').render('pages/contact').as('contact')
router.on('/about').render('pages/about').as('about')

// route à modifier au fur et à mesure de la constructiond du site
// c'était juste le temps que le site soit en construction
//router.on('/meetups').render('pages/meetups').as('meetups').use(middleware.auth())
//router.on('/pets').render('pages/pets').as('pets').use(middleware.auth())
router.on('/profile').render('pages/profile').as('profile').use(middleware.auth())
//router.on('/reviews').render('pages/reviews').as('reviews').use(middleware.auth())

/**
 * -------------------------------
 * Auth routes
 * -------------------------------
 */

// Register
router.get('/register', [AuthController, 'register']).as('auth.register').use(middleware.guest())

router.post('/register', [AuthController, 'handleRegister']).use(middleware.guest())

// Login
router.get('/login', [AuthController, 'login']).as('auth.login').use(middleware.guest())

router.post('/login', [AuthController, 'handleLogin']).use(middleware.guest())

router.delete('/login', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

// Forgot password
router
  .get('/forgot_password', [ResetPasswordController, 'forgotPassword'])
  .as('auth.forgot_password')
  .use(middleware.guest())
router
  .post('/forgot_password', [ResetPasswordController, 'handleForgotPassword'])
  .use(middleware.guest())

// Reset password
router
  .get('/reset_password', [ResetPasswordController, 'resetPassword'])
  .as('auth.reset_password')
  .use(middleware.guest())
router
  .post('/reset_password', [ResetPasswordController, 'handleResetPassword'])
  .as('auth.handle_reset_password')
  .use(middleware.guest())

/**
 * -------------------------------
 * Users routes
 * -------------------------------
 */

// My profile
router
  .get('/myprofile', [AuthController, 'displayMyProfile'])
  .as('auth.display_my_profile')
  .use(middleware.auth())

// Edit my profile
router
  .get('/edit_myprofile', [AuthController, 'editMyProfile'])
  .as('auth.edit_my_profile')
  .use(middleware.auth())
router
  .post('/edit_myprofile', [AuthController, 'updateMyProfile'])
  .as('auth.update_my_profile')
  .use(middleware.auth())

// Delete my profile
router
  .get('/delete_profile', [AuthController, 'displayDeleteProfile'])
  .as('auth.display_delete_profile')
  .use(middleware.auth())

router
  .delete('/myprofile', [AuthController, 'deleteMyProfile'])
  .as('auth.delete_my_profile')
  .use(middleware.auth())

// Display All Users Profile
router
  .get('/users', [AuthController, 'displayAllUsers'])
  .as('auth.display_all_users')
  .use(middleware.auth())

// Display User Profile by ID
router
  .get('/users/:id', [AuthController, 'displayUserProfile'])
  .as('auth.display_user_profile')
  .use(middleware.auth())

/**
 * -------------------------------
 * Pets routes
 * -------------------------------
 */

//Create Pet
router
  .get('/pets/create-pet', [UsersController, 'showCreatePetForm'])
  .as('showCreatePetForm')
  .use(middleware.auth())

router.post('/pets/create', [UsersController, 'createPet']).as('createPet').use(middleware.auth())

// My Pets
router
  .group(() => {
    router.get('/my-pets', [UsersController, 'listMyPet']).as('MyPets')
    router.put('/my-pets/updatePet/:id', [UsersController, 'updatePet']).as('updatePet')
    router.get('/my-pets/updatePet/:id', [UsersController, 'updatePetView']).as('updatePetview')
    router.delete('/my-pets/delete/:id', [UsersController, 'deletePet']).as('deletePet')
    router.get('/my-pets/deletePetView/:id', [UsersController, 'deletePetView']).as('deletePetview')
  })
  .prefix('pets')
  .use(middleware.auth())

// Display All Pets Profiles
router.get('/pets', [UsersController, 'displayPetList']).as('petList').use(middleware.auth())

// Display Pet Profile by ID
router
  .get('/pets/:id', [UsersController, 'displayPetProfile'])
  .as('PetProfile')
  .use(middleware.auth())
/**
 * -------------------------------
 * Meetups routes
 * -------------------------------
 */

// Create Meetup
router
  .get('/meetups/create-form', [MeetupsController, 'meetupsForm'])
  .as('createMeetupForm')
  .use(middleware.auth())

router
  .post('/meetups/create', [MeetupsController, 'createMeetup'])
  .as('createMeetup')
  .use(middleware.auth())

//Display Meetups by ID
router
  .get('/meetups/:id', [MeetupsController, 'displayOneMeetup'])
  .as('displayMeetup')
  .use(middleware.auth())

//Display All Meetups
router
  .get('/meetups', [MeetupsController, 'displayMeetupsList'])
  .as('displayMeetupsList')
  .use(middleware.auth())

//Display My Meetups
router
  .get('/my-meetups', [MeetupsController, 'displayMyMeetups'])
  .as('myMeetups')
  .use(middleware.auth())

// Join Meetup
router
  .post('/meetups/join/:id', [MeetupsController, 'joinMeetup'])
  .as('joinMeetup')
  .use(middleware.auth())

// Leave Meetup
router
  .delete('/meetups/leave/:id', [MeetupsController, 'leaveMeetup'])
  .as('leaveMeetup')
  .use(middleware.auth())

// Remove Pet from Meetup
router
  .delete('/meetups/removePet/:id', [MeetupsController, 'removePetFromMeetup'])
  .as('removePetFromMeetup')
  .use(middleware.auth())

// Display Delete Meetup Page
router
  .get('/meetups/delete/:id', [MeetupsController, 'deleteMeetupView'])
  .as('deleteMeetupView')
  .use(middleware.auth())

// Delete Meetup
router
  .delete('/meetups/delete/:id', [MeetupsController, 'deleteMeetup'])
  .as('deleteMeetup')
  .use(middleware.auth())

// Update Meetup View
router
  .get('/meetups/update/:id', [MeetupsController, 'updateMeetupView'])
  .as('updateMeetupView')
  .use(middleware.auth())

// Update Meetup
router
  .put('/meetups/update/:id', [MeetupsController, 'updateMeetup'])
  .as('updateMeetup')
  .use(middleware.auth())

/**
 * -------------------------------
 * Review Meetup routes
 * -------------------------------
 */

// Create ReviewMeetup
router
  .post('/review_meetups', [ReviewMeetupsController, 'createReviewMeetup'])
  .as('createReviewMeetup')
  .use(middleware.auth())

// Delete ReviewMeetup
router
  .delete('/review_meetups/:id', [ReviewMeetupsController, 'deleteReviewMeetup'])
  .as('deleteReviewMeetup')
  .use(middleware.auth())

// edit ReviewMeetup
router
  .put('/review_meetups/:id', [ReviewMeetupsController, 'editReviewMeetup'])
  .as('editReviewMeetup')
  .use(middleware.auth())

/**
 * -------------------------------
 * Review Pet routes
 * -------------------------------
 */

// Create ReviewPet
router
  .post('/review_pet', [ReviewPetsController, 'createReviewPet'])
  .as('createReviewPet')
  .use(middleware.auth())

// Delete ReviewPet
router
  .delete('/review_pet/:id', [ReviewPetsController, 'deleteReviewPet'])
  .as('deleteReviewPet')
  .use(middleware.auth())

// edit ReviewPet
router
  .put('/review_pet/:id', [ReviewPetsController, 'editReviewPet'])
  .as('editReviewPet')
  .use(middleware.auth())

// Show ReviewPet Form
router
  .get('/reviewsForm/:id', [ReviewPetsController, 'showReviewForm'])
  .as('showReviewForm')
  .use(middleware.auth())

//show edit review form
router
  .get('/editReviewForm/:id', [ReviewPetsController, 'editReviewForm'])
  .as('showEditReviewForm')
  .use(middleware.auth())

//esaie geo
router.get('/geo', [MeetupsController, 'geo']).as('geo').use(middleware.auth())
