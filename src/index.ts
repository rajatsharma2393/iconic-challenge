
import * as fs from "fs";
import { Product } from "./model/product";
import { fetchDetails } from "./utils";

const startTask = async () => {
    let products: Array<Product> = await fetchDetails();
    fs.writeFile('out.json', JSON.stringify(products), 'utf8', () => { });
}

startTask();