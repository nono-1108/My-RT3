const Placeholder = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <p>Halaman ini sedang dalam tahap pengembangan.</p>
    </div>
  );
};

export default Placeholder;
