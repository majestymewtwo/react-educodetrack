export default function Loader() {
  return (
    <section className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <img src="/loading.gif" alt="Loading" className="size-12" />
      <p className="text-xl">Loading</p>
    </section>
  );
}
