const kafka = require("kafka-node");
const util = require("util");

const { kafkaHost } = require('./Config/')

module.exports = function kafkaStartClient() {
  const client = new kafka.KafkaClient({
    kafkaHost
  });

  const topicsToCreate = [
    {
      topic: "query-result",
      partitions: 5,
      replicationFactor: 3
    },
    {
      topic: "new-mail",
      partitions: 5,
      replicationFactor: 3
    }
  ];

  // create kafka topics
  client.createTopics(topicsToCreate, (error, result) => {
    if (error) console.log(error);
    console.log(
      `Result of creating topic is ${util.inspect(result, false, null, true)}`
    );
  });

  const queryResultConsumerOptions = {
    kafkaHost,
    groupId: "query-result",
    sessionTimeout: 15000,
    protocol: ["roundrobin"],
    fetchMaxBytes: 1024 * 1024,
    fromOffset: "latest"
  };

  const queryResultConsumerGroup = new kafka.ConsumerGroup(
    queryResultConsumerOptions,
    "query-result"
  );

  const highLevelProducer = new kafka.HighLevelProducer(client);

    return {
        queryResultConsumerGroup,
        highLevelProducer
    }
}
