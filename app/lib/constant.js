'use strict';

module.exports = {
  menuData: {
        Close: {
          id: 'Close Menu',
          str: 'Close Menu',
          extra: '',
          ico: 'close'
        },
        CallMenu: {
          id: 'CallMenu',
          str: 'Place Call',
          extra: '',
          ico: 'phone'
        },
        BuyCredits: {
          id: 'BuyCredits',
          str: 'Buy Credits',
          extra: 'minutes',
          ico: 'basket'
        },
        CallHistory: {
          id: 'CallHistory',
          str: 'Call History',
          extra: '',
          ico: 'microphone'
        },
        Settings: {
          id: 'Settings',
          str: 'Settings',
          extra: '',
          ico: 'settings'
        },
        Support: {
          id: 'Support',
          str: 'Support',
          extra: '',
          ico: 'question'
        },
  },

  creditData: {
    twentyFive: {
      imgUrl: 'coin1',
      amount: '25',
      perCredit: '19¢',
      price: '$4.95',
      package: 1
    },
    sixty: {
      imgUrl: 'coin2',
      amount: '60',
      perCredit: '16¢',
      price: '$9.95',
      package: 2
    },
    oneThirty: {
      imgUrl: 'coin4',
      amount: '130',
      perCredit: '15¢',
      price: '$19.95',
      package: 3
    },
    twoHundred: {
      imgUrl: 'coin6',
      amount: '200',
      perCredit: '14¢',
      price: '$29.95',
      package: 4
    },
    threeFifty: {
      imgUrl: 'coinStack',
      amount: '350',
      perCredit: '14¢',
      price:'$49.95',
      package: 5
    }
  },

  sampleCallHistory: [
        {
          "id":"7338881",
          "user_id":"2159702",
          "country":"US",
          "destNumber":"15035458858",
          "fakeNumber":"2037776311",
          "recordCall":"1",
          "changeVoice":"3",
          "recordingFile":"https://s3.amazonaws.com/fakecallerid/fci-302f0853694a59a86ba2345f530bd2dd.wav",
          "callDuration":"0",
          "timestamp":"2017-06-08 16:25:09",
          "credits":"1"
        }
  ]
}

