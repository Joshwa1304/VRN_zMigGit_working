function Source() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-4xl">
        <h3 className="text-xl font-semibold text-gray-800 text-center">zMigGIT Project</h3>
        <video
          className="w-full h-auto rounded-lg shadow-lg"
          controls
        >
          <source src="..\\assets\\videos\\Endevor Source Application 1507.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default Source;

