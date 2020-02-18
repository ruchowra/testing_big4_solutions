//TODO:: Load conf values from .env/ process.env.{varname}
const config = {
    db: {
        connectionString: 'mongodb+srv://admin:Pass123@cluster0-qlopb.mongodb.net/ratt_spar?retryWrites=true&w=majority',
        connectionOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        name: 'ratt_spar'
    }
}
export default config