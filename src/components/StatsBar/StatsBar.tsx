import { PokemonStat } from '../../types/types'

import './StatsBar.css'

type Props = {
    data?: PokemonStat[]
}

const StatsBar = ({ data }: Props) => { 
  const getProgressBar = (stat: number) => {
    if (stat >= 100) {
        return 100
    } else {
        return stat
    }
  }
    
  return (
    <div>
        {data?.map((stats, key) => (
            <div className="skill-box" key={key}>
                <span className="title">{stats.stat.name}</span>
                <div className="skill-bar">
                    <span 
                        className="skill-per"
                        style={{
                            width: `${getProgressBar(stats.base_stat)}%`
                        }}
                    >
                        <span className="tooltip">{stats.base_stat}</span>
                    </span>
                </div>
            </div>
        ))}
    </div>
  )
}

export default StatsBar