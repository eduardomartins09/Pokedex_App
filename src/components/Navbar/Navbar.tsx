import { useContext } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { pokemonTypeThemes } from '../../services/pokemon-type-theme';
import PokemonContext from '../../contexts/pokemonsContext'

import './Navbar.css'

const Navbar = () => {
  const { typeActual, pokemonFilter, getAllPokemonsByType } = useContext(PokemonContext)

  const location = useLocation()
  const navigate = useNavigate()
  
  const getTheColor = (typeColor: string) => {
    const color = pokemonTypeThemes.find(type => type.name === typeColor) 

    return color?.color
  }

  const comeBack = () => {
    getAllPokemonsByType(typeActual)
    navigate("/")
  }

  return (
    <nav>
      <div className='logo-and-select'>   
        <img src="/images/app-logo.png" alt="logo-pokedex" className='logoHomeSmall' />
        {location.pathname !== "/" && (
        <div 
          className="types-icon" 
          onClick={comeBack}
        >
          <div 
            className='divImg'          
            style={{ backgroundColor: "#FFF" }}
          >        
            <img 
              src="/images/arrowLeft.png" 
              alt="icon-nav" 
            />
          </div>         
          <p>
            Go back
          </p>                
        </div>
        )}
        {location.pathname === "/" && (
          <select value={typeActual} onChange={(e) => getAllPokemonsByType(e.target.value)}>
            <option value="all">All</option>
            {pokemonTypeThemes.map((type, key) => (
              <option 
                key={key} 
                value={type.name}
                style={{ backgroundColor: `${getTheColor(type.name)}` }}
              >
                {type.name}            
              </option>
            ))}
          </select> 
        )}
      </div>
      {location.pathname === "/" && typeActual !== "all"  && (
        <div>
          <input 
            type="text" 
            placeholder='Search Pokemon...'
            onChange={
              (e) => pokemonFilter(e.target.value)
            }
          />
        </div>
      )}           
    </nav>
  )
}

export default Navbar