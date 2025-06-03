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

  console.log("[Consumer] Starting Servient...");
  const WoT = await servient.start();
  console.log("✅ Servient started on Consumer (MQTT)");

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
  console.log("📡 Thing consumed via MQTT");

  thing.subscribeEvent("outOfResource", (data) => {
    console.log(`🚨 Event received [outOfResource]: ${data}`);
  });

  function startAutoMode() {
    const drinks = ["espresso", "latte", "cappuccino"];
    console.log("🤖 Automatic mode activated (press Ctrl+C to stop)\n");

    setInterval(async () => {
      const drink = drinks[Math.floor(Math.random() * drinks.length)];
      try {
        console.log(`🤖 \[Auto] Requesting: ${drink}`);
        const result = await thing.invokeAction("makeDrink", drink);
        console.log(`✅ [Auto] ${result}`);
      } catch (err) {
        console.error(`[Auto] Error making drink: ${err.message}`);
      }
    }, 5000);
  }

  function askUser() {
    rl.question(
      "\nChoose an option:\n1 - Make a drink\n2 - Automatic mode\n0 - Exit\nYour choice: ",
      async (choice) => {
        if (choice === "1") {
          rl.question("Which drink would you like? ", async (drink) => {
            try {
              console.log(`[Consumer] Sending order to: ${drink}`);
              const result = await thing.invokeAction("makeDrink", drink);
              console.log("[Consumer] Result:", result);
            } catch (err) {
              console.error("[Consumer] Error invoking makeDrink:", err.message);
            }
            askUser();
          });
        } else if (choice === "2") {
          startAutoMode();
        } else if (choice === "0") {
          console.log("[Consumer] Finishing...");
          rl.close();
          process.exit(0);
        } else {
          console.log("[Consumer] Invalid option, please try again.");
          askUser();
        }
      }
    );
  }

  askUser();
})();


