const Inventory = require('../models/inventoryModels');
const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'inventory-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'inventory.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Get all inventory
const inventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({}).sort({createdAt: -1});
        res.status(200).json(inventory);
        logger.info('Retrieved all inventory items');
    } catch (error) {
        logger.error('Error retrieving inventory items:', error);
        res.status(500).json({error: 'Server error'});
    }
};

// Get a single inventory
const getInventory = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error(`Invalid inventory ID: ${id}`);
        return res.status(404).json({error: 'No such inventory'});
    }

    try {
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            logger.error(`Inventory not found: ${id}`);
            return res.status(404).json({error: 'No such inventory'});
        }
        res.status(200).json(inventory);
        logger.info(`Retrieved inventory item: ${id}`);
    } catch (error) {
        logger.error(`Error retrieving inventory item ${id}:`, error);
        res.status(500).json({error: 'Server error'});
    }
};

// Create new inventory
const creatInventory = async (req, res) => {
    const {inveType, proName, quantity, exDate} = req.body;
    let emptyFields = [];

    if (!inveType) emptyFields.push('inveType');
    if (!proName) emptyFields.push('proName');
    if (!quantity) emptyFields.push('quantity');
    if (!exDate) emptyFields.push('exDate');

    if (emptyFields.length > 0) {
        logger.warn(`Attempted to create inventory with empty fields: ${emptyFields.join(', ')}`);
        return res.status(400).json({error: "Please fill in all the fields", emptyFields});
    }

    try {
        const inventory = await Inventory.create({inveType, proName, quantity, exDate});
        res.status(200).json(inventory);
        logger.info(`Created new inventory item: ${inventory._id}`);
    } catch (error) {
        logger.error('Error creating inventory item:', error);
        res.status(400).json({error: error.message});
    }
};

// Delete a inventory
const deleteInventory = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error(`Attempted to delete invalid inventory ID: ${id}`);
        return res.status(404).json({error: 'No such inventory'});
    }

    try {
        const inventory = await Inventory.findOneAndDelete({_id: id});
        if (!inventory) {
            logger.error(`Attempted to delete non-existent inventory: ${id}`);
            return res.status(404).json({error: 'No such inventory'});
        }
        res.status(200).json(inventory);
        logger.info(`Deleted inventory item: ${id}`);
    } catch (error) {
        logger.error(`Error deleting inventory item ${id}:`, error);
        res.status(500).json({error: 'Server error'});
    }
};

// Update a inventory
const updateInventory = async (req, res) => {
    const {id} = req.params;
    const {inveType, proName, quantity, exDate} = req.body;

    let emptyFields = [];
    if (!inveType) emptyFields.push('inveType');
    if (!proName) emptyFields.push('proName');
    if (!quantity) emptyFields.push('quantity');
    if (!exDate) emptyFields.push('exDate');

    if (emptyFields.length > 0) {
        logger.warn(`Attempted to update inventory with empty fields: ${emptyFields.join(', ')}`);
        return res.status(400).json({error: "Please fill in all the fields", emptyFields});
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error(`Attempted to update invalid inventory ID: ${id}`);
        return res.status(404).json({error: 'No such inventory'});
    }

    try {
        const inventory = await Inventory.findOneAndUpdate({_id: id}, {
            ...req.body
        }, {new: true});

        if (!inventory) {
            logger.error(`Attempted to update non-existent inventory: ${id}`);
            return res.status(404).json({error: 'No such inventory'});
        }

        res.status(200).json(inventory);
        logger.info(`Updated inventory item: ${id}`);
    } catch (error) {
        logger.error(`Error updating inventory item ${id}:`, error);
        res.status(500).json({error: 'Server error'});
    }
};

module.exports = {
    inventory,
    getInventory,
    creatInventory,
    deleteInventory,
    updateInventory
};