import { createContext, useState, useEffect, useCallback, ReactNode, SetStateAction, Dispatch } from "react";
import { Pokemon, Request } from "../types/types";
import api from "../services/api";

type PokemonProviderProps = {
  children: ReactNode
}

type InitValue = {
    pokemons: Pokemon[]
    maxOfPokemonsType: number
    loading: boolean
    typeActual: string
    setMaxOfPokemonsType: Dispatch<SetStateAction<number>>   
    pokemonFilter: (name: string) => void;
    getAllPokemonsByType: (type: string) => void;
    getAllPokemons: () => void;
}

const PokemonContext = createContext({} as InitValue)

export const PokemonProvider = ({ children }: PokemonProviderProps) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([])
    const [typeActual, setTypeActual] = useState("all")
    const [maxOfPokemonsType, setMaxOfPokemonsType] = useState<number>(10)
    const [loading, setLoading] = useState(false)

    const getAllPokemons = useCallback(async () => {
      const response = await api.get(`/pokemon?limit=${maxOfPokemonsType}&offset=0`)
      const { results } = response.data
  
      const payloadPokemons = await Promise.all(
        results.map(async (pokemon: Pokemon) => {
          const { id, height, sprites, types, stats, moves, abilities } = await getMoreInfo(pokemon.url)
        
          return {
            name: pokemon.name,
            id,
            types,
            height, 
            sprites, 
            stats, 
            moves,  
            abilities
          }
        })
      )
      
      setPokemons(payloadPokemons) 
      setLoading(true) 
    }, [maxOfPokemonsType])

    const getAllPokemonsByType = useCallback(async (type: string) => {                 
      setTypeActual(type)

      if (typeActual === "all") {
        getAllPokemons()
      }

      if (type !== typeActual) { 
        setLoading(false)
        setMaxOfPokemonsType(10)
      }

      if (typeActual !== "all") {
        const response = await api.get(`/type/${typeActual}`)
        const { pokemon } = response.data
        
        const payloadPokemons = await Promise.all(
          pokemon.map(async (pokemon: Pokemon) => {
            const { id, height, sprites, types, stats, moves, abilities } = await getMoreInfo(pokemon.pokemon.url)
          
            return {
              name: pokemon.pokemon.name,
              id,
              types,
              height, 
              sprites, 
              stats, 
              moves,  
              abilities
            }
          })
        )
        setLoading(true)
        setPokemons(payloadPokemons)
      }  
    }, [typeActual, getAllPokemons])

    useEffect(() => {      
      if (typeActual === "all")    {      
        getAllPokemons()         
      }

      if (typeActual !== "all")    {
        getAllPokemonsByType(typeActual)
      }
    }, [getAllPokemons, getAllPokemonsByType, typeActual])
   
    const getMoreInfo = async (url: string): Promise<Request> => {
      const response = await api.get(url)
      
      const { id, types, height, sprites, stats, moves, abilities } = response.data
      
      return { id, types, height, sprites, stats, moves, abilities  }
    }
  
    const pokemonFilter = (name: string) => {
      const filteredPokemons = []

      if (name === "") {
        if (typeActual !== "all") {
          getAllPokemonsByType(typeActual)
          return
        } else {
          getAllPokemons() 
        }        
      }

      for (const i in pokemons) {
        if (pokemons[i].name.includes(name.toLowerCase())) {
            filteredPokemons.push(pokemons[i])
        }
      }

      setPokemons(filteredPokemons)  
    }

    return (
      <PokemonContext.Provider value={{ pokemons, maxOfPokemonsType, loading, typeActual, pokemonFilter, getAllPokemonsByType, setMaxOfPokemonsType, getAllPokemons }}>
        {children}
      </PokemonContext.Provider>
    )
}

export default PokemonContext;