import { useContext } from 'react'

import PokemonCard from '../../components/PokemonCard/PokemonCard'
import PokemonContext from '../../contexts/pokemonsContext'
import Loading from '../../components/Loading/Loading'

import './Home.css'

const Home = () => {
  const { pokemons, maxOfPokemonsType, loading, nameFilter, setMaxOfPokemonsType  } = useContext(PokemonContext)

  return (
    <>
      {loading 
        ? (         
          <div className='container'>
            <div className='container-scroll'>
              {pokemons &&
                pokemons.slice(0, maxOfPokemonsType).map((pokemon) => (
                  <PokemonCard 
                    key={pokemon.id} 
                    nome={pokemon.name} 
                    types={pokemon.types} 
                    img={
                      pokemon.sprites.versions['generation-v']['black-white']['animated']['front_default'] 
                      ? pokemon.sprites.versions['generation-v']['black-white']['animated']['front_default']
                      : pokemon.sprites['other']['official-artwork']['front_default']
                    } 
                    id={pokemon.id} 
                  /> 
                ))
              }
              {maxOfPokemonsType < 1280 && (
                <div className='button-div'>
                  <button 
                    disabled={nameFilter !== "" ? true : false} 
                    onClick={() => setMaxOfPokemonsType(maxOfPokemonsType+10)}
                  >
                    Load more
                  </button>   
                </div>
              )}  
            </div>
          </div>          
        ) 
        : (
          <div className='container'>
            <Loading text='Loading...' />
            <Loading text='Loading...' />
          </div>
        )
      }     
    </>
  )
}

export default Home