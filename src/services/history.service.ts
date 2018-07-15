export class HistoryService{
  private card: {head:string, body:string, cardClass: string, cardIcon: string} [] = [];
  private historyHeader: {submitDate: string, endDate: string, refund: number, imgFile: string, invoiceID: string}[] = [];

  addCard(card:{head:string, body:string, imgFile:string, cardClass: string, cardIcon: string}){
    this.card.push(card);
  }

  getCard(){
    return this.card.slice();
  }

  addHistoryHeader(historyHeader:{submitDate: string, endDate: string, refund: number, imgFile: string, invoiceID: string}){
      this.historyHeader.push(historyHeader);
  }
  getHistoryHeader(){
      return this.historyHeader.slice();
  }
}
