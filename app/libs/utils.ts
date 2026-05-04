export const isMobile = (str: string): boolean => {
  //const regex = new RegExp('^09[0-9]\\d{8}$');
  return /^(09\d{9}|9\d{9})$/.test(str);
};

export async function convertImageToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}
