package main

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/segmentio/kafka-go"
)

var KAFKA_BROKER = os.Getenv("KAFKA_BROKER")

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

type Message struct {
	Time     time.Time `json:"time"`
	Value    string    `json:"value"`
	DeviceID int       `json:"deviceID"`
}

func randMessage(n int) string {
	message := make([]byte, n)
	for i := range message {
		message[i] = charset[rand.Intn(len(charset))]
	}
	return string(message)
}

func connect(ctx context.Context, tries int) (*kafka.Writer, error) {
	fmt.Println("Testeando conexion con KAFKA_BROKER:", KAFKA_BROKER)
	producer := kafka.NewWriter(kafka.WriterConfig{
		Brokers: []string{KAFKA_BROKER},
		Topic:   "test-topic",
	})
	err := producer.WriteMessages(ctx, kafka.Message{
		Key:   []byte(strconv.Itoa(1)),
		Value: []byte("testeando conexion..."),
	})
	if err != nil {
		fmt.Println("Pausa de 5 segundos")
		time.Sleep(5 * time.Second)
		if tries == 15 {
			return nil, err
		}
		connect(ctx, tries+1)
	} else {
		fmt.Println("Kafka connection successfull")
		return producer, nil
	}
	return nil, fmt.Errorf("Kafka connection failed")
}

func KafkaProducer(ctx context.Context, producer *kafka.Writer, deviceID int, interval time.Duration) {
	for {
		message := &Message{
			Time:     time.Now(),
			Value:    randMessage(rand.Intn(100) + 1),
			DeviceID: deviceID,
		}
		value, err := json.Marshal(message)
		if err != nil {
			fmt.Println("Error marshaling json:", err)
		}
		producer.WriteMessages(ctx, kafka.Message{
			Key:   []byte(strconv.Itoa(deviceID)),
			Value: []byte(string(value)),
		})
		time.Sleep(interval)
	}

}
func main() {
	fmt.Println("Starting producer...")
	time.Sleep(15 * time.Second)
	ctx := context.Background()
	kafkaConnection, err := connect(ctx, 0)
	if err != nil {
		fmt.Println("Error connecting to Kafka")
		panic(err)
	}
	IOT := 3 
	secondsInterval := 4
	fmt.Println("Inicio mensajes")
	fmt.Println("numero de dispositivos:", IOT)
	fmt.Println("Interval de mensajes:", secondsInterval, "segundos")

	var wg sync.WaitGroup
	for i := 0; i < IOT; i++ {
		wg.Add(i)
		go KafkaProducer(ctx, kafkaConnection, i, 1*time.Second)
	}
	// for i := 0 < devices ; i++{
	// RabbitProducer

	// }
	wg.Wait()
}
