/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  async save() {
    const reservationData = {
      customer_id: this.customerId,
      num_guests: this.numGuests,
      start_at: this.startAt,
      notes: this.notes,
    };

    try {
      if (this.id) {
        // Update an existing reservation
        await db.updateReservation(this.id, reservationData);
        console.log(`Reservation with id ${this.id} updated.`);
      } else {
        // Create a new reservation
        const newReservationId = await db.createReservation(reservationData);
        this.id = newReservationId; // Update the reservation object with the new ID
        console.log('New reservation created with id:', this.id);
      }
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  }
  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }
}

module.exports = Reservation;
