# Practical Application Assignment – Coffee Machine System with MQTT

## Description

This practical assignment aims to adapt the coffee machine system from the Thingweb project ([Thingweb Hands-on](https://thingweb.io/hands-on/articles/intro-raspberry/)), implementing communication between the servient producer and consumers via the MQTT protocol.

## Objectives

* Install and run the original coffee machine system, analyzing its source code.
* Adapt the system so that the properties (`availableResourceLevel`, `possibleDrinks`, `maintenanceNeeded`), the action (`makeDrink`), and the event (`outOfResource`) can be manipulated between the servient producer and consumers using MQTT.
* Configure a local MQTT broker (Mosquitto) or use an online broker for communication.
* Implement a consumer that can be notified via events when the ingredient levels in the machine fall below a defined threshold.
* Simulate actions that decrement the water tank level, either by keyboard input or by a function that generates random values over time.

## Requirements

* Node.js installed
* MQTT Broker (local Mosquitto or online broker, e.g., [test.mosquitto.org](https://test.mosquitto.org/))
* MQTT client for testing (e.g., [MQTT Explorer](https://mqtt-explorer.com/) or MQTTBox)

## Instructions

1. **Install Mosquitto**
   Download and install Mosquitto from the [official website](https://mosquitto.org/download/), or use an online MQTT broker.

2. **Run the MQTT broker**
   Start the Mosquitto server locally or ensure the online broker is accessible.

3. **Run the Servient Producer**
   Execute the coffee machine producer code that publishes properties, accepts actions, and emits events via MQTT.

4. **Run the Servient Consumer**
   Execute the consumer that subscribes to MQTT topics to consume properties, send actions, and react to events (e.g., low resource level).

5. **Test MQTT communication**
   Use MQTT clients to monitor and publish messages manually, verifying the pub/sub of topics.

6. **Simulate resource decrement**
   Through the consumer, simulate the reduction of the water level by keyboard input or a function that generates random values, triggering events when the level reaches the threshold.

## References

* Thingweb Coffee Machine Project: [https://thingweb.io/hands-on/articles/intro-raspberry/](https://thingweb.io/hands-on/articles/intro-raspberry/)
* Mosquitto MQTT Broker: [https://mosquitto.org/download/](https://mosquitto.org/download/)
* Online MQTT Broker for testing: [https://test.mosquitto.org/](https://test.mosquitto.org/)
* MQTT Clients: MQTT Explorer ([https://mqtt-explorer.com/](https://mqtt-explorer.com/)), MQTTBox

---

Let me know if you want me to help format it with command examples or anything else!
