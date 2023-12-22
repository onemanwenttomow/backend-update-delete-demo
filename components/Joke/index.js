import useSWR, { mutate } from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import JokeForm from "../JokeForm";
import Link from "next/link";

export default function Joke() {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(id ? `/api/jokes/${id}` : null);

  async function handleEdit(event) {
    event.preventDefault();

    // we need to figure out what is in the form
    const formData = new FormData(event.target);
    const jokeData = Object.fromEntries(formData);

    // console.log("jokeData: ", jokeData);
    // we need to make a PUT request to our API route

    const response = await fetch(`/api/jokes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jokeData),
    });

    if (response.ok) {
      mutate();
    }
  }

  async function handleDelete() {
    console.log("delete please");
    // we should make a DELETE request to our
    // API route

    await fetch(`/api/jokes/${id}`, {
      method: "DELETE",
    });

    // then we should redirect to the homepage
    router.push("/");
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) return;

  return (
    <>
      <small>ID: {id}</small>
      <h1>{data.joke} </h1>
      <div>
        <button
          onClick={() => {
            setIsEditMode(!isEditMode);
          }}
        >
          <span role="img" aria-label="A pencil">
            ✏️
          </span>
        </button>
        <button onClick={handleDelete} disabled={isEditMode}>
          <span role="img" aria-label="A cross indicating deletion">
            ❌
          </span>
        </button>
      </div>
      {isEditMode && (
        <JokeForm onSubmit={handleEdit} value={data.joke} isEditMode={true} />
      )}
      <Link href="/">Back to all</Link>
    </>
  );
}
