const AmbientBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-[-10%] right-[30%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] mix-blend-screen" />
    </div>
  );
};

export default AmbientBackground;
