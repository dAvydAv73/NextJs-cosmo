import { v4 as uuid } from "uuid";

export const cleanAndTransformBlocks = (blocks) => {
  //console.log('cleanAndTransformBlocks input:', JSON.stringify(blocks, null, 2));

  if (!Array.isArray(blocks)) {
    //console.error('Input is not an array:', blocks);
    return [];
  }

  const assignId = (b) => {
    return b.map((block) => {
      if (typeof block !== 'object') {
        //console.error('Invalid block:', block);
        return null;
      }

      const newBlock = {
        ...block,
        id: uuid(),
      };

      if (newBlock.attributes?.url) {
        newBlock.attributes.url = newBlock.attributes.url.replace("https", "http");
      }

      if (newBlock.attributes) {
        //console.log('Block attributes:', JSON.stringify(newBlock.attributes, null, 2));
        if ('classesTailwind' in newBlock.attributes) {
          //console.log('classesTailwind:', newBlock.attributes.classesTailwind);
        }
      }

      if (Array.isArray(newBlock.innerBlocks)) {
        newBlock.innerBlocks = assignId(newBlock.innerBlocks);
      }

      return newBlock;
    }).filter(Boolean); // Remove any null blocks
  };

  const transformedBlocks = assignId(blocks);
  //console.log('Transformed blocks:', JSON.stringify(transformedBlocks, null, 2));
  return transformedBlocks;
};