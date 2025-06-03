const { Servient } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  const servient = new Servient();
  servient.addClientFactory(new MqttClientFactory({ uri: "mqtt://localhost:1883" }));

  console.log("[Consumer] Iniciando Servient...");
  const WoT = await servient.start();
  console.log("✅ Servient iniciado no Consumer (MQTT)");

  const td = {
    "@context": ["https://www.w3.org/2019/wot/td/v1"],
    title: "CoffeeMachine",
    properties: {
      availableResourceLevel: {
        type: "integer",
        observable: true,
        forms: [{
          href: "mqtt://localhost:1883/CoffeeMachine/properties/availableResourceLevel",
          contentType: "application/json",
          op: ["readproperty", "observeproperty"],
        }],
      },
    },
    actions: {
      makeDrink: {
        input: { type: "string" },
        forms: [{
          href: "mqtt://localhost:1883/CoffeeMachine/actions/makeDrink",
          contentType: "application/json",
          op: ["invokeaction"],
        }],
      },
    },
    events: {
      outOfResource: {
        data: { type: "string" },
        forms: [{
          href: "mqtt://localhost:1883/CoffeeMachine/events/outOfResource",
          contentType: "application/json",
          op: ["subscribeevent"],
        }],
      },
    },
  };

  const thing = await WoT.consume(td);
  console.log("📡 Thing consumido via MQTT");

  thing.subscribeEvent("outOfResource", (data) => {
    console.log(`🚨 Evento recebido [outOfResource]: ${data}`);
  });

  function startAutoMode() {
    const drinks = ["espresso", "latte", "cappuccino"];
    console.log("🤖 Modo automático ativado (aperte Ctrl+C para parar)\n");

    setInterval(async () => {
      const drink = drinks[Math.floor(Math.random() * drinks.length)];
      try {
        console.log(`🤖 [Auto] Solicitando: ${drink}`);
        const result = await thing.invokeAction("makeDrink", drink);
        console.log(`✅ [Auto] ${result}`);
      } catch (err) {
        console.error(`[Auto] Erro ao fazer bebida: ${err.message}`);
      }
    }, 5000);
  }

  function askUser() {
    rl.question(
      "\nEscolha uma opção:\n1 - Fazer uma bebida\n2 - Modo automático\n0 - Sair\nSua escolha: ",
      async (choice) => {
        if (choice === "1") {
          rl.question("Qual bebida deseja? ", async (drink) => {
            try {
              console.log(`[Consumer] Enviando pedido para: ${drink}`);
              const result = await thing.invokeAction("makeDrink", drink);
              console.log("[Consumer] Resultado:", result);
            } catch (err) {
              console.error("[Consumer] Erro ao invocar makeDrink:", err.message);
            }
            askUser();
          });
        } else if (choice === "2") {
          startAutoMode();
        } else if (choice === "0") {
          console.log("[Consumer] Encerrando...");
          rl.close();
          process.exit(0);
        } else {
          console.log("[Consumer] Opção inválida");
          askUser();
        }
      }
    );
  }

  askUser();
})();
