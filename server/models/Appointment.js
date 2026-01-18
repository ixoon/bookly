const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: String,
    name: String,
    phone: String,
    car: String,
    service: String,
    date: String,
    note: String,
}, { timestamps: true })

module.exports = mongoose.model("Appointment", appointmentSchema);