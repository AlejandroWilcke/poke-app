import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { IPokemon } from "./pokemon-card";
import { capitalizeFirstLetter, getAlternativeImg } from "../utilities";

interface GridProps {
  list: Array<IPokemon>;
  offset: number;
  nextPage: () => void;
  previousPage: () => void;
  setSelectedPokemon: Dispatch<SetStateAction<IPokemon>>;
}

export default function ResultsGrid({
  list,
  offset,
  nextPage,
  previousPage,
  setSelectedPokemon
}: GridProps ) {
  const getPreviousPage = () => {
    if (offset > 0){
      previousPage();
    }
  };
  const getNextPage = () => {
    if( list?.length >= 9 ){
      nextPage();
    }
  };
  const getTypes = (types: any) => {
    return types.map((e: any) => e.type.name).join(", ");
  };

  return(
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 justify-items-center">
      {
        list && 
        list.map((pokemon, i) => {
          const { id, name, height, weight, types, sprites } = pokemon;
          const { front_default } = JSON.parse(sprites[0].sprites);
          const alternativeSrc = getAlternativeImg(id);
          return(
            <div 
              key={i}
              className="w-3/4 md:w-3/4 bg-[#123456] p-4 justify-center rounded-lg border-2 cursor-pointer hover:bg-[#22b2d6]"
              onClick={() => setSelectedPokemon(pokemon)}
            >
              <Image className="m-auto" src={front_default || alternativeSrc} alt={"Not found"} width={96} height={96} />
              <p className="text-center">{id}: {capitalizeFirstLetter(name)}</p>
              <p className="text-center text-xs">Height: {height} Weight: {weight}</p>
              <p className="text-center text-xs">Types: { getTypes(types) }</p>
            </div>
          )
        })
      }
      </div>
      <div className="flex justify-center mt-8 m-auto space-x-4">
        <button className="w-24 bg-[#222222] p-4 rounded-lg" onClick={getPreviousPage}>Previous</button>
        <button className="w-24 bg-[#222222] p-4 rounded-lg" onClick={getNextPage}>Next</button>
      </div>
    </>
  )
}