export class HistoryService{
  private card: {head:string,body:string,imgFile:string,cardClass: string} [] = [];
  private hisStatus: {submitDate: string, endDate: string}[] = [];

  addCard(card:{head:string,body:string,imgFile:string,cardClass: string}){
    this.card.push(card);
  }

  getCard(){
    return this.card.slice();
  }

  addHisStatus(hisStatus:{submitDate: string, endDate: string}){
      this.hisStatus.push(hisStatus);
  }
  getHisStatus(){
      return this.hisStatus.slice();
  }
}
