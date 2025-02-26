export type UnitTitle = {
  description: string;
  backgroundColor: `bg-${string}`;
  textColor: `text-${string}`;
  borderColor: `border-${string}`;
  fixedText: string; // Adicionando um texto fixo
};

export type Tile =
  | {
      type: "star" | "dumbbell" | "book" | "trophy" | "fast-forward";
      description: string;
    }
  | { type: "treasure" };

export type TileType = Tile["type"];

export type Unitt = UnitTitle & {
  tiles: Tile[];
};

export const units: readonly Unitt[] = [
  {
    description: "Troque em produtos e benefícios na loja.",
    backgroundColor: "bg-[#0000CB]",
    textColor: "text-[#58cc02]",
    borderColor: "border-[#0000CB]",
    fixedText: "Faça missões e ganhe Policoins", // Adicionando o texto fixo
    tiles: [
      {
        type: "star",
        description: "Form basic sentences",
      },
      {
        type: "book",
        description: "Good morning",
      },
      {
        type: "star",
        description: "Greet people",
      },
      { type: "treasure" },
      { type: "book", description: "A date" },
      { type: "trophy", description: "Unit 1 review" },
    ],
  }
];