// class StorageContainer<T> {
//     private contents: T[];
//     constructor() {
//         this.contents = []
//     }
//     addItem(item: T): void {
//         this.contents.push(item);
//     }
//     getItem(idx: number): T | undefined {
//         return this.contents[idx];
//     }
// }
// const userNames = new StorageContainer<string>()
// userNames.addItem("Peter Jung");
// userNames.addItem("Helena Boulaxis");
// console.log("The best Person is: ", userNames.getItem(1));
// const busStations = new StorageContainer<number>();
// busStations.addItem(1);
// busStations.addItem(4);
// console.log("In forchtenstein we have:", busStations.getItem(1), " bus stations");
var BusStations = /** @class */ (function () {
    function BusStations() {
        this.contents = [];
    }
    ;
    BusStations.prototype.addStation = function (item) {
        this.contents.push(item);
    };
    BusStations.prototype.getStations = function (idx) {
        return this.contents[idx];
    };
    return BusStations;
}());
var forchtensteinBus = new BusStations();
forchtensteinBus.addStation("Kirche");
forchtensteinBus.addStation("Bahnhof");
console.log("The first stop is: ", forchtensteinBus.getStations(1));
var numberBusStations = new BusStations();
numberBusStations.addStation(3);
numberBusStations.addStation(4);
console.log("Wir konnten in den letzen zwei tagen diese anzahl an busstationen bauen: ", {
    day1: numberBusStations.getStations(0),
    day2: numberBusStations.getStations(1),
});
