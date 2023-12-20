import React from "react";
import { Paper } from "@mui/material";

const Carousel = () => {
  const curveAngle = 20;
  const paperColor = "#FFFFFF";

  return (
<Paper
  elevation={0}
  style={{
    width: "100%",
    height:"100%",
  }}
>
  <img src="https://niubox.legal/wp-content/uploads/2021/09/Recurso-210.jpg" alt="Your Image" style={{ width: '100%', height: '100%' }} />
</Paper>

  );
};

export default Carousel;
