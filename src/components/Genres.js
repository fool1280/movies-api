import React from 'react'
import { Button } from 'react-bootstrap';

export default function Genres(props) {
    let genreTotal = props.genreList;
    console.log(genreTotal);
    return (
        <div>
            {genreTotal.map((item) => {
                return(
                    <Button variant="dark" className="m-2">{item.name}</Button>
                );
            })}
        </div>
    )
}
