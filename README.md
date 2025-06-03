Claro! Aqui está um README para o seu projeto no GitHub, baseado no seu texto:

---

# Trabalho Prático de Aplicação – Sistema Máquina de Café com MQTT

## Descrição

Este trabalho prático visa a adaptação do sistema da máquina de café do projeto Thingweb ([Thingweb Hands-on](https://thingweb.io/hands-on/articles/intro-raspberry/)), implementando comunicação entre o servient producer e os consumers via protocolo MQTT.

## Objetivos

* Instalar e executar o sistema da máquina de café original, analisando seu código.
* Adaptar o sistema para que as propriedades (`availableResourceLevel`, `possibleDrinks`, `maintenanceNeeded`), a ação (`makeDrink`) e o evento (`outOfResource`) possam ser manipulados entre o servient producer e os consumers usando MQTT.
* Configurar um broker MQTT local (Mosquitto) ou usar um broker online para comunicação.
* Implementar um consumidor capaz de ser notificado via eventos quando os níveis dos ingredientes estiverem abaixo de um limiar definido.
* Simular ações que decrementam o depósito de água, por meio de entrada de dados no teclado ou função que gera valores aleatórios ao longo do tempo.

## Requisitos

* Node.js instalado
* Broker MQTT (Mosquitto local ou broker online, ex.: [test.mosquitto.org](https://test.mosquitto.org/))
* Cliente MQTT para testes (exemplo: [MQTT Explorer](https://mqtt-explorer.com/) ou MQTTBox)

## Instruções

1. **Instalação do Mosquitto**
   Baixe e instale o Mosquitto a partir do [site oficial](https://mosquitto.org/download/), ou use um broker MQTT online.

2. **Executar o broker MQTT**
   Inicie o servidor Mosquitto localmente ou assegure-se que o broker online está disponível.

3. **Rodar o Servient Producer**
   Execute o código do produtor da máquina de café que publica propriedades, aceita ações e emite eventos via MQTT.

4. **Rodar o Servient Consumer**
   Execute o consumidor que se inscreve nos tópicos MQTT para consumir propriedades, enviar ações e reagir a eventos (ex: nível de recurso baixo).

5. **Testar comunicação MQTT**
   Utilize clientes MQTT para monitorar e publicar mensagens manualmente, verificando a pub/sub dos tópicos.

6. **Simulação de decremento de recurso**
   Através do consumidor, simule a redução do nível de água via teclado ou função que gera valores aleatórios, disparando eventos quando o nível atingir o limiar.

## Referências

* Projeto Thingweb Máquina de Café: [https://thingweb.io/hands-on/articles/intro-raspberry/](https://thingweb.io/hands-on/articles/intro-raspberry/)
* Mosquitto MQTT Broker: [https://mosquitto.org/download/](https://mosquitto.org/download/)
* Broker MQTT online para testes: [https://test.mosquitto.org/](https://test.mosquitto.org/)
* Clientes MQTT: MQTT Explorer ([https://mqtt-explorer.com/](https://mqtt-explorer.com/)), MQTTBox


