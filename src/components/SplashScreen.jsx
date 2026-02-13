export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-navy-dark flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="text-5xl mb-4">🐺</div>
        <div className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-500 mb-1">Powered by</div>
        <div className="text-2xl font-black tracking-widest text-white">HOWL</div>
      </div>
    </div>
  );
}
