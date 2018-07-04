export class HistoryService{
  private card: {head:string,body:string,cardClass: string} [] = [];
  private historyHeader: {submitDate: string, endDate: string, refund: number, imgFile: string, invoiceID: String}[] = [];

  addCard(card:{head:string,body:string,imgFile:string,cardClass: string}){
    this.card.push(card);
  }

  getCard(){
    return this.card.slice();
  }

  addHistoryHeader(historyHeader:{submitDate: string, endDate: string, refund: number, imgFile: string, invoiceID: String}){
      this.historyHeader.push(historyHeader);
  }
  getHistoryHeader(){
      return this.historyHeader.slice();
  }
}
