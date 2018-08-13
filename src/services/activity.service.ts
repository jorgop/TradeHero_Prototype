export class ActivityService{

  /**
   * Service object for the activity
   * @type {any[]} List with date,ticketID,ticketStatus,iconName,cssClass
   */
  private activity: {date: string, ticketID:string, ticketStatus: string, iconName: String, cssClass: String} [] = [];

  /**
   *  Service object for the aggregate
   * @type {any[]} List with countClosed,countAll,countOpen,countDenied,sumAll,sumOpen,sumClosed,sumDenied
   */
  private aggregate: {countClosed: number, countAll: number, countOpen: number, countDenied: number, sumAll: number, sumOpen: number, sumClosed: number, sumDenied: number}[] = [];

  /**
   * Add activity objects  to the stack
   * @param {{date: string; ticketID: string; ticketStatus: string; iconName: String; cssClass: String}} activity
   */
  addActivity(activity:{date: string, ticketID:string, ticketStatus: string, iconName: String, cssClass: String}){
        this.activity.push(activity);
    }

  /**
   * Get activity obejcts from the stack
   * @returns {{date: string; ticketID: string; ticketStatus: string; iconName: String; cssClass: String}[]}
   */
  getActivity(){
        return this.activity.slice();
    }

  /**
   * Add aggregate objects  to the stack
   * @param {{countClosed: number; countAll: number; countOpen: number; countDenied: number; sumAll: number; sumOpen: number; sumClosed: number; sumDenied: number}} aggregate
   */
  addAggregate(aggregate: {countClosed: number, countAll: number, countOpen: number, countDenied: number, sumAll: number, sumOpen: number, sumClosed: number, sumDenied: number}){
        this.aggregate.push(aggregate);
    }

  /**
   * Get aggregate obejcts from the stack
   * @returns {{countClosed: number; countAll: number; countOpen: number; countDenied: number; sumAll: number; sumOpen: number; sumClosed: number; sumDenied: number}[]}
   */
  getAggregate(){
        return this.aggregate.slice();
    }

}
