import React from 'react';

const Letter = props => ( 
  <div className={props.styles} >
    {props.value}
  </div>
);

export default Letter;