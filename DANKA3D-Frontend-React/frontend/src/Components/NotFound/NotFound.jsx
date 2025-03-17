import React from 'react';
import { ImSad2 } from "react-icons/im";
import './NotFound.css'

const NotFound = () => {
  return <div> <h1>404 - Nincs találat! <span className='h1-icon'>
      <ImSad2 />
  </span> </h1>
  </div>;
};

export default NotFound;