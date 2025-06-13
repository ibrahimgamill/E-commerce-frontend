// src/graphql/mutations.js
import { gql } from "@apollo/client";

export const PLACE_ORDER = gql`
  mutation PlaceOrder($cart: [OrderItemInput!]!) {
    placeOrder(cart: $cart) {
      success
      message
      orderId
    }
  }
`;
