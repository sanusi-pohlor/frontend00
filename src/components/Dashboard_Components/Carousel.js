import React from "react";
import { Carousel as AntCarousel } from "antd";
import Carousel1 from "./image/Carousel1.jpg";
import Carousel2 from "./image/Carousel2.jpg";
import Carousel3 from "./image/Carousel3.jpg";

const Carousel = () => {
  return (
    <AntCarousel autoplay>
      <div>
        <img
          src={Carousel1}
          alt="Carousel1"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div>
        <img
          src={Carousel2}
          alt="Carousel2"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div>
        <img
          src={Carousel3}
          alt="Carousel3"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </AntCarousel>
  );
};

export default Carousel;
