export const relativeToAbsoluteUrls = (htmlString = "") => {
  //console.log('Input to relativeToAbsoluteUrls:', htmlString, typeof htmlString);

  if (typeof htmlString !== 'string') {
    //console.warn('relativeToAbsoluteUrls received a non-string value:', htmlString);
    return "";
  }

  const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
  //console.log('NEXT_PUBLIC_WP_URL:', wpUrl);
  
  if (!wpUrl) {
    //console.warn('NEXT_PUBLIC_WP_URL is not defined');
    return htmlString;
  }

  try {
    const result = htmlString.replaceAll(wpUrl, "");
    //console.log('Output of relativeToAbsoluteUrls:', result);
    return result;
  } catch (error) {
    //console.error('Error in relativeToAbsoluteUrls:', error);
    return htmlString;
  }
};