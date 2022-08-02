class Game {
    constructor(onchange_callback) {
        this.firms = [];

        this.onchange_callback =
            () => onchange_callback(this.get_all_products());
    }

    get_all_products() {
        let all_products = [];

        this.firms.forEach(firm => {

            firm.series.forEach(series => {

                series.products.forEach(product => {

                    all_products.push(product);

                });

            });

        });

        return all_products;
    }

    random_color() {
        let colors = ["#1877F2", "#F3425F", "#9360F7", "#F7B928", "#45BD62", "#FF66BF", "#54C7EC", "#2ABBA7", "#FB724B"];
        let random_color = colors[Math.floor(Math.random() * colors.length)];
        return random_color;
    }

    new_firm(name) {
        let color = this.random_color();
        let firm = new Firm(name, color);
        firm.onchange_callback = this.onchange_callback;
        firm.get_all_products_callback = () => this.get_all_products();

        let firm_index = this.firms.push(firm);

        this.onchange_callback();

        return firm_index;
    }

    adjustment() {
        let all_products = this.get_all_products();
        all_products.forEach(product => {
            product.adjustment();
        });
    }
}

class Firm {
    constructor(name, color) {
        this.name = name;
        this.color = color;

        this.series = [];

        this.money = 0;

        this.bankrupted = false;

        this.onchange_callback = undefined;
        this.get_all_products_callback = undefined;
    }

    new_series(name) {
        if (this.bankrupted) {
            return false;
        }

        let series = new Series(this, name);
        series.onchange_callback = this.onchange_callback;
        series.get_all_products_callback = this.get_all_products_callback;
        series.change_money = (amount) => this.change_money(amount);

        let series_index = this.series.push(series)

        this.onchange_callback();

        return series_index;
    }

    change_money(amount) {
        this.money += Math.round(amount || 0);

        if (this.money < 0
            && this.bankrupted != undefined) {
            this.bankrupt();
        }

        this.onchange_callback();
    }

    // TODO: Transfer money (may be profit or debt) to another legal entity (auction???)
    bankrupt() {
        this.bankrupted = undefined;
        this.series.forEach(series => {
            series.stop_releasing();
        });
        this.bankrupted = true;
        this.onchange_callback();
    }
}

class Series {
    constructor(firm, name) {
        this.firm = firm;
        this.name = name;

        this.products = [];

        this.is_stop_releasing = false;

        this.onchange_callback = undefined;
        this.get_all_products_callback = undefined;
        this.change_money = undefined;
    }

    new_product(name, cost, price) {
        if (this.is_stop_releasing) {
            return false;
        }

        if (!name) {
            name = this.products.length + 1;
        }

        let product = new Product(this.firm, this, name, cost, price);
        product.onchange_callback = this.onchange_callback;
        product.get_all_products_callback = this.get_all_products_callback;
        product.change_money = this.change_money;

        let product_index = this.products.push(product);

        this.onchange_callback();

        return product_index;
    }

    stop_releasing() {
        this.products.forEach(product => {
            product.retire();
        });
        this.is_stop_releasing = true;
        this.onchange_callback();
    }
}

class Product {
    constructor(firm, series, name, cost, price) {
        this.firm = firm;
        this.series = series;
        this.name = name;

        this.cost = cost;
        this.price = {
            release: price,
            current: price
        };
        this.quantity = {
            in_circulation: 0,
            in_stock: 0
        };

        this.retired = false;

        this.onchange_callback = undefined;
        this.get_all_products_callback = undefined;
        this.change_money = undefined;
    }

    produce(amount) {
        if (this.retired) {
            return false;
        }

        let total_cost = this.cost * amount;
        this.quantity.in_stock += amount;

        this.change_money(-total_cost);

        this.onchange_callback();

        return total_cost;
    }

    calculate_AAPSC() {
        /* AAPSC = Adjusted Average Price (of products with the) Same Cost */

        let all_products = this.get_all_products_callback();

        let sum_of_values = 0;
        let amount_of_values = 0;

        all_products.forEach(product => {
            if (product == this) {
                return false;
            }

            if (product.cost == this.cost) {
                sum_of_values += product.price.current;
                amount_of_values += 1;
            }
        });

        let AAPSC = sum_of_values / amount_of_values;
        return AAPSC;
    }

    calculate_highest_cost() {
        let highest_cost = 0;

        let all_products = this.get_all_products_callback();

        all_products.forEach(product => {
            if (product.cost > highest_cost) {
                highest_cost = product.cost;
            }
        });

        return highest_cost;
    }

    adjustment() {
        if (this.retired) {
            return false;
        }

        let AAPSC = this.calculate_AAPSC() || this.price.current;
        let highest_cost = this.calculate_highest_cost() || this.cost;
        let rate =
            ((1 - (this.price.current / AAPSC) + (this.cost / this.price.current)) / 10)
            + ((0.5 - Math.random()) / 1000)
            + ((this.cost / highest_cost) / 20);
        let price_difference = Math.floor(this.price.current * rate) || 1;
        let quantity_difference = Math.floor(this.quantity.in_circulation * rate) || 1;

        this.price.current += price_difference;

        if (quantity_difference < 0) {
            this.quantity.in_circulation += quantity_difference;
        } else {
            this.quantity.in_circulation += quantity_difference;
            this.quantity.in_stock -= quantity_difference;

            let adjustment_revenue = this.price.current * quantity_difference;
            this.change_money(adjustment_revenue);
        }

        if (this.quantity.in_stock < 0) {
            this.produce(
                quantity_difference * Math.round(Math.random() * 10)
            );
        }

        if (this.quantity.in_circulation <= 0) {
            this.retire();
        }

        this.onchange_callback();
    }

    liquidate(liquidation_amount) {
        if (this.retired) {
            return false;
        }

        if (!liquidation_amount) {
            liquidation_amount = this.quantity.in_stock;
        }

        let AAPSC = this.calculate_AAPSC();
        let liquidation_price = this.price.current * (1 - this.price.current / AAPSC);
        let liquidation_revenue = liquidation_amount * liquidation_price;

        this.quantity.in_stock -= liquidation_amount;

        this.change_money(liquidation_revenue);

        this.onchange_callback();
    }

    retire() {
        this.liquidate();
        this.change_money(this.quantity.in_circulation * this.price.current);

        this.quantity.in_circulation = 0;
        this.price.current = 0;
        this.retired = true;

        this.onchange_callback();
    }
}