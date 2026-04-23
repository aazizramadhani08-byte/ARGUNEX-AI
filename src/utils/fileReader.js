import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

// Setup PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const processFile = async (file) => {
  const fileExt = file.name.split('.').pop().toLowerCase();
  
  try {
    if (fileExt === 'pdf') {
      return await readPDF(file);
    } else if (['xlsx', 'xls', 'csv'].includes(fileExt)) {
      return await readExcel(file);
    } else if (['docx'].includes(fileExt)) {
      return await readWord(file);
    } else if (['png', 'jpg', 'jpeg'].includes(fileExt)) {
      return await readImage(file);
    } else {
      return await readText(file);
    }
  } catch (error) {
    console.error("Error processing file:", error);
    return `Error reading file ${file.name}: ` + error.message;
  }
};

const readPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  // Extract max 3 pages to save time for prototype
  const pagesToRead = Math.min(3, pdf.numPages);
  for (let i = 1; i <= pagesToRead; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    text += textContent.items.map(item => item.str).join(' ') + '\n';
  }
  return text.substring(0, 1500) + '... [Parsed via PDF.js]';
};

const readExcel = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);
  return `Dataset extracted: ${json.length} rows. \nSample data: ${JSON.stringify(json.slice(0, 3))} ... [Parsed via SheetJS]`;
};

const readWord = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.substring(0, 1500) + '... [Parsed via Mammoth.js]';
};

const readImage = async (file) => {
  // Read using Tesseract OCR
  const objectUrl = URL.createObjectURL(file);
  try {
    const { data: { text } } = await Tesseract.recognize(objectUrl, 'ind+eng');
    return text.substring(0, 1500) + '... [Parsed via Tesseract.js OCR]';
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const readText = async (file) => {
  return await file.text();
};
