
# GlideGo

GlideGo is an Uber-type ride-sharing application built using React for the frontend and Node.js for the backend. 
It connects riders with drivers in real-time, providing a seamless experience for booking and completing rides.

## Project Overview

- **Frontend**: React
- **Backend**: Node.js (Express)
- **Database**: MongoDB (using Mongoose for data modeling)
- **Features**:
  - User registration and authentication (Riders & Drivers)
  - Real-time ride requests and driver assignment
  - Payment processing
  - Location tracking and ride progress updates

---

## Data Modeling

### 1. User Model (Riders & Drivers)

```js
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['rider', 'driver'], required: true },
  phone: { type: String },
  profilePicture: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  rating: { type: Number, default: 5 },
  vehicleDetails: {
    type: String,
    required: function () {
      return this.role === 'driver';
    }
  }
}, { timestamps: true });
```

### 2. Ride Request Model

```js
const RideRequestSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String }
  },
  dropoffLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String }
  },
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'in-progress', 'completed', 'canceled'], 
    default: 'requested' 
  },
  fare: { type: Number },
  distance: { type: Number },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now }
});
```

### 3. Payment Model

```js
const PaymentSchema = new mongoose.Schema({
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'RideRequest', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'cash', 'wallet'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String }
}, { timestamps: true });
```

### 4. Location Model (Optional)

```js
const LocationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  updatedAt: { type: Date, default: Date.now }
});
```

---

## How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/GlideGo.git
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   
   cd ../backend
   npm install
   ```

3. Start the development servers:
   ```bash
   cd frontend
   npm start

   cd ../backend
   npm run dev
   ```

---

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

---

## Contributors

- [Your Name](https://github.com/yourusername)
