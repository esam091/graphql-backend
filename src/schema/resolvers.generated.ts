/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { me as Query_me } from './user/resolvers/Query/me';
import    { product as Query_product } from './product/resolvers/Query/product';
import    { searchProducts as Query_searchProducts } from './product/resolvers/Query/searchProducts';
import    { shop as Query_shop } from './shop/resolvers/Query/shop';
import    { user as Query_user } from './user/resolvers/Query/user';
import    { addStock as Mutation_addStock } from './product/resolvers/Mutation/addStock';
import    { createProduct as Mutation_createProduct } from './product/resolvers/Mutation/createProduct';
import    { createShop as Mutation_createShop } from './shop/resolvers/Mutation/createShop';
import    { deleteProduct as Mutation_deleteProduct } from './product/resolvers/Mutation/deleteProduct';
import    { setProductActive as Mutation_setProductActive } from './product/resolvers/Mutation/setProductActive';
import    { signIn as Mutation_signIn } from './user/resolvers/Mutation/signIn';
import    { signUp as Mutation_signUp } from './user/resolvers/Mutation/signUp';
import    { updateAddress as Mutation_updateAddress } from './shop/resolvers/Mutation/updateAddress';
import    { PageInfo } from './base/resolvers/PageInfo';
import    { Product } from './product/resolvers/Product';
import    { ProductConnection } from './product/resolvers/ProductConnection';
import    { ProductEdge } from './product/resolvers/ProductEdge';
import    { Shop } from './shop/resolvers/Shop';
import    { User } from './user/resolvers/User';
import    { DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { me: Query_me,product: Query_product,searchProducts: Query_searchProducts,shop: Query_shop,user: Query_user },
      Mutation: { addStock: Mutation_addStock,createProduct: Mutation_createProduct,createShop: Mutation_createShop,deleteProduct: Mutation_deleteProduct,setProductActive: Mutation_setProductActive,signIn: Mutation_signIn,signUp: Mutation_signUp,updateAddress: Mutation_updateAddress },
      
      PageInfo: PageInfo,
Product: Product,
ProductConnection: ProductConnection,
ProductEdge: ProductEdge,
Shop: Shop,
User: User,
DateTime: DateTimeResolver
    }