const Practice = () => {

    const num = [1, 2, 3, 4, 5];
    const sqNum = num.map((n) => n * n);
    console.log(sqNum);

    const evenNum = num.filter((n) => n % 2 === 0);
    console.log(evenNum);

    const target = 5;
    const findTarget = num.includes(target);
    console.log(findTarget);

    const people = [
        { name: 'Sashwa', age: 4 },
        { name: 'Krishna', age: 33 },
        { name: 'Goms', age: 31 },
    ];
    const pupil = people.find((n) => n.age > 30);
    console.log(pupil);

    const greater = num.some((n) => n > 4);
    console.log(greater);

    const allNum = num.every((n) => n > 0);
    console.log(allNum);

    const names = people.map((m) => m.name);
    console.log(names);

    const dupNum = [...num, 1, 2, 3];
    const removeDup = new Set(dupNum);
    console.log(removeDup);

    const arr = ["apple", "banna", "apple", "orange", "banana", "apple"];
    const tar = "apple";
    const length = arr.filter(n => n === tar).length;
    console.log(length);

    const cart = [{
        item: 'laptop', price: 1000
    }, {
        item: 'mobile', price : 500
    }];

    const val = cart.reduce( (sum, n) => sum + n.price , 0);
    console.log(val);
};

Practice();
//export default Practice;