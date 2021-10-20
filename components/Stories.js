import faker from "faker";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Story from "./Story";

const Stories = () => {
  const { data: session } = useSession();

  const [suggestions, setSuggestions] = useState();
  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: Math.random() * 1000,
    }));
    setSuggestions(suggestions);
  }, []);
  return (
    <div
      className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm
    overflow-scroll
    
    "
    >
      {session && (
        <Story img={session?.user?.image} uname={session?.user?.username} />
      )}

      {suggestions?.map((profile) => (
        <Story key={profile.id} img={profile.avatar} uname={profile.username} />
      ))}
    </div>
  );
};

export default Stories;
