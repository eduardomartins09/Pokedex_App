type PokemonMoveName = {
    name: string
}

type PokemonMove = {
    move: PokemonMoveName
    url: string
    name: string
}

type PokemonAbilitie = {
    url: string
}

type FetchPokemonType = {
    url: string
    name: string
}

type PayloadPokemonsMovesType = {
    name: string
    type: PokemonTypeName
}

type PayloadPokemonsAbilities = {
    name: string
    effect: string
}
  
export type Pokemon = {
    pokemon: FetchPokemonType
    name: string
    url: string
    id: number
    height: number
    types: PokemonType[]
    type: PokemonType[]
    payloadPokemonsMovesType: PayloadPokemonsMovesType[]
    payloadPokemonsAbilitiesAndInfo: PayloadPokemonsAbilities[]
    sprites: any
    stats: PokemonStat[]
    move: PokemonMove
    moves: PokemonMove[]
    abilities: PokemonAbilitie[]
    effect: string
    ability: PokemonAbilitie
}
  
export type Request = {
    id: number
    height: number
    sprites: []
    types: PokemonType[]
    stats: PokemonStat[]
    moves: PokemonMove[]
    abilities: PokemonAbilitie[]
}

export type PokemonTypeName = {
    type: string
    name: string
}

export type PokemonType = {
    type: PokemonTypeName
}

export type PokemonStat = {
    stat: PokemonMoveName
    base_stat: number
}