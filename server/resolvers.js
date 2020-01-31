export const resolvers = {
  Query: {},
  Mutation: {
    createMail: async (
      _,
      { mailInput },
      { queryResultConsumerGroup, highLevelProducer, pubsub }
      ) => {
        console.log("TCL: mailInput", mailInput);
        const payloads = [
          {
          topic: "new-mail",
          messages: JSON.stringify(mailInput)
        }
      ];

      highLevelProducer.send(payloads, (err, data) => {
        if (err) {
          console.log("ERROR:", err);
        }
        console.log("PRODUCER DATA:", data)
      });

      const result = new Promise((resolve, reject) => {

        queryResultConsumerGroup.on('message', data => {
           const value = JSON.parse(data.value)

           if(value.response.includes('OK')) {
            pubsub.publish("new-mail", mailInput);
            resolve(value)
           }
        })
      })

      return await result
    }
  },
  Subscription: {
    newMail: {
      resolve: payload => {
        console.log("TCL: new mail pubsub payload", payload);
        return payload;
      },
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator("new-mail")
      }
    }
  }
};
