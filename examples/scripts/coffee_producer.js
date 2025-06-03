const { Servient } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;

const td = {
  title: "CoffeeMachine",
  id: "urn:dev:wot:coffee-machine",
  securityDefinitions: {
    nosec_sc: { scheme: "nosec" },
  },
  security: ["nosec_sc"],
  properties: {
    availableResourceLevel: {
      type: "integer",
      observable: true,
      readOnly: true,
      forms: [{
        href: "mqtt://localhost:1883/CoffeeMachine/properties/availableResourceLevel",
        contentType: "application/json",
        op: ["observeproperty", "readproperty"],
      }],
    },
    possibleDrinks: {
      type: "array",
      items: { type: "string" },
      readOnly: true,
      forms: [{
        href: "mqtt://localhost:1883/CoffeeMachine/properties/possibleDrinks",
        contentType: "application/json",
        op: ["readproperty"],
      }],
    },
    maintenanceNeeded: {
      type: "boolean",
      readOnly: true,
      forms: [{
        href: "mqtt://localhost:1883/CoffeeMachine/properties/maintenanceNeeded",
        contentType: "application/json",
        op: ["readproperty"],
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

async function main() {
  const servient = new Servient();
  servient.addClientFactory(new MqttClientFactory({ uri: "mqtt://localhost:1883" }));

  try {
    const WoT = await servient.start();
    console.log("✅ Servient started (producer)");

    const thing = await WoT.produce(td);

    let availableResourceLevel = 3;
    let maintenanceNeeded = false;
    const possibleDrinks = ["espresso", "cappuccino", "latte"];
    const LOW_RESOURCE_THRESHOLD = 2;
    let lowAlreadyWarned = false;

    thing.setPropertyReadHandler("availableResourceLevel", async () => availableResourceLevel);
    thing.setPropertyReadHandler("possibleDrinks", async () => possibleDrinks);
    thing.setPropertyReadHandler("maintenanceNeeded", async () => maintenanceNeeded);

    function checkResourceLevel() {
      thing.notifyPropertyChange("availableResourceLevel");

      if (availableResourceLevel <= LOW_RESOURCE_THRESHOLD && availableResourceLevel > 0 && !lowAlreadyWarned) {
        console.log("⚠️ Nível abaixo do limiar! Emitindo evento.");
        thing.emitEvent("outOfResource", `Low resource level: ${availableResourceLevel}`);
        lowAlreadyWarned = true;
      }

      if (availableResourceLevel > LOW_RESOURCE_THRESHOLD) {
        lowAlreadyWarned = false;
      }

      if (availableResourceLevel === 0 && !maintenanceNeeded) {
        maintenanceNeeded = true;
        thing.notifyPropertyChange("maintenanceNeeded");
        console.log("🔧 Manutenção necessária.");
        thing.emitEvent("outOfResource", "No water available!");
      }
    }

    thing.setActionHandler("makeDrink", async (drink) => {
      console.log(`☕ Pedido recebido: ${drink}`);
      console.log(`📦 Nível atual de recursos: ${availableResourceLevel}`);

      if (!possibleDrinks.includes(drink)) {
        console.log("⚠️ Bebida não disponível.");
        return `❌ Drink "${drink}" not available.`;
      }

      if (availableResourceLevel <= 0) {
        console.log("🔥 Emitindo evento: outOfResource");
        thing.emitEvent("outOfResource", "No water available!");
        return "❌ No water to make drink!";
      }

      availableResourceLevel--;
      console.log(`📉 Novo nível: ${availableResourceLevel}`);
      checkResourceLevel();

      return `✅ ${drink} served!`;
    });

    await thing.expose();
    console.log("🚀 Coffee Machine exposed and ready to serve!");
  } catch (err) {
    console.error("❌ Error in producer:", err);
  }
}

main();
