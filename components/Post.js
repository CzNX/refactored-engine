import {
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
} from "@heroicons/react/solid";
import {
  BookmarkIcon,
  HeartIcon as Hi,
  PaperAirplaneIcon,
  ChatIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import Moment from "react-moment";

const Post = ({ uname, id, img, uimg, caption }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  //send a comment  to firebase
  const sendComment = async (e) => {
    e.preventDefault();
    const commentToSend = comment;
    setComment("");
    await addDoc(collection(db, "posts", id, "comments"), {
      //traverse to posts->specific id of that post = > created 'comments' collection which holds multiple new doc i.e comments for that specific post
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamps: serverTimestamp(),
    });
  };

  // retrieve comments
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamps", "desc")
        ),
        // (snapshot) => console.log(snapshot.docs)
        (snapshot) => setComments(snapshot.docs)
      ),
    [db]
  );
  // retrieve likes

  useEffect(
    () =>
      onSnapshot(
        collection(db, "posts", id, "likes"),
        // (snapshot) => console.log(snapshot.docs)
        (snapshot) => setLikes(snapshot.docs)
      ),
    [db]
  );

  // like function
  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.username,
      });
    }
  };

  // console.log(likes);
  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  return (
    <div className="bg-white my-7 border rounded-sm">
      {/* header */}
      <div className="flex items-center p-5">
        <img
          src={uimg}
          alt=""
          className="rounded-full h-12 w-12 object-contain border p-1 mr-3"
        />
        <p className="flex-1 font-bold">{uname}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      {/* img */}
      <img src={img} alt="" className="object-contain w-full max-h-[350px]" />
      {/* buttons */}
      {session && (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
            {hasLiked ? (
              <HeartIcon
                className={`btn ${hasLiked && "text-red-700"}`}
                onClick={likePost}
              />
            ) : (
              <Hi className="btn" onClick={likePost} />
            )}

            <PaperAirplaneIcon className=" btn" />
            <ChatIcon className="btn" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      )}

      {/* caption */}
      <p className="p-5 truncate">
        {likes.length > 0 && (
          <p className="font-bold mb-1">
            {likes.length}
            {likes.length < 2 ? "  Like" : "  Likes"}
          </p>
        )}
        <span className="font-bold mr-1">{uname}</span>
        {caption}
      </p>
      {/* comments */}
      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll ">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mb-3">
              <img
                className="h-7 rounded-full"
                src={comment.data().userImage}
                alt=""
              />
              <p className="text-sm flex-1">
                <span className="font-bold">{comment.data().username}</span>{" "}
                {comment.data().comment}
              </p>
              <Moment fromNow className="pr-5 text-xs">
                {comment.data().timestamps?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* input box */}
      {session && (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="h-7" />
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border-none flex-1 focus:ring-0"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            onClick={sendComment}
            className="font-bold text-blue-500"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
