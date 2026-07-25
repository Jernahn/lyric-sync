export const getAverageColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        const hex = `#${[data[0], data[1], data[2]].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
        resolve(hex);
      } else {
        resolve('#1db954');
      }
    };
    img.onerror = () => resolve('#1db954');
    img.src = imageUrl;
  });
};

export const downloadImage = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  return response.blob();
};

export const imageToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
