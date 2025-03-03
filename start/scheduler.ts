import scheduler from 'adonisjs-scheduler/services/main'

// Run the mail:for-review command every hour
scheduler.command('mail:for-review').hourly()
