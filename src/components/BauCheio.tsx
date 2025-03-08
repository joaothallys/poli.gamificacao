import Image from "next/image";

const BauCheio = () => {
  return (
    <Image
      src="/estrela_plis.svg"
      alt="Baú de recompensa cheio"
      width={32} // Aumente o tamanho para 40
      height={32} // Aumente o tamanho para 40
      style={{ objectFit: "contain" }}
    />
  );
};

export default BauCheio;