// components/ListItemContent/ListItemContent.js
export const ListItemContent = ({ content }) => {
  return (
    <span 
      className="text-base"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
