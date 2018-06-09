export class ActivityService{
    private activity: {date: string, ticketID:string, ticketStatus: string} [] = [];

    addActivity(activity:{date: string, ticketID:string, ticketStatus: string}){
        this.activity.push(activity);
    }

    getActivity(){
        return this.activity.slice();
    }
}
