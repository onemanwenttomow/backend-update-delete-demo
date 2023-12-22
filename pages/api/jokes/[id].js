import dbConnect from "../../../db/connect";
import Joke from "../../../db/models/Joke";

export default async function handler(request, response) {
  await dbConnect();
  const { id } = request.query;

  if (request.method === "DELETE") {
    console.log("about to delete");

    await Joke.findByIdAndDelete(id);

    response.status(200).json({ status: "Joke Deleted" });
  }

  if (request.method === "PUT") {
    console.log("hit the update part");

    // pull out the joke from the request body
    const jokeData = request.body;

    // call a function to update our document in the database
    await Joke.findByIdAndUpdate(id, jokeData);

    // if this works
    response.status(200).json({ status: "Joke Updated" });
  }

  if (request.method === "GET") {
    const joke = await Joke.findById(id);

    if (!joke) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(joke);
  }
}
