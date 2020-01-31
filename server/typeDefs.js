export const typeDefs = `
    type Mail {
        from: String!
        to: String!
        subject: String!
        text: String!
        html: String!
    }

    type Query {
        mails: [Mail]
    }

    input MailInput {
        from: String!
        to: String!
        subject: String!
        text: String!
    }

    type Mutation {
        createMail(mailInput: MailInput): Mail
    }

    type Subscription {
        newMail: Mail
    }
`
