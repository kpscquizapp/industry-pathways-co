const BarLoader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-48 h-2 bg-gray-300 rounded overflow-hidden">
        <div className="h-full w-1/3 bg-black dark:bg-white animate-loading-bar" />
      </div>
    </div>
  );
}

export default BarLoader