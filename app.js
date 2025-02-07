const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");


const app = express();

app.use(bodyParser.json());

app.use(isAuth);


//one endpoint for all requests
app.use(
  "/graphql",
  graphqlHTTP({
    //keys below
    //defining what commands we want to support
    //defining what data we can fetch
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true //built-in debugging and dev tool to test API
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
}@eventbooking-graphql.9pxhd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=EventBooking-GraphQL`
)
.then(()=> {
    app.listen(3000);
}).catch(error => {
    console.log(error);
});



