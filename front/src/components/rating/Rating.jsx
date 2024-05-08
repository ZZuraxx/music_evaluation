//rating
import { Rating, ThinStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { useState, useEffect } from "react";

export default function Rate({code, value}) {
    const [rating, setRating] = useState(0);

    const myStyles = {
        itemShapes: ThinStar,
        activeFillColor: '#ffb700',
        inactiveFillColor: '#fbf1a9'
      };
      return (
        <>
        <Rating  style={{ maxWidth: 300 }} value={rating} onChange={setRating} itemStyles={myStyles} />
        <input type='hidden' name={item.code} defaultValue={rating}/>
        </>
      )
}