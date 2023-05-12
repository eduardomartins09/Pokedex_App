import { useNavigate } from "react-router-dom";
import { PokemonType } from "../../types/types"; 
import { AddLeadingZeros } from "../../services/api";

import './PokemonCard.css'

type PokemonCardProps = {
  nome: string
  types: PokemonType[]
  img: string
  id: number
}

const PokemonCard = ({ nome, types, img, id }: PokemonCardProps) => {
  const navigate = useNavigate()  

  const typeHandler = (types:PokemonType[]) => {
    if (types[1]) {
      return types[0].type.name + " | " + types[1].type.name      
    }

    return types[0].type.name
  }
  
  return (
      <div className="pokemon" onClick={() => navigate(`/pokemonDetails/${id}`)}>
        <div className="pokemon-img-container">
          <div className="img-container">
            {img 
              ? (
                <img src={img} alt="img-pokemon" />
              )
              : (
                <img src="/images/loading-pokeball.gif" style={{ width: "55px" }} alt="img-rolling-pokeball" />
              )
            }
          </div>
        </div>
        <div className="info">
          <span className='number'>#{AddLeadingZeros(id)}</span>
          <h3 className='name'>{nome}</h3>
          <small className="type">
            Type: <span> {typeHandler(types)}</span>
          </small>
        </div>
      </div>  
  )
}

export default PokemonCard