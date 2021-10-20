import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { searchState } from "../atoms/searchAtom";
import { db } from "../firebase";
import Post from "./Post";
const Posts = () => {
  const [posts, setpost] = useState([]);
  const value = useRecoilValue(searchState);
  const Dummy = [
    {
      id: "123",
      uname: "ssss",
      uimg: "https://yt3.ggpht.com/yti/APfAmoFWq2yLdeuoEFP6ekn94wcSHU2TIonAp7TN_IFynw=s88-c-k-c0x00ffffff-no-rj-mo",
      img: "/obi.jpg",
      caption: "dope shit",
    },
    {
      id: "12223",
      uname: "sssswad",
      uimg: "https://yt3.ggpht.com/yti/APfAmoFWq2yLdeuoEFP6ekn94wcSHU2TIonAp7TN_IFynw=s88-c-k-c0x00ffffff-no-rj-mo",
      img: "/obi.jpg",
      caption: "dope shit 2",
    },
  ];

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setpost(snapshot.docs);
        }
      ),
    [db]
  );

  return (
    <div>
      {posts
        .filter((post) => post.data().username.includes(value))
        .map((post) => (
          <Post
            key={post.id}
            id={post.id}
            uname={post.data().username}
            uimg={post.data().profile}
            img={post.data().image}
            caption={post.data().caption}
          />
        ))}
    </div>
  );
};

export default Posts;
