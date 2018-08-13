export class HistoryService{

  /**
   * Service object for the card
   * @type {any[]} List with head, body, cardClass and card Icon
   */
  private card: {head:string, body:string, cardClass: string, cardIcon: string} [] = [];

  /**
   * Service object for the historyHeader
   * @type {any[]} List with submitDate, endDate, refund, imgFile and invoiceID
   */
  private historyHeader: {submitDate: string, endDate: string, refund: number, imgFile: string, invoiceID: string}[] = [];

  /**
   * Add card objects  to the stack
   * @param {{head: string; body: string; imgFile: string; cardClass: string; cardIcon: string}} card Crad Object
   */
  addCard(card:{head:string, body:string, imgFile:string, cardClass: string, cardIcon: string}){
    this.card.push(card);
  }

  /**
   * Get Card obejcts from the stack
   * @returns {{head: string; body: string; cardClass: string; cardIcon: string}[]} Crad Object
   */
  getCard(){
    return this.card.slice();
  }

  /**
   * Add historyHeader objects  to the stack
   * @param {{submitDate: string; endDate: string; refund: number; imgFile: string; invoiceID: string}} historyHeader historyHeader Object
   */
  addHistoryHeader(historyHeader:{submitDate: string, endDate: string, refund: number, imgFile: string, invoiceID: string}){
      this.historyHeader.push(historyHeader);
  }

  /**
   * Get historyHeader obejcts from the stack
   * @returns {{submitDate: string; endDate: string; refund: number; imgFile: string; invoiceID: string}[]} historyHeader Object
   */
  getHistoryHeader(){
      return this.historyHeader.slice();
  }
}
