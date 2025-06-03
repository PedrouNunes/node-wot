const readline = require("readline");
const { Servient } = require("@node-wot/core");
const MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const servient = new Servient();
servient.addClientFactory(new MqttClientFactory());

servient.start().then(async (WoT) => {
  const td = JSON.parse(fs.readFileSync("./examples/scripts/thing_description.json", "utf8"));

  try {
    const thing = await WoT.consume(td);
    console.log("✅ Connected to Coffee Machine");

    thing.subscribeEvent("outOfResource", (data) => {
      console.log("🚨 EVENT received: outOfResource →", data);
    });

    async function showProperties() {
      try {
        const level = await (await thing.readProperty("availableResourceLevel")).value();
        const drinks = await (await thing.readProperty("possibleDrinks")).value();
        const maintenance = await (await thing.readProperty("maintenanceNeeded")).value();

        console.log("💧 Level:", level);
        console.log("🍹 Drinks:", drinks.join(", "));
        console.log("🛠 Maintenance Needed:", maintenance);
      } catch (err) {
        console.error("❌ Error reading properties:", err.message);
      }
    }

    function askUser() {
      rl.question(
        "\nChoose an option:\n" +
        "1 - Make a drink\n" +
        "2 - Show current status\n" +
        "0 - Exit\n" +
        "Your choice: ", async (answer) => {

        if (answer === "1") {
          rl.question("Which drink do you want? ", async (drink) => {
            try {
              const result = await thing.invokeAction("makeDrink", { drink });
              console.log("✅ Drink made:", result);
            } catch (err) {
              console.error("❌ Error making drink:", err.message);
            }
            askUser();
          });

        } else if (answer === "2") {
          await showProperties();
          askUser();

        } else if (answer === "0") {
          console.log("👋 Exiting...");
          rl.close();
          process.exit(0);

        } else {
          console.log("❌ Invalid choice, try again.");
          askUser();
        }
      });
    }

    askUser();

  } catch (err) {
    console.error("❌ Error consuming TD:", err.message);
    process.exit(1);
  }

}).catch((err) => {
  console.error("❌ Error starting servient:", err.message);
  process.exit(1);
});
