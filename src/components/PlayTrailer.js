import React from 'react'
import YouTube from '@u-wave/react-youtube';
import './PlayTrailer.css';

//w: 960, h:540


export default function PlayTrailer(props) {
    if (props.id === null) {
        return(
            <div>
                Loading...
            </div>
        )
    }
    console.log(props.id);
    return (
        <div>
            <button className="mb-2" style={{display: "block"}} onClick={() => props.close()}>Close</button>
            <div className="trailer" style={{height: `${props.id.length*480}px`}}>
            {props.id.map((item) => {
                return <YouTube className="m-2" key={item.id} video={item.key} width="64%" height="540px" style={{display: "block"}}></YouTube>
            })}
            </div>
        </div>
    )
}
