export class View {
    users = [];
    constructor(users) {
        this.users = users
    }
    render() {
        //populate DOM
        for (let user in this.users) {
            document.getElementById('demo').innerHTML += '<li>' + user.username + '</li>';
            console.log('user', user);
        }
    }
}