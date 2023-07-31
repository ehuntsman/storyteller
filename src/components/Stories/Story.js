import React from 'react'
import { useParams, Link } from 'react-router-dom';


export default function Story() {
  const { id } = useParams();
  return (
    <div>
        <Link to={`/story/${id}/settings`}>Story Settings</Link>
        {/* <h5>{Story.storyname}</h5> */}
    </div>
  )
}
