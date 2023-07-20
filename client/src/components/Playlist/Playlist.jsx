import "./Playlist.css";

const Playlist = (props) => {
    return (
        <div className="Playlist">
            {props.playlist.map((track) => {
                return (
                    <div className="track">
                        <img src={track.cover} alt="song cover"/>
                        <div className="trackInfo">
                            <h1>{track.trackName}</h1>
                            <p>{track.artist}</p>
                        </div>
                    </div>
                )
            })}

        </div>
    )
}

export default Playlist;