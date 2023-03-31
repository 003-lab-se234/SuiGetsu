const menus = document.querySelectorAll('#menuChart');

menus.forEach(menu => {
    new Chart(menu, {
        type: 'doughnut',
        data: {
            labels: ['Main', 'Side', 'Snack', 'Appetizer', 'Drink'],
            datasets: [{
                label: '# of Menus',
                data: [12, 9, 3, 5, 2],
                borderWidth: 1
            }]
        }
    });
})

const orders = document.querySelectorAll('#orderChart')

orders.forEach(order => {
    new Chart(order, {
        type: 'bar',
        data: {
            labels: ['Pending', 'Cooking', 'Delivering'],
            datasets: [{
                label: '# of Order',
                data: [1, 3, 2],
                borderWidth: 1
            }]
        }
    });
})




const users = document.querySelectorAll('#userChart');

users.forEach(user => {
    new Chart(user, {
        type: 'doughnut',
        data: {
            labels: ['Customer', 'Staff'],
            datasets: [{
                label: "# of people",
                backgroundColor: [
                    '#0062c8',
                    '#aa1e49',
                ],
                data: [10, 3],
                borderWidth: 1
            }]
        }
    });
})