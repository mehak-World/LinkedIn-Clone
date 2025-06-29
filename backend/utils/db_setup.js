const mongoose = require("mongoose")

const connect_db = () => {
    main().then(() => console.log("Successfully connected to database.")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
}



module.exports = connect_db