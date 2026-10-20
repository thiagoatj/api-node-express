const aircraftRepo = require('../repositories/aircraftRepository');
const passengerRepo = require('../repositories/passengerRepository');
const flightRepo = require('../repositories/flightRepository');
const boardingPassRepo = require('../repositories/boardingPassRepository');

async function getAircraft(req, res, next) {
  try {
    const data = await aircraftRepo.findAll();
    res.json(data);
  } catch (err) { next(err); }
}

async function getAircraftById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'ID inválido.' });
    const item = await aircraftRepo.findById(id);
    if (!item) return res.status(404).json({ erro: 'Aeronave não encontrada.' });
    res.json(item);
  } catch (err) { next(err); }
}

async function getPassengers(req, res, next) {
  try {
    const data = await passengerRepo.findAll();
    res.json(data);
  } catch (err) { next(err); }
}

async function getPassengerById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'ID inválido.' });
    const item = await passengerRepo.findById(id);
    if (!item) return res.status(404).json({ erro: 'Passageiro não encontrado.' });
    res.json(item);
  } catch (err) { next(err); }
}

async function getFlights(req, res, next) {
  try {
    const data = await flightRepo.findAll();
    res.json(data);
  } catch (err) { next(err); }
}

async function getFlightById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'ID inválido.' });
    const item = await flightRepo.findById(id);
    if (!item) return res.status(404).json({ erro: 'Voo não encontrado.' });
    res.json(item);
  } catch (err) { next(err); }
}

async function getBoardingPasses(req, res, next) {
  try {
    const data = await boardingPassRepo.findAll();
    res.json(data);
  } catch (err) { next(err); }
}

async function getBoardingPassById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'ID inválido.' });
    const item = await boardingPassRepo.findById(id);
    if (!item) return res.status(404).json({ erro: 'Cartão de embarque não encontrado.' });
    res.json(item);
  } catch (err) { next(err); }
}

async function getBoardingPassDetails(req, res, next) {
  try {
    const data = await boardingPassRepo.findAllWithDetails();
    res.json(data);
  } catch (err) { next(err); }
}

module.exports = {
  getAircraft, getAircraftById,
  getPassengers, getPassengerById,
  getFlights, getFlightById,
  getBoardingPasses, getBoardingPassById,
  getBoardingPassDetails,
};

