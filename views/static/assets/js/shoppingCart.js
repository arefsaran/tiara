// ***************************************************
// Shopping Cart functions

var shoppingCart = (function () {
    // Private methods and properties
    var cart = [];

    function Item(id, count, price, picture, name) {
        this.name = name;
        this.price = price;
        this.count = count;
        this.picture = picture;
        this.id = id;
    }

    function saveCart() {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }

    function loadCart() {
        cart = JSON.parse(localStorage.getItem("shoppingCart"));
        if (cart === null) {
            cart = [];
        }
    }

    loadCart();

    // Public methods and properties
    var obj = {};

    obj.addItemToCart = function (id, count, price, picture, name) {
        for (var i in cart) {
            if (cart[i].id === id) {
                cart[i].count = cart[i].count + count;
                saveCart();
                return;
            }
        }

        // console.log("addItemToCart:", name, price, count, picture, id);

        var item = new Item(id, count, price, picture, name);
        cart.push(item);
        saveCart();
    };

    obj.setCountForItem = function (id, count) {
        for (var i in cart) {
            if (cart[i].id === id) {
                cart[i].count = count;
                break;
            }
        }
        saveCart();
    };

    obj.removeItemFromCart = function (id) {
        // Removes one item
        for (var i in cart) {
            if (cart[i].id === id) {
                // "3" === 3 false
                cart[i].count--; // cart[i].count --
                if (cart[i].count === 0) {
                    cart.splice(i, 1);
                }
                break;
            }
        }
        saveCart();
    };

    obj.removeItemFromCartAll = function (id) {
        // removes all item id
        for (var i in cart) {
            if (cart[i].id === id) {
                cart.splice(i, 1);
                break;
            }
        }
        saveCart();
    };

    obj.clearCart = function () {
        cart = [];
        saveCart();
    };

    obj.countCart = function () {
        // -> return total count
        var totalCount = 0;
        for (var i in cart) {
            totalCount += cart[i].count;
        }

        return totalCount;
    };

    obj.totalCart = function () {
        // -> return total cost
        var totalCost = 0;
        for (var i in cart) {
            totalCost += cart[i].price * cart[i].count;
        }
        return totalCost;
    };

    obj.listCart = function () {
        // -> array of Items
        var cartCopy = [];
        // console.log("Listing cart");
        // console.log(cart);
        for (var i in cart) {
            // console.log(i);
            var item = cart[i];
            var itemCopy = {};
            for (var p in item) {
                itemCopy[p] = item[p];
            }
            itemCopy.total = item.price * item.count;
            cartCopy.push(itemCopy);
        }
        return cartCopy;
    };

    // ----------------------------
    return obj;
})();
