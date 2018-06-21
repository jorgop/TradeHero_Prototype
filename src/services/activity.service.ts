export class ActivityService{
    private activity: {date: string, ticketID:string, ticketStatus: string, iconName: String, cssClass: String} [] = [];
    private aggregate: {contClosed: number, countAll: number, countOpen: number, sumAll: number, sumOpen: number, summClosed: number}[] = [];

    addActivity(activity:{date: string, ticketID:string, ticketStatus: string, iconName: String, cssClass: String}){
        this.activity.push(activity);
    }
    getActivity(){
        return this.activity.slice();
    }

    addAggregate(aggregate: {contClosed: number, countAll: number, countOpen: number, sumAll: number, sumOpen: number, summClosed: number}){
        this.aggregate.push(aggregate);
    }
    getAggregate(){
        return this.aggregate.slice();
    }

}
