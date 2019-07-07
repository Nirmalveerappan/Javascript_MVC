
function main() {
    let controller = new Controller();
    controller.load();
}

class Controller {
    listData = [];
    model;
    load = () => {
        this.model = new UserModel();
        this.model.init()
            .then(() => {
                this.listData = this.model.userData;
                console.log(this.listData);
                var view = new View(this).render(this.listData);
            }, error => {
                console.log('error loading users');
            });
        this.error = new ErrorHandler();
    }

    handleEvent = function (e) {
        console.log('invoked');
        e.stopPropagation();
        switch (e.type) {
            case "click":
                this.clickHandler(e.target);
                break;
            default:
                console.log(e.target);
        }
    }

    clickHandler = function (target) {
        let lastUser = this.model.userData.pop();
        console.log('lastUser', lastUser);
        // console.log('updated user data', this.model.userData);
        //now we just notify our observers
        this.model.notifyAll();
    }

}

class View {
    users = [];
    controller;
    constructor(controller) {
        this.controller = controller;
        let button = document.getElementById('deleteUser');
        button.addEventListener('click', controller);
        this.controller.model.registerObserver(this);
    }
    render(users) {
        this.users = users;
        //populate DOM
        document.getElementById('list').innerHTML = '';
        console.log('users', this.users);
        if (this.users.length > 0) {
            for (let user of this.users) {
                document.getElementById('list').innerHTML += '<li>' + user['username'] + '</li>';
                console.log('user', user);
            }
        } else {
            document.getElementById('list').innerHTML += '<div>All items are deleted</div>';
            throw Error("No items in te list")
        }

    }

    update(users) {
        console.log('updated users in view', users);
        this.render(users);
    }
}

class UserModel {

    userData = [];
    observers = [];
    constructor() {

    }

    init = function () {
        return new Promise((resolve, reject) => {
            new UserService().getData()
                .then((data) => {
                    this.userData = data;
                    resolve();
                }, error => {
                    console.log('error in getting users');
                    reject();
                });
        });
    }

    registerObserver = function (observer) {
        this.observers.push(observer);
    }

    notifyAll = function () {
        this.observers.forEach((observer) => {
            console.log('updated user data', this.userData);
            observer.update(this.userData);
        });
    }
}


class UserService {
    constructor() {

    }
    getData = () => {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            console.log('inside xhr');
            // Setup our listener to process completed requests
            xhr.onload = function () {
                let userData = [];
                // Process our return data
                if (xhr.status >= 200 && xhr.status < 300) { // This will run when the request is successful
                    userData = JSON.parse(xhr.response).users;
                    console.log("type", typeof (userData));
                    console.log('success!', userData);
                }
                resolve(userData);
            };
            xhr.onerror = function (e) {
                console.log("err", xhr.statusText);
                throw Error("Error retrieving users")
                reject();
            }
            //Since simple server we have allowed all origin
            xhr.open('GET', 'http://localhost:1234/users', true);
            xhr.send();

        });
    }
}

class ErrorHandler {
    constructor() {
        listenErrors();
    }
}

listenErrors = function () {
    window.onerror = function (message, source, lineno, colno, error) {
        var string = message.toLowerCase();
        console.log("message", message, "indexOf", string.indexOf(substring), 'error msg', error)
        var substring = "script error";
        if (string.indexOf(substring) > -1) {
            console.log('Script Error: See Browser Console for Detail');
        } else {
            var message = [
                'Message: ' + message,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Column: ' + columnNo,
                'Error object: ' + JSON.stringify(error)
            ].join(' - ');

            console.log(message);
        }

        return false;
    }
}