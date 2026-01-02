import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../Pages/Api.css";
const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

/**
 * @typedef {Object} Post
 * @property {number} id
 * @property {string} title
 */

const Api = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savePosts = JSON.parse(localStorage.getItem("posts") || "[]");
    if (savePosts.length > 0) {
      setPosts(savePosts);
      console.log("Data stored in local storage successfully", savePosts);
    } else {
      const Fetch = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${BASE_URL}`);
          const posts = await res.json();
          setPosts(posts);
          console.log(posts);
        } catch (error) {
          console.log("Error: ", error);
        } finally {
          setIsLoading(false);
        }
      };
      Fetch();
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mainContainer">
      <h1>Fetching Api</h1>
      <div className="container">
        <ul>
          {posts.map((post) => (
            <div className="postItem" key={post.id}>
              <li key={post.id}>{post.title}</li>
              <div>
                <FontAwesomeIcon className="editBtn" icon={faPenToSquare} />
                <FontAwesomeIcon className="editBtn" icon={faTrash} />
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Api;
