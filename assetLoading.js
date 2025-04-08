async function loadImages(imagePaths, folderPathPrefix = 'sprite/') {
  const loadImage = (path) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image at ${path}`));
      img.src = path;
    });
  };

  const imagePromises = imagePaths.map(async (fileName) => {
    const fullPath = `${folderPathPrefix}${fileName}`;
    const img = await loadImage(fullPath);
    return { [fileName]: img }; // Return an object with file name as key and image as value
  });

  const loadedImages = await Promise.all(imagePromises);
  return Object.assign({}, ...loadedImages); // Merge all objects into a single one
}

