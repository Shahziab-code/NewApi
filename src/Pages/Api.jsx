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
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savePosts = JSON.parse(localStorage.getItem("posts") || "[]");
    if (savePosts.length > 0) {
      setPosts(savePosts);
      setIsInitialized(true);
      console.log("Data stored in local storage successfully", savePosts);
    } else {
      const Fetch = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${BASE_URL}`);
          const posts = await res.json();
          setPosts(posts);
          setIsInitialized(true);
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

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts, isInitialized]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });
      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, title: updatedPost.title } : post
        )
      );
      setEditId(null);
    } catch (error) {
      console.log("Error updating post: ", error);
    }
  };

  const startEdit = (id, currentTitle) => {
    setEditId(id);
    setEditTitle(currentTitle);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log("Error deleting post: ", error);
    } finally {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="mainContainer">
      <h1>Fetching Api</h1>
      <div className="container">
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                {editId === post.id ? (
                  <>
                    <input
                      type="text"
                      className="inputText"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleUpdate(post.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(post.id);
                      }}
                      autoFocus
                    />
                    <button onClick={() => handleUpdate(post.id)}>save</button>
                  </>
                ) : (
                  <div className="postItem">
                    <div>{post.title}</div>
                    <div>
                      <FontAwesomeIcon
                        className="editBtn"
                        icon={faPenToSquare}
                        onClick={() => startEdit(post.id, post.title)}
                      />
                      <FontAwesomeIcon className="editBtn" icon={faTrash} onClick={() => handleDelete(post.id)} />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Api;
