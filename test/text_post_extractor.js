const { createExtractedSlikPengurusData } = require("../src/services/extracted_slikService");
const db = require('../src/models');
const payload = require('../pengurus_input.json'); // contoh


(async () => {
  const result = await createExtractedSlikPengurusData(payload);
  console.log('Hasil:', result);
})();
