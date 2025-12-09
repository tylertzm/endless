/* eslint-disable @next/next/no-img-element */
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <img
        src="/endless.webp"
        alt="Endless"
        className="w-16 h-16 md:w-24 md:h-24 object-contain animate-spin animate-pulse"
        style={{ animationDuration: '1.25s' }}
      />
    </div>
  );
}