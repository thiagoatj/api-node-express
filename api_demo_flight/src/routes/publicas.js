const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/publicController');

router.get('/aircraft', ctrl.getAircraft);
router.get('/aircraft/:id', ctrl.getAircraftById);

router.get('/passengers', ctrl.getPassengers);
router.get('/passengers/:id', ctrl.getPassengerById);

router.get('/flights', ctrl.getFlights);
router.get('/flights/:id', ctrl.getFlightById);

router.get('/boarding-passes', ctrl.getBoardingPasses);
router.get('/boarding-passes/:id', ctrl.getBoardingPassById);

router.get('/boarding-pass-details', ctrl.getBoardingPassDetails);

module.exports = router;

