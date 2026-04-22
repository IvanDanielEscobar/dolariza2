export default async function Home() {
  // Hacemos el fetch de los datos a DolarAPI
  const res = await fetch("https://dolarapi.com/v1/dolares", {
    // Revalidamos los datos cada 60 segundos
    next: { revalidate: 60 },
  });
  const dolares = await res.json();

  return (
    <div className="min-h-screen p-8 bg-green-900 text-slate-900">
      <main className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-white">Cotizaciones del Dólar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dolares.map((dolar) => (
            <div key={dolar.casa} className="bg-emerald-800 p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold capitalize mb-4 text-white">{dolar.nombre}</h2>
              <div className="flex justify-between mb-2">
                <span className="text-zinc-300">Compra</span>
                <span className="font-bold text-lg text-white">${dolar.compra}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Venta</span>
                <span className="font-bold text-lg text-white">${dolar.venta}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
