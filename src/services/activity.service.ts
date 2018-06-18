export class ActivityService{
    private activity: {date: string, ticketID:string, ticketStatus: string, iconName: String, cssClass: String} [] = [];

    addActivity(activity:{date: string, ticketID:string, ticketStatus: string, iconName: String, cssClass: String}){
        this.activity.push(activity);
    }

    getActivity(){
        return this.activity.slice();
    }
}
