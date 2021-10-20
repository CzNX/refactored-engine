import Head from "next/head";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Modal from "../components/Modal";

export default function Home() {
  return (
    <>
      {/* header */}
      <Header />
      {/* feed */}

      <Feed />

      <Modal />
    </>
  );
}
