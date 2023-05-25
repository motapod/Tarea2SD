const { Kafka } = require('kafkajs');

class Device {
  constructor(deviceId, interval, dataSize, producer) {
    this.deviceId = deviceId;
    this.interval = interval;
    this.dataSize = dataSize;
    this.producer = producer;
  }

  generateData() {
    // Generar datos aleatorios de tamaño aleatorio
    const size = Math.floor(Math.random() * this.dataSize) + 1;
    const data = [];
    for (let i = 0; i < size; i++) {
      data.push(Math.floor(Math.random() * 100) + 1);
    }
    return data;
  }

  async run() {
    while (true) {
      const timestamp = Date.now();
      const values = this.generateData();
      const data = {
        Timestamp: timestamp,
        Values: values,
      };
      const message = JSON.stringify(data);
      await this.producer.send({
        topic: 'iot_data_topic',
        messages: [{ value: message }],
      });
      console.log(`Device ${this.deviceId} enviando datos:`, data);
      await new Promise((resolve) => setTimeout(resolve, this.interval * 1000));
    }
  }
}

// Parámetros configurables
const n = 3; // Número de dispositivos IoT
const interval = 1; // Intervalo de envío de datos en segundos
const dataSize = 10; // Tamaño máximo de los datos generados

async function main() {
  try {
    // Configuración de Kafka
    const kafka = new Kafka({
      clientId: 'iot-simulator',
      brokers: ['localhost:9092'],
    });

    // Crear el productor de Kafka
    const producer = kafka.producer();
    await producer.connect();

    // Crear los dispositivos IoT
    const devices = [];
    for (let i = 1; i <= n; i++) {
      const device = new Device(i, interval, dataSize, producer);
      devices.push(device);
      device.run();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
