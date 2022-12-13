import Image from "next/image";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../utilities";
import { IPokemon } from "../components/pokemon-card";
import FilterTypes from "./filter-types";
import ResultsGrid from "./results-grid";
import PokemonCard from "./pokemon-card";
import { QUERY_POKEMON, QUERY_POKEMON_TYPES, QUERY_POKEMON_GENERATIONS } from "../gql/queries/pokemon.query";

export const initialPokemonState = {
  id: 0,
  name: "",
  height: 0,
  weight: 0,
  generation: "",
  sprites: {},
  types: [{
    id: 0,
    name: ""
  }]
};

export default function Searcher() {
  const DEBOUNCE_MILLISECONDS = 450;
  const [timerId, setTimerId] = useState(0); // Timer id for debouncing search.
  const [regex, setRegex] = useState(""); // Searchbar.
  const [typeFilters, setTypeFilters] = useState([]); // Sidebar pokemon type filters
  const [limit, setLimit] = useState(9); // Amount of pokemons in grid.
  const [offset, setOffset] = useState(0); // Range for pagination, should be increased or decreased equally to limit.
  const [generation, setGeneration] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<IPokemon>(initialPokemonState);
  const [filters, setFilters] = useState({
    numberAsc: true,
    numberDesc: false,
    nameAsc: false,
    nameDesc: false
  });

  const filterInputs = [
    { 
      key: "numberAsc",
      label: "Sort by number ASC",
      checked: filters.numberAsc,
    },
    { 
      key: "numberDesc",
      label: "Sort by number DESC",
      checked: filters.numberDesc
    },
    { 
      key: "nameAsc",
      label: "Sort by name ASC",
      checked: filters.nameAsc
    },
    { 
      key: "nameDesc",
      label: "Sort by name DESC",
      checked: filters.nameDesc
    }
  ];

  const QUERY_POKEMON_OPTIONS = {
    limit,
    offset,
    typeFilters,
    regex,
    filters,
    generation
  };

  const {
    loading: loadingPokemon,
    error: errorPokemon,
    data: dataPokemon
  } = useQuery(QUERY_POKEMON(QUERY_POKEMON_OPTIONS));

  const {
    loading: loadingPokemonTypes,
    error: errorPokemonTypes,
    data: dataPokemonTypes
  } = useQuery(QUERY_POKEMON_TYPES());

  const {
    loading: loadingPokemonGenerations,
    error: errorPokemonGenerations,
    data: dataPokemonGenerations
  } = useQuery(QUERY_POKEMON_GENERATIONS());

  const debounce = (text: string) => {
    clearTimeout(timerId);
    const id = window.setTimeout(() => setRegex(text), DEBOUNCE_MILLISECONDS);
    setTimerId(id);
  };

  useEffect(() => {
    setOffset(0);
    setSelectedPokemon(initialPokemonState);
  }, [typeFilters, regex]);

  const changeFilters = (value: boolean, key: string) => {
    setFilters((previousFilters) => {
      let newFilters: any = {};
      Object.entries(previousFilters).forEach(([k, v]) => {
        k === key ? newFilters[k] = !value : newFilters[k] = false;
      });
      return newFilters;
    });
  };

  return(
    <div className="w-auto bg-[#222222] p-4 rounded-lg">
      <input className="w-full p-4 mb-4 rounded-lg" type="text" onChange={(e) => debounce(e.target.value)} placeholder="Search a pokemon..." />
      <div className="flex">
        <div className="bg-[#555555] p-4 h-auto basis-1/4 rounded-l-lg">
          <FilterTypes
            setFilters={setTypeFilters}
            types={!loadingPokemonTypes && dataPokemonTypes?.types}
          />
          {filterInputs.map(({ label, key, checked }, i) => {
            return (
              <div key={i} className="m-4">
                <label>
                  <input checked={checked} className="mr-2" type="checkbox"
                    onChange={() => {
                        setOffset(0); // Go back to first page after checking/unchecking filters.
                        changeFilters(checked, key);
                      }
                    }
                  />
                  {label}
                </label>
              </div>
            );
          })}
          <div>
            <span className="mr-2">Generation:</span>
              <select onChange={(e) => setGeneration(e.target.value)} className="rounded-lg p-2">
                <option value={""}>None</option>
                {dataPokemonGenerations?.game_indices.map((e: any, i: number) => {
                  return(
                    <option key={i} value={e.id}>{capitalizeFirstLetter(e.name).replaceAll("-", " ")}</option>
                  )
                })}
              </select>
          </div>
        </div>
        <div className="bg-[#181b1d] p-4 h-auto basis-3/4 rounded-r-lg">
          { loadingPokemon && <Image className="w-full" src={"/simple_pokeball.gif"} alt={"Nothing"} width={300} height={300}/> }
          { !loadingPokemon && !selectedPokemon.name &&
              <ResultsGrid
              list={!loadingPokemon && dataPokemon?.pokemon}
              offset={offset}
              nextPage={() => setOffset(offset => offset + limit)}
              previousPage={() => setOffset(offset => offset - limit)}
              setSelectedPokemon={setSelectedPokemon}
            />
          }
          { selectedPokemon.name && <PokemonCard pokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} /> }
        </div>
      </div>
    </div>
  )
}