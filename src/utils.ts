
import { Product } from "./model/product";
import { Response } from "./model/response";
import {
    makeInitialRequest,
    makeNextPageRequests,
    populateVideoPreviewUrls
} from "./services/product";


// Function to populate next set of products into our all products DS
const populateNextProducts = async (allProducts: Array<Product>, pageNo: number, pageSize: number) => {
    //Can use Promise.all here but if 1 api fails, other ones will not proceed
    // Also Gateway not handling concurrent requests in short span of time

    let products: Array<Product> = await makeNextPageRequests(pageNo, pageSize);
    //  To avoid unnecessary properties
    products = products.map((product: Product) => {
        return { name: product.name, sku: product.sku, video_count: product.video_count, video_urls: [] };
    });
    allProducts.push(...products);
}

// Main function to fetch all product details and add their corresponding video urls
const fetchDetails = async (): Promise<Array<Product>> => {
    try {
        let pageSize: number = 100;
        let response: Response = await makeInitialRequest(pageSize);
        let allProducts = Array<Product>();
        // To avoid unnecessary properties
        let products: Array<Product> = response.products.map((product: Product) => {
            return { name: product.name, sku: product.sku, video_count: product.video_count, video_urls: [] };
        })
        allProducts.push(...products);

        console.log("Processed page 1")

        // Process next set of pages and fetch products
        for (let i = 2; i <= response.pageCount; i++) {
            try {
                //   Have to process this 1 by 1 otherwise gateway giving timeout error
                await populateNextProducts(allProducts, i, pageSize);
                console.log(`Processed page ${i}`)
            } catch (err) {
                console.log(err);
                console.log("Error in processing page: " + i);
            }

        }


        // For testing to check video url working
        // allProducts[0].sku = "LO569SA80GXF";
        // allProducts[0].video_count = 1;

        // Filter out which products have video url and which dont
        // We dont need to process products that have zero video counts
        let noVideoProducts: Array<Product> = allProducts.filter(product => {
            return product.video_count == 0;
        })
        let videoProducts: Array<Product> = allProducts.filter(product => {
            return product.video_count != 0;
        })

        for (let i = 0; i < videoProducts.length; i++) {
            // Need to fetch this as well 1 by 1
            await populateVideoPreviewUrls(videoProducts[i]);
        }
        allProducts = Array<Product>();

        // First add video products
        allProducts.push(...videoProducts);
        allProducts.push(...noVideoProducts);
        return allProducts;


    } catch (err) {
        console.log(err);
        return Array<Product>();
    }
}

export {
    populateNextProducts,
    fetchDetails
}
