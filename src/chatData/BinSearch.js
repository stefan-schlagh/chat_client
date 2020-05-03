
export default class BinSearchArray extends Array{

    getIndex(key){

        let left=0;
        let right = this.length-1;

        while(left<=right){
            let k= (left+right)/2;

            if(this[k] === key)
                return k;
            else if(this[k] < key)
                left = k+1;
            else //a[k]>v
                right=k-1;
        }
        return -1;
    }

    getNearestKey(key){
        /*
            besseren Algorithmus finden
         */
        let i;
        ++key;

        while((i = this.getIndex(--key)) !== -1){

            if(key === 0) return 0;
        }

        return i;
    }

    get(key){

        let i = this.getIndex(key);

        if(i !== -1)
            return this[i];

        return undefined;
    }

    add(key,value){

        this.splice(this.getNearestKey(key),value);
    }

    remove(key){

        let i = this.getIndex(key);

        if(i !== -1)
            this.splice(i,1);
    }
}