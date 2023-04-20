import moment from "moment";

export function setGender(){
    const genders = ['male', 'female', 'male', 'female', 'male', 'female', 'male', 'female'];
    const randomIndex = Math.floor( Math.random() * genders.length );   // includes + 1 anyway
    return genders[randomIndex];
};
export function setRating(){
    const random = (Math.random() * 10 - 1) + 1;
    const fixed = random.toFixed(1);
    return +fixed >= 1 ? +fixed : setRating() ;
};
export function addZero(param){
    return +param < 10 ? '0'.concat(param) : param;
};
export function setRandomHour(){
    const {year, month, day, hour, minute, second} = {
        year : moment().format('YYYY'),
        month : moment().format('MM'),
        day : Math.floor( Math.random() * +moment().format('DD') ) + 1,
        hour : Math.floor( Math.random() * +moment().format('HH') ),
        minute : Math.floor( Math.random() * +moment().format('mm') ),
        second : Math.floor( Math.random() * +moment().format('ss') ),
    };
    const date = `${year}/${month}/${addZero(day)} ${addZero(hour)}:${addZero(minute)}:${addZero(second)}`;
    return date;
};
export function isNaN(param) {
    param = +param;
    if (param.toString() == 'NaN') return true 
    else return false
}