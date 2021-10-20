import { useRecoilState } from "recoil";
import { modalSatete } from "../atoms/modalAtom";
import { useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { useSession } from "next-auth/react";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
const Modal = () => {
  const [open, setOpen] = useRecoilState(modalSatete);
  const [selectedPic, setSelectedPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const captionRef = useRef(null);
  const { data: session } = useSession();

  const addImageToPost = () => {
    const file = inputRef.current.files[0];
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      setSelectedPic(reader.result);
    };
  };

  //main upload function

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);

    // upload post to firebase
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: captionRef.current.value,
      profile: session.user.image,
      timestamp: serverTimestamp(),
    });
    // console.log(docRef.id);

    // upload image to firebase

    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    await uploadString(imageRef, selectedPic, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);

        // update post attaching that image
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );

    setOpen(false);
    setLoading(false);
    setSelectedPic(null);
  };

  return (
    <>
      {open ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl md:min-w-[500px]">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Post Your Feed !</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span
                      className={`bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none ${
                        loading && "cursor-not-allowed"
                      }`}
                    >
                      <button disabled={loading}>x</button>
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex flex-col flex-auto items-center justify-center space-y-3">
                  <CameraIcon
                    className="h-5 cursor-pointer "
                    onClick={() => inputRef.current.click()}
                  />

                  {selectedPic && (
                    <img
                      className=" object-contain 
                      w-full h-52
                      cursor-pointer"
                      src={selectedPic}
                      alt=""
                      onClick={() => setSelectedPic(null)}
                    />
                  )}

                  <input
                    className="
                    border-none
                    w-full
                    focus:outline-none
                    focus:ring-0
                    text-center
                  "
                    ref={captionRef}
                    type="text"
                    placeholder="plz enter caption..."
                  />
                  <input
                    type="file"
                    ref={inputRef}
                    hidden
                    onChange={addImageToPost}
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-blueGray-200 rounded-b">
                  {/* <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    {loading ? "uploading" : "Upload Post"}{" "}
                  </button> */}
                  <button
                    className={`bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
                      loading && "!bg-gray-700 cursor-wait"
                    }`}
                    type="button"
                    // onClick={() => setOpen(false)}
                    onClick={uploadPost}
                    disabled={!selectedPic || loading}
                  >
                    {loading ? "uploading" : "Upload Post"}{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
