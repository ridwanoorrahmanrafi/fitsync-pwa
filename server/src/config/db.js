import dns from 'dns';
import mongoose from 'mongoose';

// Ensure SRV records resolve cleanly on Windows environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fall back to system defaults if setting servers is not permitted
}

export async function connectDB(uri = process.env.MONGODB_URI) {
  await mongoose.connect(uri);
  console.log('MongoDB connected to:', mongoose.connection.name || 'database');
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
