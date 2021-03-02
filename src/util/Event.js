export default class EventHandler{

    _events;

    constructor() {
        this.events = new Map();
    }

    /*
        event-handler wird hinzugefügt
     */
    on(event,fn){
        /*
            wenn event in Map vorhanden, wird event hinzugefügt
         */
        if(this.events.has(event))
            this.events.get(event).push(fn);
        /*
            wenn event in map noch nicht vorhanden,
            wird entry in map hinzugefügt
         */
        else
            this.events.set(event,[fn]);
    }
    /*
        event-handler wird entfernt
     */
    rm(event,fn){
        /*
            wenn event existiert
         */
        if(this.events.has(event)){
            const e = this.events.get(event)
            for(let i=0;i<e.length;i++)
                //wenn element die gesuchte function, wird sie gelöscht
                if(e[i] === fn)
                    e.splice(i,1);
        }
    }
    /*
        alle registrierten functions eines events werden ausgelöst
     */
    trigger(event,...rest){
        /*
            wenn event existiert
         */
        if(this.events.has(event)){
            /*
                es werden alle functions aufgerufen
             */
            const e = this.events.get(event)
            for(let i = 0;i < e.length;i++)
                e[i](...rest);
        }
    }

    get events() {
        return this._events;
    }

    set events(value) {
        this._events = value;
    }
}