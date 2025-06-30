// components/BlockRenderer/handlers.js
import Image from "next/image";
import { CallToActionButton } from "../CallToActionButton";
import { Column } from "../Column";
import { Columns } from "../Columns";
import { Cover } from "../Cover";
import { FormspreeForm } from "../FormspreeForm";
import { Gallery } from "../Gallery";
import { Heading } from "../Heading";
import { Paragraph } from "../Paragraph";
import { TickItem } from "../TickItem";
import { ListItem } from "../ListItem/ListItem";
import { ListItemContent } from "../ListItemContent/ListItemContent";
import { Images2Block } from "../Images2Block/Images2Block";
import { SliderBlock } from "../SliderBlock";
import { formatDoubleSliderBlock } from "../../utils/formatDoubleSliderBlock";
import { parseMenusFromFlatData } from "../../utils/parseFlatACF";
import CarteMenu from "../CarteMenu/CarteMenu";
import GalleryTabs from "../GalleryTabs/GalleryTabs";
import { ResponsiveDoubleSlider } from "../DoubleSlider/ResponsiveDoubleSlider";
import { getGalleryBlockData } from "../../utils/getGallery";



export const handlers = {
   "cosmopolite/galleryblock": async (block, index) => {
    const data = await getGalleryBlockData(block);
    console.log("📸 Enriched gallery block:", data);
    return (
      <GalleryTabs
        key={data.id || `galleryblock-${index}`}
        galleries={data.galleries}
        blocId={data.customId}
      />
    );
  },

  "cosmopolite/blockcartekmenu": (block, index) => {
    const data = block.attributes?.data || {};
    const parsedMenus = parseMenusFromFlatData(data);
    return (
      <div key={block.id || `carteblock-${index}`} className="w-full">
        <CarteMenu menus={parsedMenus} />
      </div>
    );
  },

  "acf/doublesliderblock": (block, index) => {
    const slides = formatDoubleSliderBlock(block);
    return <ResponsiveDoubleSlider key={block.id} slides={slides} />;
  },

  "acf/tickitem": (block, index, renderChildren) => {
    return (
      <TickItem key={block.id || `tickitem-${index}`}>
        {renderChildren(block.innerBlocks)}
      </TickItem>
    );
  },

  "core/gallery": (block, index) => {
    return (
      <Gallery
        key={block.id || `gallery-${index}`}
        columns={block.attributes.columns || 3}
        cropImages={block.attributes.imageCrop}
        items={block.innerBlocks}
      />
    );
  },

  "acf/formspreeform": (block, index) => (
    <FormspreeForm
      key={block.id || `formspree-${index}`}
      formId={block.attributes.data.form_id}
    />
  ),

  "acf/cta-button": (block, index) => (
    <CallToActionButton
      key={block.id || `cta-${index}`}
      buttonLabel={block.attributes.data.label}
      destination={block.attributes.data.destination || "/"}
      align={block.attributes.data.align}
      btnclass={block.attributes.data.invert}
    />
  ),

  "core/paragraph": (block, index) => (
    <Paragraph
      key={block.id || `paragraph-${index}`}
      textAlign={block.attributes.textAlign}
      content={block.attributes.content}
      customClasses={block.attributes.className || ""}
    />
  ),

  "core/post-title": (block, index) =>
    handlers["core/heading"](block, index),

  "core/heading": (block, index) => (
    <Heading
      key={block.id || `heading-${index}`}
      level={block.attributes.level}
      content={block.attributes.content}
      textAlign={block.attributes.textAlign}
    />
  ),

  "core/cover": (block, index, renderChildren) => (
    <Cover key={block.id || `cover-${index}`} background={block.attributes.url}>
      {renderChildren(block.innerBlocks)}
    </Cover>
  ),

  "core/columns": (block, index, renderChildren) => (
    <Columns
      key={block.id || `columns-${index}`}
      isStackedOnMobile={block.attributes.isStackedOnMobile}
      customId={block.attributes.metadata?.name}
    >
      {block.innerBlocks.map((innerBlock, i) =>
        renderChildren([{ ...innerBlock, index: i }])
      )}
    </Columns>
  ),

  "core/column": (block, index, renderChildren) => (
    <Column
      key={block.id || `column-${index}`}
      width={block.attributes?.width}
      index={block.index}
    >
      {renderChildren(block.innerBlocks)}
    </Column>
  ),

  "core/group": (block, index, renderChildren) =>
    renderChildren(block.innerBlocks),

  "core/block": (block, index, renderChildren) =>
    renderChildren(block.innerBlocks),

  "core/image": (block, index) => (
    <Image
      key={block.id || `image-${index}`}
      src={block.attributes.url}
      height={block.attributes.height}
      width={block.attributes.width}
      alt={block.attributes.alt || ""}
      className={block.attributes.className || ""}
    />
  ),

  "core/list": (block, index, renderChildren) => (
    <div key={block.id || `list-${index}`} className="space-y-2">
      <ul className="mb-8">{renderChildren(block.innerBlocks)}</ul>
    </div>
  ),

  "core/list-item": (block, index) => (
    <ListItem key={block.id || `list-item-${index}`} index={block.index}>
      <ListItemContent content={block.attributes.content} />
    </ListItem>
  ),

  "acf/contact-div": (block, index) => (
    <div
      key={block.id || `contactdiv-${index}`}
      id={block.attributes.data.id || ""}
      className={block.attributes.data.custom_class || ""}
    />
  ),

  "acf/images2block": (block, index) => {
    const data = block.attributes.data || {};
    const image1 = data.image1 || null;
    const image2 = data.image2 || null;
    return (
      <Images2Block
        key={block.id || `images2-${index}`}
        image1={image1}
        image2={image2}
      />
    );
  },

  "acf/mysliderblock": (block, index) => {
    const images = ["image1", "image2", "image3"]
      .map((key) => block.attributes.data?.[key])
      .filter(Boolean);
    return <SliderBlock key={block.id || `myslider-${index}`} images={images} />;
  },
};
