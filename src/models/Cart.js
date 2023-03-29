const Record = require("./Record");

module.exports = function Cart() {
    this.records = [];
    this.totalQty = 0;
    this.totalPrice = 0;

    this.add = (item, qty) => {
        let record = this.records[item.id];
        if (!record) {
            this.records[item.id] = new Record(item, qty);
        } else {
            this.records[item.id].qty += qty;
        }
        this.totalQty += qty;
        this.totalPrice += (item.price * qty);
    }

    this.remove = (id) => {
        let record = this.records[id];
        if (record) {
            const removedQty = Number(record.qty);
            this.totalQty -= removedQty;
            this.totalPrice = this.totalPrice - (record.item.price * removedQty) ;
            delete this.records[id];
        }
    }

    this.set = ( newRecords ) => {
        this.records = newRecords;
        this.reloadCart() ;
    }

    this.reloadCart = () => {
        let newTotalQty = 0 ;
        let newTotalPrice = 0 ;
        this.records.forEach( record => {
            // console.log(record)
            newTotalQty += record.qty;
            newTotalPrice += (record.qty * record.item.price);
        })

        this.totalQty = newTotalQty;
        this.totalPrice = newTotalPrice;
    }

}