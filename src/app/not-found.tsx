import Link from "next/link";
import { Cabecera } from "@/components/Papel";
import { Sello } from "@/components/Sello";

export default function NoEncontrado() {
  return (
    <main className="hoja min-h-dvh pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-[36rem] px-4">
        <Cabecera volver={{ href: "/", texto: "Pasaporte" }} />
        <div className="mx-auto mt-14 w-[min(80vw,300px)]">
          <Sello
            id="sin-registrar"
            nombre="Sin registrar"
            pais="Entrada denegada"
            codigo="---"
            fecha={null}
            forma="rectangulo"
            tinta="violeta"
            semilla={3}
          />
        </div>
        <h1 className="mt-14 text-[clamp(2.5rem,12vw,3.75rem)] leading-[0.9] font-extrabold text-balance uppercase font-stretch-extra-condensed">
          Esta página no está en el pasaporte
        </h1>
        <p className="mt-4 max-w-[34ch] text-[17px] leading-relaxed text-texto-suave">
          Puede que la dirección esté mal escrita o que ese viaje todavía no tenga página.
        </p>
        <Link
          href="/"
          className="pulsable mt-8 inline-flex h-12 items-center rounded-[3px] bg-texto px-5 text-[17px] font-extrabold tracking-[0.12em] text-papel uppercase font-stretch-extra-condensed hover:bg-cobalto"
        >
          Abrir el pasaporte
        </Link>
      </div>
    </main>
  );
}
