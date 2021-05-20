import { connect } from "mongoose";

const connectMongo = async () =>
    await connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

export default connectMongo;