"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var fs = __importStar(require("fs"));
var getProductsApi = function (page, pageSize) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get("https://eve.theiconic.com.au/catalog/products?gender=female&page=" + page + "&page_size=" + pageSize + "&sort=popularity")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var getVideoPreviewUrl = function (sku) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get("https://eve.theiconic.com.au/catalog/products/" + sku + "/videos")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var makeInitialRequest = function (pageSize) { return __awaiter(void 0, void 0, void 0, function () {
    var products, resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getProductsApi(1, pageSize)];
            case 1:
                products = _a.sent();
                resp = {};
                if (products && products.data) {
                    resp.pageCount = products.data.page_count;
                }
                else {
                    throw new Error("Error fetching page count");
                }
                if (products && products.data && products.data._embedded && products.data._embedded.product) {
                    resp.products = products.data._embedded.product;
                }
                else {
                    throw new Error("Error fetching initial products details");
                }
                return [2 /*return*/, resp];
        }
    });
}); };
var makeNextRequests = function (page, pageSize) { return __awaiter(void 0, void 0, void 0, function () {
    var products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getProductsApi(page, pageSize)];
            case 1:
                products = _a.sent();
                if (products && products.data && products.data._embedded && products.data._embedded.product) {
                    return [2 /*return*/, products.data._embedded.product];
                }
                else {
                    throw new Error("Error fetching initial products details");
                }
                return [2 /*return*/];
        }
    });
}); };
var populateVideoPreviewUrls = function (videoProduct) { return __awaiter(void 0, void 0, void 0, function () {
    var resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getVideoPreviewUrl(videoProduct.sku)];
            case 1:
                resp = _a.sent();
                if (resp && resp.data && resp.data._embedded && resp.data._embedded.videos_url) {
                    videoProduct.video_urls = resp.data._embedded.videos_url.map(function (url) {
                        return url.url;
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
var populateAllProducts = function (allProducts, pageNo, pageSize) { return __awaiter(void 0, void 0, void 0, function () {
    var products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, makeNextRequests(pageNo, pageSize)];
            case 1:
                products = _a.sent();
                //  To avoid unnecessary properties
                products = products.map(function (product) {
                    return { name: product.name, sku: product.sku, video_count: product.video_count, video_urls: [] };
                });
                allProducts.push.apply(allProducts, products);
                return [2 /*return*/];
        }
    });
}); };
var startTask = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pageSize, response, allProducts, products, noVideoProducts, videoProducts, i, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                pageSize = 10;
                return [4 /*yield*/, makeInitialRequest(pageSize)];
            case 1:
                response = _a.sent();
                allProducts = Array();
                products = response.products.map(function (product) {
                    return { name: product.name, sku: product.sku, video_count: product.video_count, video_urls: [] };
                });
                allProducts.push.apply(allProducts, products);
                console.log("Processed page 1");
                // Uncomment next for loop if still commented
                // for (let i = 2; i <= response.pageCount; i++) {
                //     try {
                //      //   Have to process this 1 by 1 otherwise gateway giving timeout error
                //         await populateAllProducts(allProducts, i, pageSize);
                //         console.log(`Processed page ${i}`)
                //     } catch (err) {
                //         console.log("Error in processing page: " + i);
                //     }
                // }
                // For testing to check video url working
                allProducts[0].sku = "LO569SA80GXF";
                allProducts[0].video_count = 1;
                noVideoProducts = allProducts.filter(function (product) {
                    return product.video_count == 0;
                });
                videoProducts = allProducts.filter(function (product) {
                    return product.video_count != 0;
                });
                console.log(noVideoProducts.length);
                console.log(videoProducts.length);
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < videoProducts.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, populateVideoPreviewUrls(videoProducts[i])];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                fs.writeFile('out.json', JSON.stringify(__spreadArrays(videoProducts, noVideoProducts)), 'utf8', function () { });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
startTask();
