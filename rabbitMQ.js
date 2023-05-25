class Device {
  constructor(deviceId, interval, dataSize, dataCallback) {
    this.deviceId = deviceId;
    this.interval = interval;
    this.dataSize = dataSize;
    this.dataCallback = dataCallback;
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

  run() {
    setInterval(() => {
      const timestamp = Date.now();
      const values = this.generateData();
      const data = {
        Timestamp: timestamp,
        Values: values,
      };
      this.dataCallback(this.deviceId, data);
    }, this.interval * 1000);
  }
}

class Consumer {
  constructor(consumerId, dataCallback) {
    this.consumerId = consumerId;
    this.dataCallback = dataCallback;
  }

  receiveData(deviceId, data) {
    console.log(`Consumer ${this.consumerId} recibió datos del dispositivo ${deviceId}:`, data);
    this.dataCallback(deviceId, data);
  }
}

// Parámetros configurables
const n = 3; // Número de dispositivos IoT
const m = 2; // Número de consumidores
const interval = 1; // Intervalo de envío de datos en segundos
const dataSize = 10; // Tamaño máximo de los datos generados

// Crear los dispositivos IoT
const devices = [];
for (let i = 1; i <= n; i++) {
  const device = new Device(i, interval, dataSize, processData);
  devices.push(device);
  device.run();
}

// Crear los consumidores
const consumers = [];
for (let i = 1; i <= m; i++) {
  const consumer = new Consumer(i, processData);
  consumers.push(consumer);
}

function processData(deviceId, data) {
  console.log(`Procesando datos del dispositivo ${deviceId}:`, data);
  // Aquí puedes realizar cualquier procesamiento adicional de los datos recibidos

  // Simulación de procesamiento asincrónico con un retardo aleatorio
  const delay = Math.floor(Math.random() * 3000) + 1000;
  setTimeout(() => {
    console.log(`Consumer procesó los datos del dispositivo ${deviceId}:`, data);
  }, delay);
}

// Simulación de recepción de datos desde los dispositivos
devices.forEach((device) => {
  const randomConsumer = consumers[Math.floor(Math.random() * consumers.length)];
  device.dataCallback = randomConsumer.receiveData.bind(randomConsumer);
});
