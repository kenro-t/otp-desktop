export const useCopyToClipboard = () => {
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code.replace(/ /g, ""));
  };

  return { handleCopy };
};
