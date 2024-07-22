import React from "react";
import Track from "../Track/Track.js";
import styles from "./Tracklist.module.css";


function Tracklist(props) {
    return (
        <div className={styles.TrackList}>
        {/* <!-- You will add a map method that renders a set of Track components  --> */}
        {props.userSearchResults.map((track)=>(
          <Track 
            track={track} 
            key={track.id} 
            onAdd={props.onAdd} 
            isRemoval={props.isRemoval}
            onRemove={props.onRemove}/>
        ))}

      </div>
    );
}

export default Tracklist;