export const generateColors = (n) => {
  const getRandomColor = () => {
    const randomHex = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    return `#${randomHex()}${randomHex()}${randomHex()}`;
  };

  return Array.from({ length: n }, () => getRandomColor());
};
