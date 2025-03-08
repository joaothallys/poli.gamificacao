import Image from "next/image";

const Bau = () => {
  return (
    <Image
      src="/estrela.svg"
      alt="Baú de recompensa"
      width={32}
      height={32}
      style={{ objectFit: "contain" }}
    />
  );
};

export default Bau;