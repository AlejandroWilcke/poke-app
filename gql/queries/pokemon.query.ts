import { gql } from "@apollo/client";

interface QueryPokemonType {
  regex?: string;
  limit?: number;
  offset?: number;
  typeFilters?: string[];
  filters?: any;
  generation?: string;
};

export const QUERY_POKEMON = ({
  limit = 6,
  offset = 6,
  regex = "",
  typeFilters = [],
  filters,
  generation
} : QueryPokemonType) => {

  const _orTypes = `_or: {
    pokemon_v2_pokemontypes: {
      pokemon_v2_type: {
        _and: {
          name: {
            _in: [${typeFilters}]
          }
        }
      }
    }
  }`;

  const _andGenerations = `
    pokemon_v2_pokemongameindices: {
      version_id: {
        _eq: ${generation}
      }
    }
  `;

  const _regexName = `
    name: {
      _regex: "${regex.replace("?", ".")}"
    }
  `;

  const sortByName = () => {
    const { nameAsc, nameDesc } = filters;
    if (!nameAsc && !nameDesc ) return "";
    const order = nameAsc ? "asc_nulls_last" : "desc_nulls_last";
    return `name: ${order}`;
  }

  const sortByNumber = () => {
    const { numberAsc, numberDesc } = filters;
    if (!numberAsc && !numberDesc ) return "";
    const order = numberAsc ? "asc_nulls_last" : "desc_nulls_last";
    return `id: ${order}`;    
  }

  const orderBy = () => {
    const orderByName = sortByName();
    const orderByNumber = sortByNumber();
    return `order_by: { ${[orderByName, orderByNumber].join(" ")} }`;
  };

  return gql`
    query pokemons {
      pokemon: pokemon_v2_pokemon(limit: ${ limit }, offset:${ offset }, ${ orderBy() }, where: {
        _and:{
          order: {_gt: 0}
          is_default:{ _eq:true}
          ${regex && _regexName }
          ${generation && _andGenerations}
        },
        ${ typeFilters.length ? _orTypes : "" }
      }) {
        id
        name
        order
        height
        weight

        sprites: pokemon_v2_pokemonsprites(limit:1) {
          sprites
        }

        game_indices:	pokemon_v2_pokemongameindices(limit:100) {
          version: pokemon_v2_version {
            name
          }
        }

        stats: pokemon_v2_pokemonstats(limit:100) {
          stat : pokemon_v2_stat {
            name,
          }
          base_stat

        }
        types: pokemon_v2_pokemontypes(limit:1000) {
          type: pokemon_v2_type{
            name
          }
        }
      }
    }
  `
};

export const QUERY_POKEMON_TYPES = () => gql`
  query types {
    types: pokemon_v2_type(limit:1000){
      name
    }
  }
`;

export const QUERY_POKEMON_GENERATIONS = () => gql`
  query gameIndices {
    game_indices : pokemon_v2_version(limit:100) {
      id
      name
    }
  }
`;