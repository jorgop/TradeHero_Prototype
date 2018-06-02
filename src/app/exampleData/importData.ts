

export class ExampleData {

  constructor(){}

  getJsonData(name) {
    let currentData = <any>{};

    switch (name){
      case "activityList":{
        currentData = {"activityList": [
            {
              "ticketID": 1001,
              "userID": 1,
              "IBAN": "DE123123123123123123123",
              "dateCreate": "2018-06-02",
              "street": "Am Arzt Weg",
              "houseNumber": "34",
              "PLZ": "12345",
              "place": "Frankfurt",
              "accountName": "Praxis Super",
              "bankName": "Deutsche Bank",
              "refund": 450.23,
              "imgFile": "0x2334",
              "status": 0,
              "history": [
                {
                  "ticketID": 1001,
                  "stateID": 1,
                  "sateDate": "2018-06-01",
                  "stateText": "Rechung wird gepüft",
                  "status": "1"
                },
                {
                  "ticketID": 1001,
                  "stateID": 2,
                  "sateDate": "2018-06-01",
                  "stateText": "Rechung wird bearbeitet",
                  "status": "1"
                },
                {
                  "ticketID": 1001,
                  "stateID": 3,
                  "sateDate": "2018-06-02",
                  "stateText": "Rechung wird überwiesen",
                  "status": "0"
                }
              ]
            },
            {
              "ticketID": 1002,
              "userID": 1,
              "IBAN": "DE123123122342342355",
              "dateCreate": "2018-06-02",
              "street": "Am Graben",
              "houseNumber": "322",
              "PLZ": "12345",
              "place": "Frankfurt",
              "accountName": "Praxis Schlecht",
              "bankName": "Frnakfurter Volksbank",
              "refund": 50.23,
              "imgFile": "0x2334",
              "status": 0,
              "history": [
                {
                  "ticketID": 1002,
                  "stateID": 1,
                  "sateDate": "2018-06-01",
                  "stateText": "Rechung wird gepüft",
                  "status": "1"
                },
                {
                  "ticketID": 1002,
                  "stateID": 2,
                  "sateDate": "2018-06-01",
                  "stateText": "Rechung wird bearbeitet",
                  "status": "0"
                }
              ]
            }
          ]};
        break;
      };
      case "userData":{
        currentData = {"userData":[{"userID":1},{"gender":"m"},{"firstName":"Max"},{"lastName":"Mustermann"},{"birthdate":"1990-12-01"},{"mail":"test@test.de"},{"street":"Musterweg"},{"houseNumber":34},{"place":"Frankfurt"},{"PLZ":12345}]};
        break;
      };
      case "authentication":{
          currentData = {"authentication": [{"userID":1},{"login":"true"}]};
          break;
      };
    }
    return currentData;
  }
}
