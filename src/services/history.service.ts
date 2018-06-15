export class HistoryService{
  private card: {head:string,body:string,imgFile:string,cardClass: string} [] = [];

  addCard(card:{head:string,body:string,imgFile:string,cardClass: string}){
    this.card.push(card);
  }

  getCard(){
    return this.card.slice();
  }
}
