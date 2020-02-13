const kafka = require("kafka-node");
const OrientDBClient = require("orientjs").OrientDBClient;

const client = new kafka.KafkaClient({
  kafkaHost: "localhost:9092,localhost:9093,localhost:9094"
});

const mailConsumerOptions = {
  kafkaHost: "localhost:9092,localhost:9093,localhost:9094",
  groupId: "db-service",
  sessionTimeout: 15000,
  protocol: ["roundrobin"],
  fetchMaxBytes: 1024 * 1024 * 10,
  fromOffset: "latest"
};

const mailConsumer = new kafka.ConsumerGroup(mailConsumerOptions, "new-mail");

const dbConfig = {
  host: "localhost",
  db: "mail",
  user: "admin",
  password: "admin",
  rootUser: "root",
  rootPassword: "root"
};

const setupDatabase = async () => {
  let client = await OrientDBClient.connect({
    host: dbConfig.host,
    pool: {
      max: 10
    }
  });

  let exists = await client.existsDatabase({
    name: dbConfig.db,
    username: dbConfig.rootUser,
    password: dbConfig.rootPassword
  });

  if (!exists) {
    await client.createDatabase({
      name: dbConfig.db,
      username: dbConfig.rootUser,
      password: dbConfig.rootPassword
    });
  }

  let pool = await client.sessions({
    name: dbConfig.db,
    username: dbConfig.user,
    password: dbConfig.password,
    pool: {
      max: 25
    }
  });

  let session = await pool.acquire();
  await session.command("create class Mails IF NOT EXISTS extends V").one();
  await session.close();
  return { client, pool };
};

setupDatabase().then(({ pool }) => {
  // for mutation addMail
  mailConsumer.on("message", async data => {
    const message = JSON.parse(data.value);
    console.log("TCL: message", message);
    let session = await pool.acquire();


      const result = await session
        .insert()
        .into("Mails")
        .set({
            recipients: message.to,
            sender: message.from,
            text: message.text,
            subject: message.subject
        })
        .one();
        await session.close();

        console.log("TCL: result", result)


    //   const payloads = [
    //     {
    //       topic: "query_result",
    //       messages: JSON.stringify({
    //         id: result.id,
    //         tweet: result.tweet,
    //         username: result.username
    //       })
    //     }
    //   ];

    //   highLevelProducer.send(payloads, (err, data) => {
    //     if (err) console.log(err);
    //     console.log("Mutation Result sent to graphql..");
    //   });
    // }

  });
});
