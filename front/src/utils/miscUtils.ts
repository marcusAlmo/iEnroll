export function isMobile(){
  const width = screen.width;
  console.log("Screen width: ", width);

  // If screen is 480 px and below (mobile), return true
  return (width < 481);
};