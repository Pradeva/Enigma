const { error } = require('winston');
const {createExtractedSlikData, createExtractedSlikPengurusData} = require('../services/extracted_slikService');
const logger = require('../utils/logger');

exports.createExtractedSlikDataNasabah = async (req, res) => {
    const data = req.body;
    try {
        const hasilSlik = await createExtractedSlikData(data);
        if(hasilSlik["success"] == false) {
            throw new error(hasilSlik["error"]);
        }
        res.status(201).json(hasilSlik);
    } catch (error) {
        logger.error('Error in createNasabah controller', error);
        res.status(500).send("internal server error");
    }
}

exports.createExtractedSlikDataPengurus = async (req, res) => {
    const data = req.body;
    try {
        const hasilSlik = await createExtractedSlikPengurusData(data);
        if(hasilSlik["success"] == false) {
            throw new error(hasilSlik["error"]);
        }
        res.status(201).json(hasilSlik);
    } catch (error) {
        logger.error('Error in createNasabah controller', error);
        res.status(500).send("internal server error");
    }
}