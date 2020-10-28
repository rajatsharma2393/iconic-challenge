import axios from 'axios';
import * as fs from 'fs';
import { Product } from "./model/product";
import { Response } from "./model/response";

const getProductsApi = async (page: number, pageSize: number): Promise<any> => {
    return await axios.get(`https://eve.theiconic.com.au/catalog/products?gender=female&page=${page}&page_size=${pageSize}&sort=popularity`)

}

const getVideoPreviewUrl = async (sku: string): Promise<any> => {
    return await axios.get(`https://eve.theiconic.com.au/catalog/products/${sku}/videos`)
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

const makeNextRequests = async (page: number, pageSize: number): Promise<Product[]> => {
    const products = await getProductsApi(page, pageSize);
    if (products && products.data && products.data._embedded && products.data._embedded.product) {
        return products.data._embedded.product;
    } else {
        throw new Error("Error fetching initial products details");
    }
}

const populateVideoPreviewUrls = async (videoProducts: Array<Product>): Promise<Array<Product>> => {

    return new Promise(async (resolve, reject) => {
        let processedCount = 0;
        for (let i = 0; i < videoProducts.length; i++) {
            getVideoPreviewUrl(videoProducts[i].sku).then(resp => {
                processedCount++;
                if (resp && resp.data && resp.data._embedded && resp.data._embedded.videos_url) {
                    videoProducts[i].video_urls = resp.data._embedded.videos_url.map((url: any) => {
                        return url.url;
                    });
                }
                if (processedCount == videoProducts.length) {
                    resolve(videoProducts);
                }
            }).catch(err => {

                console.log("Error while fetching video for product : " + videoProducts[i].sku);
                processedCount++;
                if (processedCount == videoProducts.length) {
                    resolve(videoProducts);
                }
            });

        }
    });

}

const populateAllProducts = async (allProducts: Array<Product>, pageCount: number, pageSize: number) => {
    let processedCount = 1;
    return new Promise((resolve, reject) => {
        // We have already made request for page 1

        for (let i = 2; i <= pageCount; i++) {

            //Can use Promise.all here but if 1 api fails, other ones will not proceed

            makeNextRequests(i, pageSize).then((products) => {
                //  To avoid unnecessary properties
                products = products.map((product: Product) => {
                    return { name: product.name, sku: product.sku, video_count: product.video_count, video_urls: [] };
                });
                processedCount++;

                console.log(`Processed page ${i}`)
                allProducts.push(...products);
                if (processedCount == pageCount) {
                    resolve(processedCount);
                }

            }).catch(err => {
                processedCount++;
                console.log("Error fetching page :" + i);
                if (processedCount == pageCount) {
                    resolve(processedCount);
                }
            });
        }
    })

}

const startTask = async (): Promise<void> => {
    try {
        let pageSize: number = 10;
        let response: Response = await makeInitialRequest(pageSize);
        let allProducts = Array<Product>();
        // To avoid unnecessary properties
        let products: Array<Product> = response.products.map((product: Product) => {
            return { name: product.name, sku: product.sku, video_count: product.video_count, video_urls: [] };
        })
        allProducts.push(...products);

        console.log("Processed page 1")

        // Uncomment next line if still commented
        await populateAllProducts(allProducts, response.pageCount, pageSize);

        // For testing
        // allProducts[0].sku = "LO569SA80GXF";
        // allProducts[0].video_count = 1;


        // We dont need to process products that have zero video counts
        let noVideoProducts: Array<Product> = products.filter(product => {
            return product.video_count == 0;
        })
        let videoProducts: Array<Product> = products.filter(product => {
            return product.video_count != 0;
        })

        if (videoProducts.length > 0) {
            videoProducts = await populateVideoPreviewUrls(videoProducts);
        }

        fs.writeFile('out.json', JSON.stringify([...videoProducts, ...noVideoProducts]), 'utf8', () => { });


    } catch (err) {
        console.log(err);
    }
}

startTask();


