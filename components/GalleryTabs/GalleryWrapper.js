"use client";

import { useEffect, useState } from "react";
import GalleryTabs from "./GalleryTabs";
import { getGalleryBlockData } from "../../utils/getGallery";

const GalleryWrapper = ({ block }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const formatted = await getGalleryBlockData(block);
      setData(formatted);
    };
    load();
  }, [block]);

  if (!data) return null;

  return (
    <GalleryTabs galleries={data.galleries} blocId={data.customId} />
  );
};

export default GalleryWrapper;
