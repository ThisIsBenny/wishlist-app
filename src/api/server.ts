import fastifyBuilder from './app'

fastifyBuilder().then((app) => {
  app.listen(process.env.PORT || 5000, '0.0.0.0', (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
})
