import './Loading.css'

type Props = {
  text: string
}

const Loading = ({ text }: Props) => {
  return (
    <div className="loading">
        <img src="/images/loading-pokeball.gif" alt="loading-pokeball" width="128px" />
        <p>{text}</p>
    </div>
  )
}

export default Loading