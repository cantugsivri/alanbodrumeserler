import fallbackArtworks from '../assets/artworks.json';

// LocalStorage key for saving Google Sheet CSV URL
const SHEET_URL_KEY = 'alan_art_sheet_csv_url';

// Google Sheets CSV URL (canlı veri kaynağı)
const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzRj1L8E6FZO5vJc_2qlr-6m4QFv2Z5dvUNf2Qm_CebTuhBh9ygkM2yNfybW77GAYoRKmSDCFuGaDA/pub?gid=167229547&single=true&output=csv';


/**
 * Parses raw CSV text into a list of objects based on header fields.
 * Handles comma-separated values, double quotes, and line breaks correctly.
 * @param {string} text 
 * @returns {Array<Object>}
 */
export function parseCSV(text) {
  if (!text) return [];
  
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        // Escaped quote inside quotes
        row[row.length - 1] += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      // New column
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      // New row (handle \r\n by skipping \n if previous was \r)
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }

  if (lines.length < 2) return [];

  // Extract headers
  const headers = lines[0].map(h => h.trim().toLowerCase());
  
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const currentRow = lines[i];
    if (currentRow.length < headers.length) continue; // skip incomplete rows
    
    const obj = {};
    let hasData = false;
    
    headers.forEach((header, index) => {
      const val = (currentRow[index] || "").trim();
      if (val) hasData = true;
      
      // Data type casting
      if (header === 'id' || header === 'price_tl' || header === 'price_eur') {
        const numVal = parseInt(val.replace(/[^\d]/g, ''), 10);
        obj[header] = isNaN(numVal) ? 0 : numVal;
      } else {
        obj[header] = val;
      }
    });

    if (hasData && obj.artwork_name) {
      // Add a default status if missing
      if (!obj.status) obj.status = 'active';
      results.push(obj);
    }
  }

  return results;
}

/**
 * Gets the configured Google Sheet CSV URL from local storage.
 * @returns {string}
 */
export function getSavedSheetURL() {
  return localStorage.getItem(SHEET_URL_KEY) || DEFAULT_SHEET_URL;
}

/**
 * Saves the Google Sheet CSV URL to local storage.
 * @param {string} url 
 */
export function saveSheetURL(url) {
  if (url) {
    localStorage.setItem(SHEET_URL_KEY, url.trim());
  } else {
    localStorage.removeItem(SHEET_URL_KEY);
  }
}

/**
 * Fetches artworks from Google Sheets or falls back to local JSON database.
 * @returns {Promise<Array<Object>>}
 */
export async function fetchArtworks() {
  const sheetURL = getSavedSheetURL();
  
  if (!sheetURL) {
    console.log("No Google Sheet CSV URL configured. Using local high-fidelity database (95 artworks).");
    return fallbackArtworks;
  }

  try {
    console.log(`Fetching live artworks from: ${sheetURL}`);
    const response = await fetch(sheetURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);
    
    if (parsedData && parsedData.length > 0) {
      console.log(`Successfully fetched and parsed ${parsedData.length} artworks from Google Sheets.`);
      return parsedData;
    } else {
      console.warn("Parsed Google Sheets CSV is empty. Falling back to local database.");
      return fallbackArtworks;
    }
  } catch (error) {
    console.error("Error fetching live data from Google Sheets:", error);
    console.log("Falling back to local high-fidelity database (95 artworks).");
    return fallbackArtworks;
  }
}
