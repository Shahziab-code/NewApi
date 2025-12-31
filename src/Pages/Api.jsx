import { useEffect, useState } from "react";
import '../Pages/Api.css'
const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

/**
 * @typedef {Object} Post 
 * @property {number} id 
 * @property {string} title 
 */

const Api = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const Fetch = async () => {
        setIsLoading(true)
        if (posts) {
        const savePosts =  localStorage.getItem(posts.title)
        setPosts(savePosts)
        } else {
         try {
        const res = await fetch(`${BASE_URL}`);
        const posts = await res.json();
        setPosts(posts);
        localStorage.setItem('posts', JSON.stringify(posts))
        console.log(posts);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false)
      }
        }
    };
    Fetch();
  }, [posts]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="mainContainer">
      <h1>Fetching Api</h1>
      <div className="container">
        <ul>
            {posts.map((post) => (
                <li key={post.id}>{post.title}</li>
             ))} 
        </ul>
      </div>
    </div>
  );
};

export default Api;
