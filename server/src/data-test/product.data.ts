import Product from "../entity/Product";

const product001 = new Product();
product001.name = "Product001";
product001.quantity = 20;
product001.price = 1000;
product001.description = "Description Product001";

const product002 = new Product();
product002.name = "Product002";
product002.quantity = 20;
product002.price = 2000;
product002.description = "Description Product002";

const product003 = new Product();
product003.name = "Product003";
product003.quantity = 20;
product003.price = 3000;
product003.description = "Description Product003";

export { product001, product002, product003 };
