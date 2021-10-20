const Story = ({ img, uname }) => {
  return (
    <div className="">
      <img
        className="rounded-full h-14 w-14 p-[1.5px] border-red-500 border-2
        object-contain
        cursor-pointer
        hover:scale-110
        transition-all
        duration-200
        ease-out
        "
        src={img}
        alt="err"
      />
      <p className="text-sm w-14 truncate text-center">{uname}</p>
    </div>
  );
};

export default Story;
