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

const producer = kafka.producer()
producer.on('producer.connect', () => {
  console.log(`KafkaProvider: connected`);
});
producer.on('producer.disconnect', () => {
  console.log(`KafkaProvider: could not connect`);
});
producer.on('producer.network.request_timeout', (payload) => {
  console.log(`KafkaProvider: request timeout ${payload.clientId}`);
});
const run = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: 'supplier-ratings',
    messages: [
      {
        value: Buffer.from(JSON.stringify(
          {
            "event_name": "QA",
            "external_id": user_uuiD,
            "payload": {
              "supplier_id": i.supplier_id,
              "assessment": {
                "performance": 7,
                "quality": 7,
                "communication": 7,
                "flexibility": 7,
                "cost": 7,
                "delivery": 6
              }
            },
            "metadata": {
              "user_uuid": "5a12cba8-f4b5-495b-80ea-d0dd5d4ee17e"
            }
          }
        ))
      },
    ],
  })

  Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)

main();
