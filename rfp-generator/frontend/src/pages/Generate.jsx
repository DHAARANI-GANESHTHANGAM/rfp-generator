export default function Generate() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-spin">⚙️</div>
        <h1 className="text-2xl font-bold mb-2">Generating your response...</h1>
        <p className="text-gray-400">
          AI is reading your RFP and drafting a response.
        </p>
        <p className="text-gray-500 text-sm mt-2">This takes 15–30 seconds</p>
      </div>
    </div>
  );
}
