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
    nameFilter: string
    setMaxOfPokemonsType: Dispatch<SetStateAction<number>>   
    pokemonFilter: (name: string) => void;
    getAllPokemonsByType: (type: string) => void;
    getAllPokemons: () => void;
}

const PokemonContext = createContext({} as InitValue)

export const PokemonProvider = ({ children }: PokemonProviderProps) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([])
    const [nameFilter, setNameFilter] = useState<string>("")
    const [typeActual, setTypeActual] = useState("all")
    const [maxOfPokemonsType, setMaxOfPokemonsType] = useState<number>(10)
    const [loading, setLoading] = useState(false)

    const getAllPokemons = useCallback(async () => {
      const response = await api.get(`/pokemon?limit=${maxOfPokemonsType}&offset=0`)
        
      const payloadPokemons = await Promise.all(
        response.data.results.map(async (pokemon: Pokemon) => {
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
      setNameFilter("")

      if (type === "all") {
        setLoading(false)
        setMaxOfPokemonsType(10)
        getAllPokemons()
      }

      if (type !== "all") {
        setLoading(false)
        setMaxOfPokemonsType(10)
        const response = await api.get(`/type/${type}`)
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
    }, [getAllPokemons])

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
      setNameFilter(name)
      const filteredPokemons = []

      if (name === "") {
        if (typeActual !== "all") {
          getAllPokemonsByType(typeActual)
          return
        } else {
          setLoading(false)
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
      <PokemonContext.Provider value={{ pokemons, maxOfPokemonsType, loading, typeActual, nameFilter, pokemonFilter, getAllPokemonsByType, setMaxOfPokemonsType, getAllPokemons }}>
        {children}
      </PokemonContext.Provider>
    )
}

export default PokemonContext;