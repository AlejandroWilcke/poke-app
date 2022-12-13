import * as d3 from "d3";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { capitalizeFirstLetter, getAlternativeImg } from "../utilities";
import { initialPokemonState } from "../components/searcher";

export interface IPokemonType {
  id: number;
  name: string;
}

export interface IPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  generation: string;
  sprites: any;
  types: IPokemonType[];
}

export interface IPokemonCardProps {
  pokemon: IPokemon;
  setSelectedPokemon: Dispatch<SetStateAction<IPokemon>>;
}

export default function PokemonCard({ pokemon, setSelectedPokemon }: IPokemonCardProps) {
  const { id, name, height, weight, types, sprites } = pokemon;
  const { front_default } = JSON.parse(sprites[0].sprites);
  const alternativeSrc = getAlternativeImg(id);
  return(
    <div className={`relative w-full bg-[#222222] border-[1px] rounded-lg p-8`}>
      <Image
        onClick={() => setSelectedPokemon(initialPokemonState)}
        className="absolute right-0 top-0 p-2 cursor-pointer"
        src={`/images/close-button.png`}
        alt={`Close button`}
        width={40}
        height={40}
      />
      <h2 className="bg-[#333333] p-4 text-center md:text-left rounded-lg">{capitalizeFirstLetter(name)}</h2>
      <div className="grid grid-rows-3 grid-flow-col gap-4 mt-4">
        <h1 className="row-span-1 text-center md:row-span-3 md:text-left col-span-3 bg-[#333333] p-6 rounded-lg">Description</h1>
        <div className="col-span-3 md:col-span-3 md:row-span-1 bg-[#333333] p-6 rounded-lg">
          <Image className="m-auto" src={front_default || alternativeSrc} alt={"Not found"} width={150} height={150} />
        </div>
        <div className="row-span-1 col-span-3 md:col-span-3 md:row-span-2 bg-[#333333] p-6 rounded-lg">
          <div className="chartRef">

          </div>
        </div>
      </div>
    </div>
  )
}