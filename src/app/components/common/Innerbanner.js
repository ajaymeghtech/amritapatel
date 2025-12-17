import React from 'react'
import Image from "next/image";
import defaultBanner from "@/app/assets/images/campus-innerbanner.jpg";

const Innerbanner = ({title, image }) => {
      const imageSource = image || defaultBanner;
  return (
    <div>
      <div className="innerBanner">
         <Image src={imageSource} alt="about Innerbanner" width={1920} height={600} className="img-fluid innerbannerImage"  />
        <div className="container">
          <h2 className='innerBannerTitle'>{title}</h2>
        </div> 
      </div>
    </div> 
  )
}

export default Innerbanner