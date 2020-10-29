

import {
    populateNextProducts,
    fetchDetails
} from "./../utils";
import { Product } from "./../model/product";
import { Response } from "./../model/response";

import { mocked } from 'ts-jest/utils'

import {
    makeInitialRequest,
    makeNextPageRequests,
    populateVideoPreviewUrls
} from './../services/product';

jest.mock('./../services/product', () => ({
    makeInitialRequest: jest.fn(),
    makeNextPageRequests: jest.fn(),
    populateVideoPreviewUrls: jest.fn()
}));

test('Test makeNextPageRequests adding new products data', async () => {
    let returnValue: Array<Product> = [{ name: "B", sku: "b", video_count: 0, video_urls: [] }, { name: "C", sku: "c", video_count: 1, video_urls: [] }];
    mocked(makeNextPageRequests).mockReturnValueOnce(Promise.resolve(returnValue));

    let allProducts: Array<Product> = [{ name: "A", sku: "a", video_count: 1, video_urls: [] }];

    populateNextProducts(allProducts, 1, 1).then(result => {
        expect(allProducts).toBeTruthy();
        expect(allProducts).toHaveLength(3);
    }).catch(err => {
        fail(err);
    })
})

test('Test populateNextProducts adding no new products data', () => {
    let returnValue: Array<Product> = [];
    mocked(makeNextPageRequests).mockReturnValueOnce(Promise.resolve([]));


    let allProducts: Array<Product> = [{ name: "A", sku: "a", video_count: 1, video_urls: [] }];
    populateNextProducts(allProducts, 1, 1).then(result => {
        expect(allProducts).toBeTruthy();
        expect(allProducts).toHaveLength(1);
    }).catch(err => {
        fail(err);
    })
})


test('Test populateNextProducts adding no new products data throw error', async () => {
    let returnValue: Array<Product> = [];
    mocked(makeNextPageRequests).mockImplementation(() => {
        throw new Error();
    });

    let allProducts: Array<Product> = [{ name: "A", sku: "a", video_count: 1, video_urls: [] }];

    await expect(populateNextProducts(allProducts, 1, 1))
        .rejects
        .toThrow(Error);
})


test('Test fetchDetails adding valid products with 1 page count', async () => {
    jest.clearAllMocks();
    let returnValue: Response = { pageCount: 1, products: [{ name: "A", sku: "a", video_count: 1, video_urls: [] }] };
    mocked(makeInitialRequest).mockReturnValueOnce(Promise.resolve(returnValue));

    fetchDetails().then(result => {
        expect(result).toBeTruthy();
        expect(result).toHaveLength(1);
        expect(makeInitialRequest).toHaveBeenCalled();
        expect(makeInitialRequest).toHaveBeenCalledTimes(1);
        expect(makeNextPageRequests).toHaveBeenCalledTimes(0);

    }).catch(err => {
        fail(err);

    })
})

test('Test fetchDetails adding valid products with 2 page count', async () => {

    jest.clearAllMocks();
    let returnValue: Response = { pageCount: 2, products: [{ name: "A", sku: "a", video_count: 1, video_urls: [] }] };
    mocked(makeInitialRequest).mockReturnValueOnce(Promise.resolve(returnValue));
    mocked(makeNextPageRequests).mockReturnValue(Promise.resolve([{ name: "A", sku: "a", video_count: 1, video_urls: [] }]));



    fetchDetails().then(result => {
        expect(result).toBeTruthy();
        expect(result).toHaveLength(2);
        expect(makeInitialRequest).toHaveBeenCalledTimes(1);
        expect(makeInitialRequest).toHaveBeenCalled();
        expect(makeNextPageRequests).toHaveBeenCalledTimes(1);
    }).catch(err => {
        fail(err);
    })
})
