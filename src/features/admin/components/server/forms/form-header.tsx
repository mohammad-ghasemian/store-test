type FormHeaderProps = {
  title: string;
  description: string;
};

export function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <header className="mb-6 space-y-1 text-center">
      <h1 className="text-xl font-bold tracking-tight text-zinc-100">
        {title}
      </h1>
      <p className="text-xs text-zinc-400">{description}</p>
    </header>
  );
}
