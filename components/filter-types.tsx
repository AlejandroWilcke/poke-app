import { Dispatch, SetStateAction, useState } from "react";
import { capitalizeFirstLetter } from "../utilities";

interface FilterTypesProps {
  types: [object];
  setFilters: Dispatch<SetStateAction<any>>;
}

export default function FilterTypes({ types, setFilters }: FilterTypesProps) {
  const toggleFilter = (filter: string) => {
    setFilters( (prevFilters: any) => {
      let newFilters = prevFilters.slice();
      let index = prevFilters.indexOf(filter);
      index === -1 ? newFilters.push(filter) : newFilters.splice(index, 1);
      return newFilters;
    });
  }
  return(
    <div>
      Types
      <ul>
        {types && types.map((e: any, i) => {
          const [isSelected, setIsSelected] = useState(false);
          return(
            <li
              key={i}
              onClick={() => {
                setIsSelected((previousState) => !previousState);
                toggleFilter(e.name);
              }}
              className={`bg-[${isSelected ? "#123456" : "#444444"}] inline-block border-2 border-blue-600 rounded-lg m-2 p-2 cursor-pointer hover:bg-[#111111]`}
            >
              <input className="m-3 hidden" type="checkbox" />
              <label className="text-sm cursor-pointer">{capitalizeFirstLetter(e.name)}</label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}