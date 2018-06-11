export class HistoryService{
  private card: {head:string,body:string} [] = [];

  addCard(card:{head:string,body:string}){
    this.card.push(card);
  }

  getCard(){
    return this.card.slice();
  }
}
