/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect } from "react";

function ImageWithLoader({ url, classes, loaderClasses, ...rest }: any) {
  const [imageLoading, setImageLoading] = useState(true);
  const imgRef = useRef<any>({});

  useEffect(() => {
    const imgElement = imgRef.current;

    if (imgElement && imgElement.complete) {
      // If the image is already loaded (including from cache)
      setImageLoading(false);
    }
  }, []);

  return (
    <>
      {imageLoading && (
        <div className={"w-full h-full glass-effect " + loaderClasses}>
          <span></span>
          <span></span>
        </div>
      )}
      <img
        ref={imgRef}
        alt=""
        {...rest}
        src={url}
        className={`${classes} ${imageLoading ? "invisible" : ""}`}
        onLoad={() => setImageLoading(false)}
      />
    </>
  );
}

export default ImageWithLoader;
