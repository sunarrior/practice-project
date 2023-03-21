import { dataSource } from "../config/data-source.config";
import ProductImage from "../entity/ProductImage";

const productImageRepos = dataSource.getRepository(ProductImage);

const getProductThumbnail = async (
  productid: number
): Promise<ProductImage> => {
  const result = await productImageRepos.find({
    where: {
      product: {
        id: productid,
      },
    },
  });
  const thumbnail = result.filter((image) => image.isDefault === true);
  return thumbnail[0];
};

export default {
  getProductThumbnail,
};
