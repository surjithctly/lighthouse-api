const Loader = () => {
  return (
    <span className="inline-flex items-center">
      <span className="bg-white animate-blink w-1 h-1 rounded-full mx-px" />
      <span className="bg-white animate-blink w-1 h-1 rounded-full mx-px animation-delay-150" />
      <span className="bg-white animate-blink w-1 h-1 rounded-full mx-px animation-delay-300" />
    </span>
  );
};

export default Loader;
