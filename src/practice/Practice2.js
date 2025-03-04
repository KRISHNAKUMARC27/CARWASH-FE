const { ElectricScooterRounded } = require("@mui/icons-material");

const Practice2 = () => {

    const cart = [
        { name: "Laptop", price: 1000, quantity: 1 },
        { name: "Phone", price: 700, quantity: 2 },
        { name: "Headphones", price: 150, quantity: 3 }
    ];
    // Expected Output: { name: "Laptop", price: 1000, quantity: 1 }

    const sorted = cart.sort((a, b) => b.price - a.price);
    const found = sorted.find(a => a.price > 0);
    console.log(found);

    const fnd = cart.reduce((max, item) => item.price > max.price ? item : max, cart[0]);
    console.log(fnd);

    // const f = cart.reduce((max, item) => {
    //     if (item.price > max.price)
    //         return item;
    //     else
    //         return max;

    // }, cart[0]);
    // console.log(f);

    const arr = [1, [2, [3, [4]], 5]];
    const flatArr = arr.flat(Infinity);
    console.log(flatArr);

    const users = [
        { name: "Alice", lastLogin: "2024-01-10" },
        { name: "Bob", lastLogin: "2024-02-01" },
        { name: "Charlie", lastLogin: "2024-01-25" }
      ];
      // Expected Output: Users who logged in within the last 30 days
    //const fil30 = users.filter(user => user.lastLogin > new Date - 30)      
};

Practice2();