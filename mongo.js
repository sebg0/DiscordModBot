const mongoose = require("mongoose")
const config = require("./config.json")

module.exports = async () => {
  await mongoose.connect(config.mongopath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  return mongoose
}
