import Image from "next/image";

const BauPremio = () => {
  return (
    <Image
      src="/BauPremio.svg"
      alt="Baú de recompensa cheio"
      width={32} // Aumente o tamanho para 40
      height={32} // Aumente o tamanho para 40
      style={{ objectFit: "contain" }}
    />
  );
};

export default BauPremio;