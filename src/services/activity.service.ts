export class ActivityService{
    private activity: {title: string} [] = [];

    addActivity(activity:{title: string}){
        this.activity.push(activity);
    }

    getActivity(){
        return this.activity.slice();
    }
}