import React, { useEffect, useState } from "react";
import { Carousel as AntCarousel } from "antd";

const Carousel = () => {
  const [dataimage, setDataimage] = useState([]);
  const getDbimage = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Dbimage_request"
      );
      if (response.ok) {
        const data = await response.json();
        setDataimage(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getDbimage();
  }, []);
  return (
    <AntCarousel autoplay>
      {dataimage.image0 && (
        <div>
          <img
            src={dataimage.image0}
            alt="Carousel1"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
      {dataimage.image1 && (
        <div>
          <img
            src={dataimage.image1}
            alt="Carousel2"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
      {dataimage.image2 && (
        <div>
          <img
            src={dataimage.image2}
            alt="Carousel3"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
      {dataimage.image3 && (
        <div>
          <img
            src={dataimage.image3}
            alt="Carousel4"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
      {dataimage.image4 && (
        <div>
          <img
            src={dataimage.image4}
            alt="Carousel5"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </AntCarousel>
  );
};

export default Carousel;
