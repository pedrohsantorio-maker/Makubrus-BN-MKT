export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-8 text-center text-white">
      <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight">
        Acesso Negado
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Você não tem idade suficiente para acessar este conteúdo.
      </p>
    </main>
  );
}
