export class ActivityService{
    private activity: {date: string, ticketID:string, ticketStatus: string, iconName: String, cssClass: String} [] = [];
    private aggregate: {countClosed: number, countAll: number, countOpen: number, countDenied: number, sumAll: number, sumOpen: number, sumClosed: number, sumDenied: number}[] = [];

    addActivity(activity:{date: string, ticketID:string, ticketStatus: string, iconName: String, cssClass: String}){
        this.activity.push(activity);
    }
    getActivity(){
        return this.activity.slice();
    }

    addAggregate(aggregate: {countClosed: number, countAll: number, countOpen: number, countDenied: number, sumAll: number, sumOpen: number, sumClosed: number, sumDenied: number}){
        this.aggregate.push(aggregate);
    }
    getAggregate(){
        return this.aggregate.slice();
    }

}
