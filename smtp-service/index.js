const app = require("express")();
const nodemailer = require("nodemailer");
const kafka = require("kafka-node");

const client = new kafka.KafkaClient({
  kafkaHost: "localhost:9092,localhost:9093,localhost:9094"
});

const mailConsumerOptions = {
  kafkaHost: "localhost:9092,localhost:9093,localhost:9094",
  groupId: "smtp",
  sessionTimeout: 15000,
  protocol: ["roundrobin"],
  fetchMaxBytes: 1024 * 1024 * 10,
  fromOffset: "latest"
};

const mailConsumer = new kafka.ConsumerGroup(mailConsumerOptions, "new-mail");
const highLevelProducer = new kafka.HighLevelProducer(client);

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "goldenjayr@gmail.com",
    pass: "soaxejwijchkixoy"
  }
});

mailConsumer.on("message", async data => {
  const { from, to, subject, text } = JSON.parse(data.value);
  console.log("TCL: { from, to, subject, text }", { from, to, subject, text });

  const mailOptions = {
    from: "goldenjayr@gmail.com", // sender address
    to, // list of receiversss
    subject, // Subject line
    text // plain text body
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      const payloads = [
        {
          topic: "query-result",
          messages: JSON.stringify({ response: 'Error' })
        }
      ];

      highLevelProducer.send(payloads, (err, data) => {
        if (err) {
          console.log("ERROR:", err);
        }
        console.log("PRODUCER DATA:", data);
      });
    }
    else {
      console.log(info);
      const payloads = [
        {
          topic: "query-result",
          messages: JSON.stringify({ from, to, subject, text , response: info.response })
        }
      ];

      highLevelProducer.send(payloads, (err, data) => {
        if (err) {
          console.log("ERROR:", err);
        }
        console.log("PRODUCER DATA:", data);
      });
    }
  });
});

app.listen(5000, () => {
  console.log(`SMTP Service listening on port 5000`);
});
