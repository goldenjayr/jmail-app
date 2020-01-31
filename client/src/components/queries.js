import gql from 'graphql-tag'

const CREATE_MAIL = gql`
    mutation createMail($mailInput: MailInput) {
        createMail(mailInput: $mailInput) {
            subject
            text
        }
    }
`

const NEW_MAIL_SUBSCRIPTION = gql`
    subscription {
        newMail {
            from
            to
            subject
            text
        }
    }
`

export {
    CREATE_MAIL,
    NEW_MAIL_SUBSCRIPTION
}