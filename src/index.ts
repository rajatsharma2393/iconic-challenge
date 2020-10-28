import axios from 'axios';
import { Product } from "./model/product";
import { Response } from "./model/response";

const getProductsApi = async (page: number, pageSize: number): Promise<any> => {
    try {
        return await axios.get(`https://eve.theiconic.com.au/catalog/products?gender=female&page=${page}&page_size=${pageSize}&sort=popularity`)
    } catch (error) {
        throw error;
    }
}

const makeInitialRequest = async (pageSize: number): Promise<Response> => {
    const products = await getProductsApi(1, pageSize);
    let resp = <Response>{};

    if (products && products.data) {
        resp.pageCount = products.data.page_count;

    } else {
        throw new Error("Error fetching page count");
    }

    if (products && products.data && products.data._embedded && products.data._embedded.product) {
        resp.products = products.data._embedded.product;
    } else {
        throw new Error("Error fetching initial products details");
    }

    return resp;

}

const makeNextRequests = async (): Promise<Product[]> => {
    // We have already made request for page 1
    return null;
}

const startTask = async (): Promise<void> => {
    try {
        let pageSize: number = 100;
        let response: Response = await makeInitialRequest(pageSize);
        let allProducts = Array<Product>();
        allProducts.push(...response.products);
        for (let i = 2; i <= response.pageCount; i++) {

        }

    } catch (err) {
        console.log(err);
    }
}

startTask();

