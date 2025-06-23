import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    categories {
      name
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query ($category: String!) {
    products(category: $category) {
      id
      name
      gallery
      prices {
        currency_symbol
        amount
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query ($id: String!) {
    product(id: $id) {
      id
      name
      description
      gallery
      prices {
        currency_symbol
        amount
      }
      attributes {
        id name type items {
          display_value value item_id
        }
      }
    }
  }
`;
