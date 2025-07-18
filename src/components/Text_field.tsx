import { TextField } from '@mui/material'
import React from 'react'
 
interface textdata{
    lable:string,
    name:string,
    value:string,
    // functionvalue:string
    
}


const Textfield=({lable,name,value}:textdata)=> {
  return (
<TextField
          fullWidth
          label={lable}
          name={name}
          value={value}
          margin="normal"
        />
  )
}

export default Textfield
