import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'

import { Pokemon } from '../../types/types';

import { pokemonTypeThemes } from '../../services/pokemon-type-theme';
import api, { AddLeadingZeros } from '../../services/api';

import Loading from '../../components/Loading/Loading';
import StatsBar from '../../components/StatsBar/StatsBar';

import './PokemonDetails.css'

const PokemonDetails = () => {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState<number>(1)
  const [date, setDate] = useState<Pokemon>()
  const [loading, setLoading] = useState(false)
  
  const getPokemonByIdN = useCallback(async (id: number) => {
    const response = await api.get(`/pokemon/${id}`)
    const dadosApi = response.data
        
    const payloadPokemonsMovesType = await Promise.all(
      response.data.moves.map(async (moveAndType: Pokemon) => {
        const { type, name }  = await getMoreInfoMovesAndType(moveAndType.move.url)
       
        return {
          type, 
          name
        }
      })
    )

    const payloadPokemonsAbilitiesAndInfo = await Promise.all(
      response.data.abilities.map(async (abilitiesAndInfo: Pokemon) => {
        const { name, effect }  = await getMoreInfoAbilitiesAndInfos(abilitiesAndInfo.ability.url)
     
        return {
          name,           
          effect
        }
      })
    )

    setDate({ ...dadosApi, payloadPokemonsMovesType, payloadPokemonsAbilitiesAndInfo  }) 
    setLoading(true)
  }, [])
  
  const getMoreInfoMovesAndType = async (url: string): Promise<Partial<Pokemon>> => {
    const response = await api.get(url) 
  
    const { type, name } = response.data
    return { type, name } 
  }

  const getMoreInfoAbilitiesAndInfos = async (url: string): Promise<Partial<Pokemon>> => {
    const response = await api.get(url) 
    const { name } = response.data

    if (response.data.effect_entries.length === 0) return { name }

    if (response.data.effect_entries[1] === undefined) {
      const { effect } = response.data.effect_entries[0]
      return { name, effect }
    }
     
    const { effect } = response.data.effect_entries[1]

    return { name, effect  } 
  }

  useEffect(() => {
    getPokemonByIdN(Number(id))
  }, [id, getPokemonByIdN])

  const changeTab = (index: number) => {
    setCurrentTab(index)
  }

  const getTheColor = (typeColor: string) => {
    const color = pokemonTypeThemes.find(type => type.name === typeColor) 

    return color?.radialColor_1
  }

  const getTheColorType = (iconColor: string) => {
    const color = pokemonTypeThemes.find(type => type.name === iconColor) 

    return color?.icon
  }

  const getTheImg = () => {
    if (date?.sprites['other']['official-artwork']['front_default'] !== null) {
      return date?.sprites['other']['official-artwork']['front_default']
    }

    if (date?.sprites.front_default !== null) {
      return date?.sprites.front_default
    } else {
      return "/images/loading-pokeball.gif"
    }
  }

  return (
    <>
      {loading 
        ? (
          <>
            <div className='container-center'>
              <div className='box-left'>
                <div 
                  className='img-left'
                  style={{ 
                    backgroundColor: `${
                      date?.types[0] ? getTheColor(date?.types[0].type.name) : '#1B9784'                 
                    }`
                  }}
                >
                  <img src={getTheImg()} alt="img-pokemon" />
                </div>
                <div className="info-left">
                  <h6>
                    {date?.name && (
                      date.name
                    )}
                  </h6>
                  <h6>#{AddLeadingZeros(Number(id))}</h6>
                </div>
                <div className="types-left">
                  <div 
                    className="types-icon" 
                    style={{ 
                      backgroundColor: `${
                        date?.types[0] ? getTheColor(date.types[0].type.name) : '#1B9784'                 
                      }`
                      }}
                  >
                    <div 
                      className='divImg'          
                      style={{ 
                        backgroundColor: `${
                          date?.types[0] ? getTheColor(date.types[0].type.name) : '#1B9784'                 
                        }` 
                      }}
                    >
                      <img 
                        src={date?.types[0] ? `${getTheColorType(date.types[0].type.name)}` : ''} 
                        alt="icon-type-pokemon" 
                      />
                    </div>
                    <p>
                      {date?.types[0] && (
                        date.types[0].type.name
                      )}
                    </p>
                  </div>  
                  {date?.types[1] && (
                    <div 
                      className="types-icon"
                      style={{ 
                        backgroundColor: `${
                          date?.types[1] ? getTheColor(date.types[1].type.name) : '#1B9784'                 
                        }`
                      }}
                    >
                      <div className='divImg'>
                        <img 
                          src={date?.types[1] ? `${getTheColorType(date.types[1].type.name)}` : ''} 
                          alt="icon-type-pokemon" 
                        />
                      </div>
                      <p>
                        {date?.types[1] && (
                          date.types[1].type.name
                        )}
                      </p>
                    </div>   
                  )}
                </div>
              </div>
              <div className="box-right">
                <div className="tabs">
                  <div 
                    onClick={() => changeTab(1)} 
                    className={`${currentTab === 1 ? 'tab active-tab' : 'tab'}`}
                  >
                    Stats
                  </div>
                  <div 
                    onClick={() => changeTab(2)} 
                    className={`${currentTab === 2 ? 'tab active-tab' : 'tab'}`}
                  >
                    Moves
                  </div>
                  <div 
                    onClick={() => changeTab(3)} 
                    className={`${currentTab === 3 ? 'tab active-tab' : 'tab'}`}
                  >
                    Abilities
                  </div>                
                </div>
                <div className="contents">
                  <div 
                    className={`${currentTab === 1 ? 'content active-content-abitilities_stats' : 'content'}`}
                  >                           
                    <StatsBar data={date?.stats} />                        
                  </div>
                  <div 
                    className={`${currentTab === 2 ? 'content active-content-moves' : 'content'}`}
                  >
                    {date?.payloadPokemonsMovesType.map((moves, key) => (             
                      <div className="types-icon" key={key}>
                        <div 
                          className='divImg' 
                          style={{ 
                            backgroundColor: `${
                              getTheColor(moves.type.name)               
                            }` 
                          }}
                        >
                          <img 
                            src={
                              getTheColorType(moves.type.name)
                            } 
                            alt="icon-move" 
                          />
                        </div>               
                          <p >
                            {moves.name}
                          </p>
                      </div>
                    ))}            
                  </div>
                  <div 
                    className={`${currentTab === 3 ? 'content active-content-abitilities_stats' : 'content'}`}
                  >            
                  {date?.payloadPokemonsAbilitiesAndInfo.map((abilities, key) => (
                    <div key={key}>
                      <h3>
                        {abilities.name === undefined 
                          ? "Not Found" 
                          : abilities.name
                        }
                      </h3>
                      <p>
                        {abilities.effect === undefined 
                          ? "Not Found" 
                          : abilities.effect
                        }
                      </p>                    
                    </div>
                  ))}           
                  </div>                
                </div>
              </div>
            </div>
          </>
        ) 
        : (
          <>
            <Loading text='Loading...' />
            <Loading text='Loading...' />
            <Loading text='Loading...' />
          </>
        )    
      }   
    </>
  )
}

export default PokemonDetails