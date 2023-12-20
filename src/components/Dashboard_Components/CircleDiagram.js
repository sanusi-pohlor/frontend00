import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const CircleDiagram = ({ percentage }) => {
    // Ensure that percentage is between 0 and 100
    const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);
  
    // Determine the color of the circle based on the percentage
    const color = normalizedPercentage >= 50 ? "primary" : "secondary";
  
    // If you want to customize the thickness of the circle, you can set the thickness prop
    // const thickness = 10; // Specify your desired thickness value in pixels
  
    return (
      <CircularProgress  size={300} 
        variant="determinate"
        value={normalizedPercentage}
        color={color}
        // thickness={thickness} // Uncomment this line to set custom thickness
      />
    );
  };
  export default CircleDiagram;
  